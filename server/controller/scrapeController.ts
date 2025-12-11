import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

interface ScrapeResult {
  url: string;
  title?: string;
  price?: string;
  image?: string;
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

export const scrapeProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productUrls = req.query.url as string | string[];
  const rate = parseFloat(req.query.rate as string);

  if (!productUrls) {
    res.status(400).json({ error: "Missing `url` query parameter." });
    return;
  }

  const urls = Array.isArray(productUrls) ? productUrls : [productUrls];
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
    } else {
      console.log("Using default Chromium");
    }

    browser = await puppeteer.launch(launchOptions);

    const results: ScrapeResult[] = [];

    for (const productUrl of urls) {
      let page: Page | null = null;
      try {
        page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );

        await page.goto(productUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        await new Promise((r) => setTimeout(r, 2000));

        const extractText = async (
          selectors: string[]
        ): Promise<string | null> => {
          for (const sel of selectors) {
            try {
              const text = await page!.$eval(
                sel,
                (el) => el.textContent?.trim() || ""
              );
              if (text) return text;
            } catch {}
          }
          return null;
        };

        const extractImage = async (): Promise<string | null> => {
          try {
            const img = await page!.$(
              "div.w-full.overflow-hidden button:nth-child(1) img, img.product-image, meta[property='og:image']"
            );
            if (img) {
              const src = await page!.evaluate(
                (el) => el.getAttribute("src") || el.getAttribute("content"),
                img
              );
              if (src && src.startsWith("http")) return src;
              if (src) return `https://www.chemistwarehouse.com.au${src}`;
            }
          } catch {}
          return null;
        };

        const title =
          (await extractText(["h1.product-title", "h1", "title"])) ||
          (await page
            .$eval(
              'meta[property="og:title"]',
              (el) => el.getAttribute("content") || ""
            )
            .catch(() => null)) ||
          "Title not found";

        const price =
          (await extractText([
            ".product-price-now",
            ".product-price",
            ".Price",
            ".price",
            "[data-product-price]",
            "h2.display-l.text-colour-title-light",
          ])) || "Price not found";

        const image = (await extractImage()) || "Image not found";

        const calPrice = await calculate(price, productUrl, rate);

        results.push({
          url: productUrl,
          title,
          price,
          image,
          calculatedPrice: calPrice,
          success: true,
        });
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

    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error("Browser error:", error.message);

    // Clean up browser instance if it exists
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("Error closing browser:", (closeErr as Error).message);
      }
    }

    // More specific error messages
    if (error.message.includes("executable doesn't exist")) {
      res.status(500).json({
        error:
          "Chrome executable not found. Please check CHROME_PATH environment variable.",
        details: error.message,
      });
    } else if (error.message.includes("timeout")) {
      res.status(500).json({
        error: "Browser launch timeout. Check system resources.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Browser initialization failed.",
        details: error.message,
        suggestion:
          "Check if Chrome is installed and CHROME_PATH is set correctly",
      });
    }
  }
};
