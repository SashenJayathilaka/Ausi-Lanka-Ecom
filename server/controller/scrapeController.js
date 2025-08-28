import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER, // fresh browser per job
      maxConcurrency: 2, // t2.small has 2GB RAM
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForTimeout(3000);

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
        return null;
      };

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
    });
  }
  return cluster;
};

export const scrapeChemistProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) return res.status(400).json({ error: "Missing URL" });

  try {
    const cluster = await initCluster();
    const result = await cluster.execute({ url: productUrl, rate });
    res.json(result);
  } catch (err) {
    console.error("Scrape error:", err);
    res.status(500).json({ error: "Scraping failed." });
  }
};
