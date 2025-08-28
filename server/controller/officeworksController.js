import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 3, // adjust based on EC2 instance size
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // --- Officeworks scraping task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

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
            { timeout: 15000 }
          )
          .catch(() => {}),
      ]);

      const productData = await page.evaluate(() => {
        const getTitle = () => {
          const selectors = [
            'h1[itemprop="name"]',
            "h1.product-title",
            "h1.sc-hKinHC",
            '[data-testid="product-title"]',
            "h1",
          ];
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el.textContent.trim();
          }
          return null;
        };

        const getPrice = () => {
          const priceEl =
            document.querySelector('[data-testid="price"]') ||
            document.querySelector(".price-text") ||
            document.querySelector(".product-price__price");

          if (!priceEl) return null;

          const priceText = priceEl.textContent.trim();
          const priceMatch = priceText.match(/(\d+\.?\d*)/);
          return priceMatch ? `$${parseFloat(priceMatch[0]).toFixed(2)}` : null;
        };

        const getImage = () => {
          const imgEl =
            document.querySelector(".image-gallery-image img") ||
            document.querySelector(".product-image-main img") ||
            document.querySelector('img[loading="eager"]');

          if (!imgEl) return null;
          let imgUrl = imgEl.src || imgEl.getAttribute("data-src");
          if (!imgUrl) return null;

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

      if (!productData.price) {
        throw new Error(
          `Missing essential data. Title: ${
            productData.title || "Not found"
          }, Price: Not found`
        );
      }

      const calPrice = await calculate(productData.price, url, rate);

      return {
        title: productData.title || "Title not available",
        price: productData.price,
        image: productData.image || "Image not available",
        productCode: productData.productCode,
        retailer: "Officeworks",
        url,
        calculatedPrice: calPrice,
      };
    });
  }

  return cluster;
};

// --- API handler ---
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
    const cluster = await initCluster();
    const result = await cluster.execute({ url: productUrl, rate });
    res.json(result);
  } catch (err) {
    console.error("Officeworks scrape error:", err);
    res.status(500).json({
      error: "Failed to scrape Officeworks product",
      details: err.message,
    });
  }
};
