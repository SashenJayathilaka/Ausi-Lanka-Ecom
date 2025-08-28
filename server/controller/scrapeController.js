import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 3, // adjust based on your needs
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // --- Define Chemist Warehouse scraping task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      await new Promise((r) => setTimeout(r, 3000));

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
          // Chemist Warehouse specific image selector
          const img = await page.$(
            "div.w-full.overflow-hidden button:nth-child(1) img"
          );
          if (img) {
            const src = await page.evaluate(
              (el) => el.getAttribute("src"),
              img
            );
            if (src?.startsWith("http")) return src;
            if (src) return `https://www.chemistwarehouse.com.au${src}`;
          }
        } catch {}

        // Fallback to meta image
        try {
          const metaImg = await page.$eval(
            'meta[property="og:image"]',
            (el) => el.content
          );
          if (metaImg) return metaImg;
        } catch {}

        return null;
      };

      const extractPrice = async () => {
        const priceSelectors = [
          ".product-price-now",
          ".product-price",
          ".price",
          "h2.display-l.text-colour-title-light",
          "[data-product-price]",
          ".special-price",
          ".Price",
        ];

        for (const sel of priceSelectors) {
          try {
            const priceText = await page.$eval(sel, (el) =>
              el.textContent.trim()
            );
            if (priceText) return priceText;
          } catch {}
        }
        return null;
      };

      const title =
        (await extractText([
          "h1.product-title",
          "h1.product-name",
          "h1.title",
          "h1",
        ])) ||
        (await page
          .$eval('meta[property="og:title"]', (el) => el.content)
          .catch(() => null)) ||
        "Title not found";

      const price = (await extractPrice()) || "Price not found";
      const image = (await extractImage()) || "Image not found";

      const calPrice = await calculate(price, url, rate);

      return { title, price, image, calculatedPrice: calPrice };
    });
  }
  return cluster;
};

// API handler
export const scrapeProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  try {
    const cluster = await initCluster();
    const result = await cluster.execute({ url: productUrl, rate });
    res.json(result);
  } catch (err) {
    console.error("Scrape error:", err.message);
    res.status(500).json({ error: "Scraping failed." });
  }
};

// Graceful shutdown
export const closeCluster = async () => {
  if (cluster) {
    await cluster.idle();
    await cluster.close();
    cluster = null;
  }
};
