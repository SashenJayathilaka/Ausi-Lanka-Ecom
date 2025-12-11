import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";
import { Request, Response } from "express";

dotenv.config();

interface ProductData {
  title: string | null;
  price: string | null;
  image: string | null;
  size: string | null;
  retailer: string;
}

interface ScrapeResult {
  url: string;
  title?: string;
  price?: string;
  image?: string;
  size?: string | null;
  retailer?: string;
  calculatedPrice?: string;
  success: boolean;
  error?: string;
}

interface ScrapeResponse {
  results: ScrapeResult[];
  total: number;
  successful: number;
  failed: number;
}

export const scrapeWoolworthsProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const productUrls = req.query.url as string | string[] | undefined;
  const rateParam = req.query.rate as string | undefined;
  const rate = rateParam ? parseFloat(rateParam) : undefined;

  if (!productUrls) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  if (
    !Array.isArray(productUrls) &&
    !productUrls.includes("woolworths.com.au")
  ) {
    return res.status(400).json({ error: "Invalid Woolworths URL" });
  }

  const urls: string[] = Array.isArray(productUrls)
    ? productUrls
    : [productUrls];
  let browser: Browser | null = null;

  try {
    // Configure browser launch with better error handling
    const launchOptions: LaunchOptions = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
      ],
      timeout: 30000, // 30 second timeout for browser launch
    };

    // Use CHROME_PATH if available, otherwise use default Chromium
    if (process.env.CHROME_PATH) {
      launchOptions.executablePath = process.env.CHROME_PATH;
      //console.log("Using custom Chrome path:", process.env.CHROME_PATH);
    } else {
      console.log("Using default Chromium");
    }

    browser = await puppeteer.launch(launchOptions);
    //console.log("Browser launched successfully");

    const results: ScrapeResult[] = [];

    for (const productUrl of urls) {
      let page: Page | null = null;
      try {
        // Validate URL for Woolworths
        if (!productUrl.includes("woolworths.com.au")) {
          results.push({
            url: productUrl,
            error: "Invalid Woolworths URL",
            success: false,
          });
          continue;
        }

        page = await browser.newPage();

        // Set user agent before other headers
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        );

        await page.setExtraHTTPHeaders({
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          Referer: "https://www.woolworths.com.au/",
        });

        // Disable automation flags
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, "webdriver", {
            get: () => false,
          });
        });

        //console.log(`Navigating to: ${productUrl}`);
        await page.goto(productUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Wait for page to load properly
        await new Promise((r) => setTimeout(r, 3000));

        // Try to wait for key elements
        try {
          await page.waitForSelector("h1", { timeout: 5000 });
        } catch {}

        const productData = (await page.evaluate(() => {
          const extractText = (selectors: string[]): string | null => {
            for (const sel of selectors) {
              try {
                const el = document.querySelector(sel);
                if (el && el.textContent) {
                  const text = el.textContent.trim();
                  if (text) return text;
                }
              } catch {}
            }
            return null;
          };

          const findProductImage = (): string | null => {
            try {
              // Try direct image selector first
              const highPriorityImg = document.querySelector<HTMLImageElement>(
                'img[fetchpriority="high"]'
              );
              if (
                highPriorityImg?.src &&
                highPriorityImg.src.includes("woolworths.com.au")
              ) {
                return highPriorityImg.src;
              }

              // Try to get image from product schema
              const schemaScript = document.querySelector(
                'script[type="application/ld+json"]'
              );
              if (schemaScript?.textContent) {
                try {
                  const schema = JSON.parse(schemaScript.textContent);
                  if (schema.image) {
                    if (Array.isArray(schema.image)) {
                      return schema.image[0];
                    }
                    return schema.image;
                  }
                } catch {}
              }

              // Try various image selectors
              const selectors = [
                ".product-image-carousel_component_main-image__9Qe4H img",
                ".shelfProductTile-image img",
                "img.product-image",
                "img[alt*='pack']",
                "img",
              ];

              for (const selector of selectors) {
                const imgs = Array.from(
                  document.querySelectorAll<HTMLImageElement>(selector)
                );
                const validImg = imgs.find(
                  (img) =>
                    img.src &&
                    (img.src.includes("woolworths.com.au") ||
                      img.src.includes("assets.woolworths")) &&
                    !img.src.includes("logo") &&
                    !img.src.includes("icon")
                );
                if (validImg) return validImg.src;
              }

              return null;
            } catch {
              return null;
            }
          };

          const title = extractText([
            "h1.product-title_component_product-title__azQKW",
            "h1.product-title",
            "h1",
            "title",
          ]);

          const price = extractText([
            ".product-price_component_price-lead__vlm8f",
            ".product-price",
            ".Price",
            ".price",
            "[data-product-price]",
          ]);

          const imageUrl = findProductImage();

          // Extract size from title if available
          let size: string | null = null;
          if (title) {
            const sizeMatch = title.match(
              /(Size|Pack)\s*(\d+|[\d\.]+\s?(kg|g|ml|l))/i
            );
            if (sizeMatch) size = sizeMatch[0];
          }

          return {
            title: title,
            price: price,
            image: imageUrl,
            size: size,
            retailer: "Woolworths",
          };
        })) as ProductData;

        if (!productData.price) {
          throw new Error("Failed to extract price from page");
        }

        if (!rate || isNaN(rate)) {
          throw new Error("Missing or invalid exchange rate");
        }

        const calPrice = await calculate(
          productData.price || "$0",
          productUrl,
          rate
        );

        results.push({
          url: productUrl,
          title: productData.title || "Title not found",
          price: productData.price || "Price not found",
          image: productData.image || "Image not found",
          size: productData.size || null,
          retailer: "Woolworths",
          calculatedPrice: calPrice,
          success: true,
        });

        //console.log(`Successfully scraped: ${productUrl}`);
      } catch (err) {
        const error = err as Error;
        console.error(`Scrape error for ${productUrl}:`, error.message);
        results.push({
          url: productUrl,
          error: `Scraping failed: ${error.message}`,
          success: false,
        });
      } finally {
        if (page) {
          await page.close().catch(() => {});
        }
      }
    }

    await browser.close();
    browser = null;

    const response: ScrapeResponse = {
      results,
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };

    return res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error("Browser error:", error.message);

    // Clean up browser instance if it exists
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        const closeError = closeErr as Error;
        console.error("Error closing browser:", closeError.message);
      }
    }

    // More specific error messages
    if (error.message.includes("executable doesn't exist")) {
      return res.status(500).json({
        error:
          "Chrome executable not found. Please check CHROME_PATH environment variable.",
        details: error.message,
      });
    } else if (error.message.includes("timeout")) {
      return res.status(500).json({
        error: "Browser launch timeout. Check system resources.",
        details: error.message,
      });
    } else {
      return res.status(500).json({
        error: "Browser initialization failed.",
        details: error.message,
        suggestion:
          "Check if Chrome is installed and CHROME_PATH is set correctly",
      });
    }
  }
};
