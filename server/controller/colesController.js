import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE, // each job uses a new page
      maxConcurrency: 3, // adjust depending on EC2 size
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // --- Coles scraping task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 5000));

      const productData = await page.evaluate(() => {
        const titleEl = document.querySelector("h1.product__title");
        const priceEl = document.querySelector("span.price__value");
        const imgEl = document.querySelector(
          'img[data-testid="product-thumbnail-image-0"]'
        );
        const sizeEl = document.querySelector(".product__size");

        return {
          title: titleEl ? titleEl.textContent.trim() : null,
          price: priceEl ? priceEl.textContent.trim() : null,
          image: imgEl ? imgEl.src || imgEl.getAttribute("data-src") : null,
          size: sizeEl ? sizeEl.textContent.trim() : null,
          retailer: "Coles",
        };
      });

      const calPrice = await calculate(productData.price, url, rate);

      return {
        title: productData.title || "Title not found",
        price: productData.price || "Price not found",
        image: productData.image
          ? productData.image.startsWith("http")
            ? productData.image
            : `https://shop.coles.com.au${productData.image}`
          : "Image not found",
        size: productData.size || null,
        retailer: "Coles",
        calculatedPrice: calPrice,
      };
    });
  }
  return cluster;
};

// --- API handler ---
export const scrapeColesProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  if (!productUrl.includes("coles.com.au")) {
    return res.status(400).json({ error: "Invalid Coles URL" });
  }

  try {
    const cluster = await initCluster();
    const result = await cluster.execute({ url: productUrl, rate });

    res.json(result);
  } catch (err) {
    console.error("Coles scrape error:", err);
    res.status(500).json({ error: "Failed to scrape Coles product" });
  }
};
