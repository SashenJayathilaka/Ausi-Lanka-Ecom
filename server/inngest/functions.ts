import { inngest } from "./client.js";
import puppeteer, { Browser, Page } from "puppeteer";
import { calculate } from "../calculator/calculator.js";

interface ScrapePayload {
  url: string;
  rate: number;
}

interface ProductData {
  title: string | null;
  price: string | null;
  image: string | null;
  size: string | null;
  retailer: string;
}

interface ScrapeResult {
  url: string;
  title?: string;
  price?: string;
  image?: string;
  size?: string | null;
  retailer?: string;
  calculatedPrice?: string;
  success: boolean;
  error?: string;
}

// Coles scraping function
export const scrapeColes = inngest.createFunction(
  {
    id: "scrape-coles",
    name: "Scrape Coles Product",
    retries: 3,
  },
  { event: "scrape/coles" },
  async ({ event, step }) => {
    const { url, rate } = event.data as ScrapePayload;

    // Step 1: Validate input
    const validation = await step.run("validate-input", async () => {
      if (!url || !url.includes("coles.com.au")) {
        throw new Error("Invalid Coles URL");
      }
      if (!rate || isNaN(rate)) {
        throw new Error("Invalid exchange rate");
      }
      return { url, rate };
    });

    // Step 2: Launch browser and scrape
    const scrapedData = await step.run("scrape-page", async () => {
      let browser: Browser | null = null;

      try {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-software-rasterizer",
          ],
          timeout: 30000,
          executablePath: process.env.CHROME_PATH,
        });

        const page: Page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        );

        await page.goto(validation.url, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
        await new Promise((r) => setTimeout(r, 5000));

        const productData = (await page.evaluate(() => {
          const titleEl = document.querySelector("h1.product__title");
          const priceEl = document.querySelector("span.price__value");
          const imgEl = document.querySelector(
            'img[data-testid="product-thumbnail-image-0"]'
          ) as HTMLImageElement | null;
          const sizeEl = document.querySelector(".product__size");

          return {
            title: titleEl ? titleEl.textContent?.trim() || null : null,
            price: priceEl ? priceEl.textContent?.trim() || null : null,
            image: imgEl ? imgEl.src || imgEl.getAttribute("data-src") : null,
            size: sizeEl ? sizeEl.textContent?.trim() || null : null,
            retailer: "Coles",
          };
        })) as ProductData;

        await browser.close();

        if (!productData.price) {
          throw new Error("Failed to extract price from Coles page");
        }

        return productData;
      } catch (error) {
        if (browser) {
          await browser.close().catch(() => {});
        }
        throw error;
      }
    });

    // Step 3: Calculate price
    const result = await step.run("calculate-price", async () => {
      const calculatedPrice = await calculate(
        scrapedData.price!,
        validation.url,
        validation.rate
      );

      const finalResult: ScrapeResult = {
        url: validation.url,
        title: scrapedData.title || "Title not found",
        price: scrapedData.price || "Price not found",
        image: scrapedData.image
          ? scrapedData.image.startsWith("http")
            ? scrapedData.image
            : `https://shop.coles.com.au${scrapedData.image}`
          : "Image not found",
        size: scrapedData.size || null,
        retailer: "Coles",
        calculatedPrice: calculatedPrice,
        success: true,
      };

      return finalResult;
    });

    return result;
  }
);

// Chemist Warehouse scraping function
export const scrapeChemistWarehouse = inngest.createFunction(
  {
    id: "scrape-chemist-warehouse",
    name: "Scrape Chemist Warehouse Product",
    retries: 3,
  },
  { event: "scrape/chemist-warehouse" },
  async ({ event, step }) => {
    const { url, rate } = event.data as ScrapePayload;

    // Step 1: Validate input
    const validation = await step.run("validate-input", async () => {
      if (!url || !url.includes("chemistwarehouse.com.au")) {
        throw new Error("Invalid Chemist Warehouse URL");
      }
      if (!rate || isNaN(rate)) {
        throw new Error("Invalid exchange rate");
      }
      return { url, rate };
    });

    // Step 2: Launch browser and scrape
    const scrapedData = await step.run("scrape-page", async () => {
      let browser: Browser | null = null;

      try {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-software-rasterizer",
          ],
          timeout: 30000,
          executablePath: process.env.CHROME_PATH,
        });

        const page: Page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        );

        await page.goto(validation.url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        await new Promise((r) => setTimeout(r, 2000));

        const productData = (await page.evaluate(() => {
          const extractText = (selectors: string[]): string | null => {
            for (const sel of selectors) {
              try {
                const el = document.querySelector(sel);
                if (el && el.textContent) {
                  const text = el.textContent.trim();
                  if (text) return text;
                }
              } catch {}
            }
            return null;
          };

          const extractImage = (): string | null => {
            try {
              const img = document.querySelector(
                "div.w-full.overflow-hidden button:nth-child(1) img, img.product-image, meta[property='og:image']"
              );
              if (img) {
                const src =
                  img.getAttribute("src") || img.getAttribute("content");
                if (src && src.startsWith("http")) return src;
                if (src) return `https://www.chemistwarehouse.com.au${src}`;
              }
            } catch {}
            return null;
          };

          const title =
            extractText(["h1.product-title", "h1", "title"]) ||
            document
              .querySelector('meta[property="og:title"]')
              ?.getAttribute("content") ||
            null;

          const price = extractText([
            ".product-price-now",
            ".product-price",
            ".Price",
            ".price",
            "[data-product-price]",
            "h2.display-l.text-colour-title-light",
          ]);

          const image = extractImage();

          return {
            title,
            price,
            image,
            size: null,
            retailer: "Chemist Warehouse",
          };
        })) as ProductData;

        await browser.close();

        if (!productData.price) {
          throw new Error(
            "Failed to extract price from Chemist Warehouse page"
          );
        }

        return productData;
      } catch (error) {
        if (browser) {
          await browser.close().catch(() => {});
        }
        throw error;
      }
    });

    // Step 3: Calculate price
    const result = await step.run("calculate-price", async () => {
      const calculatedPrice = await calculate(
        scrapedData.price!,
        validation.url,
        validation.rate
      );

      const finalResult: ScrapeResult = {
        url: validation.url,
        title: scrapedData.title || "Title not found",
        price: scrapedData.price || "Price not found",
        image: scrapedData.image || "Image not found",
        size: scrapedData.size || null,
        retailer: "Chemist Warehouse",
        calculatedPrice: calculatedPrice,
        success: true,
      };

      return finalResult;
    });

    return result;
  }
);

// Woolworths scraping function (keeping for reference, but not actively using)
export const scrapeWoolworths = inngest.createFunction(
  {
    id: "scrape-woolworths",
    name: "Scrape Woolworths Product",
    retries: 3, // Retry up to 3 times on failure
  },
  { event: "scrape/woolworths" },
  async ({ event, step }) => {
    const { url, rate } = event.data as ScrapePayload;

    // Step 1: Validate input
    const validation = await step.run("validate-input", async () => {
      if (!url || !url.includes("woolworths.com.au")) {
        throw new Error("Invalid Woolworths URL");
      }
      if (!rate || isNaN(rate)) {
        throw new Error("Invalid exchange rate");
      }
      return { url, rate };
    });

    // Step 2: Launch browser and scrape
    const scrapedData = await step.run("scrape-page", async () => {
      let browser: Browser | null = null;

      try {
        // Launch browser with optimized settings
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-software-rasterizer",
          ],
          timeout: 30000,
          executablePath: process.env.CHROME_PATH,
        });

        const page: Page = await browser.newPage();

        // Set headers and user agent
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        );

        await page.setExtraHTTPHeaders({
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          Referer: "https://www.woolworths.com.au/",
        });

        // Disable automation flags
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, "webdriver", {
            get: () => false,
          });
        });

        // Navigate to product page
        await page.goto(validation.url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Wait for page to load
        await new Promise((r) => setTimeout(r, 3000));

        // Wait for key elements
        try {
          await page.waitForSelector("h1", { timeout: 5000 });
        } catch {}

        // Extract product data
        const productData = (await page.evaluate(() => {
          const extractText = (selectors: string[]): string | null => {
            for (const sel of selectors) {
              try {
                const el = document.querySelector(sel);
                if (el && el.textContent) {
                  const text = el.textContent.trim();
                  if (text) return text;
                }
              } catch {}
            }
            return null;
          };

          const findProductImage = (): string | null => {
            try {
              // Try direct image selector first
              const highPriorityImg = document.querySelector<HTMLImageElement>(
                'img[fetchpriority="high"]'
              );
              if (
                highPriorityImg?.src &&
                highPriorityImg.src.includes("woolworths.com.au")
              ) {
                return highPriorityImg.src;
              }

              // Try to get image from product schema
              const schemaScript = document.querySelector(
                'script[type="application/ld+json"]'
              );
              if (schemaScript?.textContent) {
                try {
                  const schema = JSON.parse(schemaScript.textContent);
                  if (schema.image) {
                    if (Array.isArray(schema.image)) {
                      return schema.image[0];
                    }
                    return schema.image;
                  }
                } catch {}
              }

              // Try various image selectors
              const selectors = [
                ".product-image-carousel_component_main-image__9Qe4H img",
                ".shelfProductTile-image img",
                "img.product-image",
                "img[alt*='pack']",
                "img",
              ];

              for (const selector of selectors) {
                const imgs = Array.from(
                  document.querySelectorAll<HTMLImageElement>(selector)
                );
                const validImg = imgs.find(
                  (img) =>
                    img.src &&
                    (img.src.includes("woolworths.com.au") ||
                      img.src.includes("assets.woolworths")) &&
                    !img.src.includes("logo") &&
                    !img.src.includes("icon")
                );
                if (validImg) return validImg.src;
              }

              return null;
            } catch {
              return null;
            }
          };

          const title = extractText([
            "h1.product-title_component_product-title__azQKW",
            "h1.product-title",
            "h1",
            "title",
          ]);

          const price = extractText([
            ".product-price_component_price-lead__vlm8f",
            ".product-price",
            ".Price",
            ".price",
            "[data-product-price]",
          ]);

          const imageUrl = findProductImage();

          // Extract size from title if available
          let size: string | null = null;
          if (title) {
            const sizeMatch = title.match(
              /(Size|Pack)\s*(\d+|[\d\.]+\s?(kg|g|ml|l))/i
            );
            if (sizeMatch) size = sizeMatch[0];
          }

          return {
            title: title,
            price: price,
            image: imageUrl,
            size: size,
            retailer: "Woolworths",
          };
        })) as ProductData;

        await browser.close();

        if (!productData.price) {
          throw new Error("Failed to extract price from page");
        }

        return productData;
      } catch (error) {
        if (browser) {
          await browser.close().catch(() => {});
        }
        throw error;
      }
    });

    // Step 3: Calculate price
    const result = await step.run("calculate-price", async () => {
      const calculatedPrice = await calculate(
        scrapedData.price!,
        validation.url,
        validation.rate
      );

      const finalResult: ScrapeResult = {
        url: validation.url,
        title: scrapedData.title || "Title not found",
        price: scrapedData.price || "Price not found",
        image: scrapedData.image || "Image not found",
        size: scrapedData.size || null,
        retailer: "Woolworths",
        calculatedPrice: calculatedPrice,
        success: true,
      };

      return finalResult;
    });

    return result;
  }
);

// Batch scraping function for Coles
export const scrapeColesBatch = inngest.createFunction(
  {
    id: "scrape-coles-batch",
    name: "Scrape Multiple Coles Products",
  },
  { event: "scrape/coles-batch" },
  async ({ event, step }) => {
    const { urls, rate } = event.data as { urls: string[]; rate: number };

    const results = await step.run("trigger-scrapes", async () => {
      const promises = urls.map((url) =>
        inngest.send({
          name: "scrape/coles",
          data: { url, rate },
        })
      );

      await Promise.all(promises);
      return { triggered: urls.length };
    });

    return results;
  }
);

// Batch scraping function for Chemist Warehouse
export const scrapeChemistWarehouseBatch = inngest.createFunction(
  {
    id: "scrape-chemist-warehouse-batch",
    name: "Scrape Multiple Chemist Warehouse Products",
  },
  { event: "scrape/chemist-warehouse-batch" },
  async ({ event, step }) => {
    const { urls, rate } = event.data as { urls: string[]; rate: number };

    const results = await step.run("trigger-scrapes", async () => {
      const promises = urls.map((url) =>
        inngest.send({
          name: "scrape/chemist-warehouse",
          data: { url, rate },
        })
      );

      await Promise.all(promises);
      return { triggered: urls.length };
    });

    return results;
  }
);

// Scheduled job to update prices daily
export const scheduledPriceUpdate = inngest.createFunction(
  {
    id: "scheduled-price-update",
    name: "Daily Price Update",
  },
  { cron: "0 2 * * *" }, // Run at 2 AM every day
  async ({ step }) => {
    // Get active products from database
    const products = await step.run("fetch-products", async () => {
      // TODO: Fetch from your PostgreSQL database
      // For now, return empty array
      return [] as { url: string; retailer: string }[];
    });

    // Get latest exchange rate
    const rate = await step.run("fetch-exchange-rate", async () => {
      // TODO: Fetch from MongoDB
      return 185.5; // Default rate
    });

    // Trigger scrapes for Coles products
    const colesProducts = products.filter((p) =>
      p.url.includes("coles.com.au")
    );

    if (colesProducts.length > 0) {
      await step.run("trigger-coles-scrapes", async () => {
        await inngest.send({
          name: "scrape/coles-batch",
          data: {
            urls: colesProducts.map((p) => p.url),
            rate,
          },
        });
      });
    }

    // Trigger scrapes for Chemist Warehouse products
    const chemistProducts = products.filter((p) =>
      p.url.includes("chemistwarehouse.com.au")
    );

    if (chemistProducts.length > 0) {
      await step.run("trigger-chemist-scrapes", async () => {
        await inngest.send({
          name: "scrape/chemist-warehouse-batch",
          data: {
            urls: chemistProducts.map((p) => p.url),
            rate,
          },
        });
      });
    }

    return {
      totalProducts: products.length,
      colesProducts: colesProducts.length,
      chemistProducts: chemistProducts.length,
      rate,
    };
  }
);
