import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

let cluster;

export const initCluster = async () => {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 3, // adjust depending on EC2 size
      puppeteerOptions: {
        executablePath: process.env.CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // --- Woolworths task ---
    await cluster.task(async ({ page, data }) => {
      const { url, rate } = data;

      await page.setExtraHTTPHeaders({
        Referer: "https://www.woolworths.com.au/",
      });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      );

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 5000)); // give time for lazy-loaded elements

      const productData = await page.evaluate(() => {
        const titleEl = document.querySelector(
          "h1.product-title_component_product-title__azQKW"
        );
        const priceEl = document.querySelector(
          ".product-price_component_price-lead__vlm8f"
        );

        const findProductImage = () => {
          try {
            const schemaScript = document.querySelector(
              'script[type="application/ld+json"]'
            );
            if (schemaScript) {
              const schema = JSON.parse(schemaScript.textContent);
              if (schema.image && Array.isArray(schema.image)) {
                return schema.image[0];
              } else if (schema.image) {
                return schema.image;
              }
            }

            const selectors = [
              ".product-image-carousel_component_main-image__9Qe4H img",
              ".shelfProductTile-image img",
              'img[fetchpriority="high"]',
              "img.product-image",
            ];

            for (const selector of selectors) {
              const imgs = Array.from(document.querySelectorAll(selector));
              const validImg = imgs.find(
                (img) =>
                  img.src &&
                  img.src.includes("woolworths.com.au") &&
                  !img.src.includes("logo") &&
                  !img.src.includes("icon")
              );
              if (validImg) return validImg.src;
            }

            return null;
          } catch (e) {
            console.error("Image finding error:", e);
            return null;
          }
        };

        const imageUrl = findProductImage();

        const title = titleEl ? titleEl.textContent.trim() : null;
        let size = null;
        if (title) {
          const sizeMatch = title.match(
            /(Size|Pack)\s*(\d+|[\d\.]+\s?(kg|g|ml|l))/i
          );
          if (sizeMatch) size = sizeMatch[0];
        }

        return {
          title: title,
          price: priceEl ? priceEl.textContent.trim() : null,
          image: imageUrl,
          size: size,
          retailer: "Woolworths",
        };
      });

      if (!productData.price) {
        throw new Error("Missing price data for Woolworths product");
      }

      const calPrice = await calculate(productData.price, url, rate);

      return {
        title: productData.title || "Title not found",
        price: productData.price || "Price not found",
        image: productData.image || "Image not found",
        size: productData.size || null,
        retailer: "Woolworths",
        calculatedPrice: calPrice,
      };
    });
  }

  return cluster;
};

// --- API handler ---
export const scrapeWoolworthsProduct = async (req, res) => {
  const productUrl = req.query.url;
  const rate = req.query.rate;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  if (!productUrl.includes("woolworths.com.au")) {
    return res.status(400).json({ error: "Invalid Woolworths URL" });
  }

  try {
    const cluster = await initCluster();
    const result = await cluster.execute({ url: productUrl, rate });
    res.json(result);
  } catch (err) {
    console.error("Woolworths scrape error:", err);
    res.status(500).json({ error: "Failed to scrape Woolworths product" });
  }
};
