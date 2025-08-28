import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

export const scrapeOfficeworksProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  if (!productUrl.includes("officeworks.com.au")) {
    return res.status(400).json({ error: "Invalid Officeworks URL" });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 60000 });

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
        .waitForSelector(".image-gallery-image img, .product-image-main img", {
          timeout: 15000,
        })
        .catch(() => {}),
    ]);

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
        return priceMatch ? `$${parseFloat(priceMatch[0]).toFixed(2)}` : null;
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
          document.querySelector(".product-code__value")?.textContent?.trim() ||
          null,
      };
    });

    await browser.close();

    // Modified validation to accept cases where we have price but missing title
    if (!productData.price) {
      throw new Error(
        `Missing essential data. Title: ${
          productData.title || "Not found"
        }, Price: Not found`
      );
    }

    const calPrice = await calculate(productData.price, productUrl, rate);

    res.json({
      title: productData.title || "Title not available",
      price: productData.price,
      image: productData.image || "Image not available",
      productCode: productData.productCode,
      retailer: "Officeworks",
      url: productUrl,
      calculatedPrice: calPrice,
    });
  } catch (err) {
    console.error("Officeworks scrape error:", err);
    res.status(500).json({
      error: "Failed to scrape Officeworks product",
      details: err.message,
      suggestion:
        "Please verify the page structure. If the issue persists, we may need to update our selectors.",
    });
  }
};
