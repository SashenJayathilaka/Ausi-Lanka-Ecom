import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE, // run jobs as separate pages
      maxConcurrency: 3, // adjust based on EC2 size
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // --- Define Aldi scraping task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
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
                  if (src && !src.startsWith("http")) {
                    return `https://www.aldi.com.au${src}`;
                  }
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

      return { title, price, image, calculatedPrice: calPrice };
    });
  }
  return cluster;
};

// API handler
export const scrapeAldiProduct = async (req, res) => {
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
