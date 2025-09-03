import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

export const scrapeProduct = async (req, res) => {
  const productUrls = req.query.url;
  const rate = req.query.rate;

  if (!productUrls) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
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
        page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );

        //console.log(`Navigating to: ${productUrl}`);
        await page.goto(productUrl, {
          waitUntil: "domcontentloaded", // More reliable than networkidle2
          timeout: 30000,
        });

        await new Promise((r) => setTimeout(r, 2000));

        const extractText = async (selectors) => {
          for (const sel of selectors) {
            try {
              const text = await page.$eval(sel, (el) => el.textContent.trim());
              if (text) return text;
            } catch {}
          }
          return null;
        };

        const extractImage = async () => {
          try {
            const img = await page.$(
              "div.w-full.overflow-hidden button:nth-child(1) img, img.product-image, meta[property='og:image']"
            );
            if (img) {
              const src = await page.evaluate(
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
            .$eval('meta[property="og:title"]', (el) => el.content)
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
