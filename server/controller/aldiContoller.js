import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    const launchOptions = {
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 3,
      puppeteerOptions: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
        ],
        timeout: 30000,
      },
    };

    // Use CHROME_PATH if available
    if (process.env.CHROME_PATH) {
      launchOptions.puppeteerOptions.executablePath = process.env.CHROME_PATH;
      console.log("Using custom Chrome path:", process.env.CHROME_PATH);
    } else {
      console.log("Using default Chromium");
    }

    cluster = await Cluster.launch(launchOptions);

    // Error handling for cluster
    cluster.on("taskerror", (err, data) => {
      console.error(`Error processing ${data.url}:`, err.message);
    });

    // --- Define Aldi scraping task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      try {
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );

        console.log(`Navigating to: ${url}`);
        await page.goto(url, {
          waitUntil: "domcontentloaded",
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
            const imgSelectors = [
              "img.base-image.product-image__image",
              "img.product-details__image",
              "img.product-image",
              "meta[property='og:image']",
            ];

            for (const sel of imgSelectors) {
              try {
                if (sel === "meta[property='og:image']") {
                  const metaImg = await page.$eval(sel, (el) => el.content);
                  if (metaImg) return metaImg;
                } else {
                  const img = await page.$(sel);
                  if (img) {
                    const src = await page.evaluate(
                      (el) => el.getAttribute("src"),
                      img
                    );
                    if (src && src.startsWith("http")) return src;
                    if (src) return `https://www.aldi.com.au${src}`;
                  }
                }
              } catch {}
            }
          } catch {}
          return null;
        };

        const extractPrice = async () => {
          const priceSelectors = [
            "span.base-price__regular span",
            "span.base-price__regular",
            "span.product-details__price",
            "span.price",
            "span.product-price",
            "span.current-price",
            "span[data-qa='product-price']",
            ".product-details__price",
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
            "h1.product-details__title",
            "h1.product-title",
            "h1.product-name",
            "title",
          ])) ||
          (await page
            .$eval('meta[property="og:title"]', (el) => el.content)
            .catch(() => null)) ||
          "Title not found";

        const price = (await extractPrice()) || "Price not found";
        const image = (await extractImage()) || "Image not found";

        const calPrice = await calculate(price, url, rate);

        return {
          url,
          title,
          price,
          image,
          calculatedPrice: calPrice,
          success: true,
        };
      } catch (err) {
        console.error(`Scrape error for ${url}:`, err.message);
        return {
          url,
          error: `Scraping failed: ${err.message}`,
          success: false,
        };
      }
    });
  }
  return cluster;
};

// API handler
export const scrapeAldiProduct = async (req, res) => {
  const productUrls = req.query.url;
  const rate = req.query.rate;

  if (!productUrls) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  const urls = Array.isArray(productUrls) ? productUrls : [productUrls];

  try {
    const cluster = await initCluster();
    const results = [];

    // Execute all URLs in parallel using the cluster
    const scrapePromises = urls.map((url) =>
      cluster.execute({ url, rate }).catch((error) => ({
        url,
        error: `Cluster execution failed: ${error.message}`,
        success: false,
      }))
    );

    const scrapeResults = await Promise.all(scrapePromises);
    results.push(...scrapeResults);

    res.json({
      results,
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    });
  } catch (err) {
    console.error("Cluster error:", err.message);

    res.status(500).json({
      error: "Scraping failed",
      details: err.message,
      suggestion:
        "Check if Chrome is installed and CHROME_PATH is set correctly",
    });
  }
};
