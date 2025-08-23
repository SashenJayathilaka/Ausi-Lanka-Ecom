import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

export const scrapeAldiProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    await page.goto(productUrl, {
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
        // Try multiple image selectors for Aldi
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
      // Specific price extraction for Aldi's structure
      const priceSelectors = [
        "span.base-price__regular span", // For the nested span structure you provided
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

    // Extract title
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

    // Extract price using specialized function
    const price = (await extractPrice()) || "Price not found";

    const image = (await extractImage()) || "Image not found";

    await browser.close();
    const calPrice = await calculate(price, productUrl, rate);

    res.json({ title, price, image, calculatedPrice: calPrice });
  } catch (err) {
    console.error("Scrape error:", err.message);
    res.status(500).json({ error: "Scraping failed." });
  }
};
