import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 4, // Optimal for most EC2 instances
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      retryLimit: 2, // Retry failed jobs twice
      retryDelay: 3000, // Delay between retries
    });

    // --- Define Chemist Warehouse scraping task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      // Set a reasonable viewport
      await page.setViewport({ width: 1280, height: 800 });

      try {
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });

        // Wait exactly like the original code
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
            const img = await page.$(
              "div.w-full.overflow-hidden button:nth-child(1) img"
            );
            if (img) {
              const src = await page.evaluate(
                (el) => el.getAttribute("src"),
                img
              );
              return src?.startsWith("http")
                ? src
                : `https://www.chemistwarehouse.com.au${src}`;
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

        // Use the exact same selectors as the working original code
        const title =
          (await extractText(["h1.product-title"])) ||
          (await page
            .$eval('meta[property="og:title"]', (el) => el.content)
            .catch(() => null)) ||
          "Title not found";

        const price =
          (await extractText([
            ".product-price-now",
            ".product-price",
            ".price",
            "h2.display-l.text-colour-title-light",
          ])) || "Price not found";

        const image = (await extractImage()) || "Image not found";

        const calPrice = await calculate(price, url, rate);

        return { title, price, image, calculatedPrice: calPrice };
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        throw error; // Re-throw to let cluster handle retries
      }
    });
  }
  return cluster;
};

// API handler - same as original but using cluster
export const scrapeProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  // Validate it's a Chemist Warehouse URL
  if (!productUrl.includes("chemistwarehouse.com.au")) {
    return res
      .status(400)
      .json({ error: "URL must be from Chemist Warehouse" });
  }

  try {
    const clusterInstance = await initCluster();
    const result = await clusterInstance.execute({ url: productUrl, rate });
    res.json(result);
  } catch (err) {
    console.error("Scrape error:", err.message);

    // Provide more specific error messages
    if (err.message.includes("timeout")) {
      res.status(408).json({ error: "Request timeout. Please try again." });
    } else if (err.message.includes("Navigation")) {
      res
        .status(404)
        .json({ error: "Product page not found or inaccessible." });
    } else {
      res.status(500).json({ error: "Scraping failed. Please try again." });
    }
  }
};

// Graceful shutdown for your application
export const closeCluster = async () => {
  if (cluster) {
    try {
      await cluster.idle();
      await cluster.close();
      cluster = null;
      console.log("Cluster closed successfully");
    } catch (error) {
      console.error("Error closing cluster:", error);
    }
  }
};

// Health check endpoint
export const clusterHealth = async (req, res) => {
  try {
    if (cluster) {
      res.json({
        status: "healthy",
        queueSize: cluster.taskQueue.length,
        workers: cluster.workers.size,
      });
    } else {
      res.json({ status: "not_initialized" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
