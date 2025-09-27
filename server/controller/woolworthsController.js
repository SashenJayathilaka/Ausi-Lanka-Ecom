import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

export const scrapeWoolworthsProduct = async (req, res) => {
  const productUrls = req.query.url;
  const rate = req.query.rate;

  if (!productUrls) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  if (
    !Array.isArray(productUrls) &&
    !productUrls.includes("woolworths.com.au")
  ) {
    return res.status(400).json({ error: "Invalid Woolworths URL" });
  }

  const urls = Array.isArray(productUrls) ? productUrls : [productUrls];
  let browser = null;

  try {
    // Configure browser launch with better error handling
    const launchOptions = {
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

    const results = [];

    for (const productUrl of urls) {
      let page = null;
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
        await page.setExtraHTTPHeaders({
          Referer: "https://www.woolworths.com.au/",
        });
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );

        //console.log(`Navigating to: ${productUrl}`);
        await page.goto(productUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        await new Promise((r) => setTimeout(r, 5000));

        const productData = await page.evaluate(() => {
          const extractText = (selectors) => {
            for (const sel of selectors) {
              try {
                const el = document.querySelector(sel);
                if (el) {
                  const text = el.textContent.trim();
                  if (text) return text;
                }
              } catch {}
            }
            return null;
          };

          const findProductImage = () => {
            try {
              // Try to get image from product schema
              const schemaScript = document.querySelector(
                'script[type="application/ld+json"]'
              );
              if (schemaScript) {
                const schema = JSON.parse(schemaScript.textContent);
                if (schema.image && Array.isArray(schema.image)) {
                  return schema.image[0];
                } else if (schema.image) {
                  return schema.image;
                }
              }

              // Try various image selectors
              const selectors = [
                ".product-image-carousel_component_main-image__9Qe4H img",
                ".shelfProductTile-image img",
                'img[fetchpriority="high"]',
                "img.product-image",
                "img",
              ];

              for (const selector of selectors) {
                const imgs = Array.from(document.querySelectorAll(selector));
                const validImg = imgs.find(
                  (img) =>
                    img.src &&
                    img.src.includes("woolworths.com.au") &&
                    !img.src.includes("logo") &&
                    !img.src.includes("icon")
                );
                if (validImg) return validImg.src;
              }

              return null;
            } catch (e) {
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
          let size = null;
          if (title) {
            const sizeMatch = title.match(
              /(Size|Pack)\s*(\d+|[\d\.]+\s?(kg|g|ml|l))/i
            );
            if (sizeMatch) size = sizeMatch[0];
          }

          return {
            title,
            price,
            image: imageUrl,
            size,
            retailer: "Woolworths",
          };
        });

        const calPrice = await calculate(productData.price, productUrl, rate);

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
        console.error(`Scrape error for ${productUrl}:`, err.message);
        results.push({
          url: productUrl,
          error: `Scraping failed: ${err.message}`,
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

    res.json({
      results,
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    });
  } catch (err) {
    console.error("Browser error:", err.message);

    // Clean up browser instance if it exists
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("Error closing browser:", closeErr.message);
      }
    }

    // More specific error messages
    if (err.message.includes("executable doesn't exist")) {
      res.status(500).json({
        error:
          "Chrome executable not found. Please check CHROME_PATH environment variable.",
        details: err.message,
      });
    } else if (err.message.includes("timeout")) {
      res.status(500).json({
        error: "Browser launch timeout. Check system resources.",
        details: err.message,
      });
    } else {
      res.status(500).json({
        error: "Browser initialization failed.",
        details: err.message,
        suggestion:
          "Check if Chrome is installed and CHROME_PATH is set correctly",
      });
    }
  }
};
