import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

export const scrapeOfficeworksProduct = async (req, res) => {
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
      headless: "new",
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
      console.log("Using custom Chrome path:", process.env.CHROME_PATH);
    } else {
      console.log("Using default Chromium");
    }

    browser = await puppeteer.launch(launchOptions);
    console.log("Browser launched successfully");

    const results = [];

    for (const productUrl of urls) {
      let page = null;
      try {
        // Validate URL for Officeworks
        if (!productUrl.includes("officeworks.com.au")) {
          results.push({
            url: productUrl,
            error: "Invalid Officeworks URL",
            success: false,
          });
          continue;
        }

        page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );

        await page.setViewport({ width: 1280, height: 800 });

        console.log(`Navigating to: ${productUrl}`);
        await page.goto(productUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Wait for critical elements with multiple selector options
        await Promise.all([
          page
            .waitForSelector(
              'h1[itemprop="name"], h1.product-title, h1.sc-hKinHC',
              { timeout: 15000 }
            )
            .catch(() => {}),
          page
            .waitForSelector('[data-testid="price"], .price-text', {
              timeout: 15000,
            })
            .catch(() => {}),
          page
            .waitForSelector(
              ".image-gallery-image img, .product-image-main img",
              {
                timeout: 15000,
              }
            )
            .catch(() => {}),
        ]);

        await new Promise((r) => setTimeout(r, 2000));

        const productData = await page.evaluate(() => {
          // Enhanced title extraction with multiple fallbacks
          const getTitle = () => {
            const selectors = [
              'h1[itemprop="name"]', // Semantic markup
              "h1.product-title", // Common class
              "h1.sc-hKinHC", // Older class
              '[data-testid="product-title"]', // Data attribute
              "h1", // Fallback to any h1
            ];

            for (const selector of selectors) {
              const el = document.querySelector(selector);
              if (el) return el.textContent.trim();
            }
            return null;
          };

          // Price extraction with better cleaning
          const getPrice = () => {
            const priceEl =
              document.querySelector('[data-testid="price"]') ||
              document.querySelector(".price-text") ||
              document.querySelector(".product-price__price");

            if (!priceEl) return null;

            let priceText = priceEl.textContent.trim();
            // Handle prices like "$119.00", "$119", "119.00", etc.
            const priceMatch = priceText.match(/(\d+\.?\d*)/);
            return priceMatch
              ? `$${parseFloat(priceMatch[0]).toFixed(2)}`
              : null;
          };

          // Image extraction with URL validation
          const getImage = () => {
            const imgEl =
              document.querySelector(".image-gallery-image img") ||
              document.querySelector(".product-image-main img") ||
              document.querySelector('img[loading="eager"]');

            if (!imgEl) return null;

            let imgUrl = imgEl.src || imgEl.getAttribute("data-src");
            if (!imgUrl) return null;

            // Ensure proper URL format
            if (imgUrl.startsWith("//")) return `https:${imgUrl}`;
            if (!imgUrl.startsWith("http"))
              return `https://www.officeworks.com.au${
                imgUrl.startsWith("/") ? "" : "/"
              }${imgUrl}`;
            return imgUrl;
          };

          return {
            title: getTitle(),
            price: getPrice(),
            image: getImage(),
            productCode:
              document
                .querySelector(".product-code__value")
                ?.textContent?.trim() || null,
          };
        });

        // Modified validation to accept cases where we have price but missing title
        if (!productData.price) {
          throw new Error(
            `Missing essential data. Title: ${
              productData.title || "Not found"
            }, Price: Not found`
          );
        }

        const calPrice = await calculate(productData.price, productUrl, rate);

        results.push({
          url: productUrl,
          title: productData.title || "Title not available",
          price: productData.price,
          image: productData.image || "Image not available",
          productCode: productData.productCode,
          retailer: "Officeworks",
          calculatedPrice: calPrice,
          success: true,
        });

        console.log(`Successfully scraped: ${productUrl}`);
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
