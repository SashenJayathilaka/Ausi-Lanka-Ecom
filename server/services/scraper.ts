import { Cluster } from "puppeteer-cluster";
import { Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { calculate } from "../calculator/calculator";

puppeteer.use(StealthPlugin());

export interface ScrapeResult {
  url: string;
  title?: string;
  price?: string;
  image?: string;
  calculatedPrice?: string;
  success: boolean;
  error?: string;
}

interface ClusterData {
  url: string;
  rate: number;
}

interface RetailerConfig {
  titleSelectors: string[];
  priceSelectors: string[];
  imageSelectors: string[];
}

const RETAILER_CONFIGS: Record<string, RetailerConfig> = {
  chemistwarehouse: {
    titleSelectors: ["h1.product-title", "h1", "title"],
    priceSelectors: [
      ".product-price-now",
      ".product-price",
      ".Price",
      ".price",
      "[data-product-price]",
      "h2.display-l.text-colour-title-light",
    ],
    imageSelectors: [
      "div.w-full.overflow-hidden button:nth-child(1) img",
      "img.product-image",
      "meta[property='og:image']",
    ],
  },
  coles: {
    titleSelectors: ["h1.product__title", "h1", "title"],
    priceSelectors: ["span.price__value", ".price__value"],
    imageSelectors: [
      'img[data-testid="product-thumbnail-image-0"]',
      "img.product-image",
      "meta[property='og:image']",
    ],
  },
  aldi: {
    titleSelectors: [
      "h1.product-details__title",
      "h1.product-title",
      "h1.product-name",
      "title",
    ],
    priceSelectors: [
      "span.base-price__regular span",
      "span.base-price__regular",
      "span.product-details__price",
      "span.price",
      "span.product-price",
      "span.current-price",
      "span[data-qa='product-price']",
      ".product-details__price",
    ],
    imageSelectors: [
      "img.base-image.product-image__image",
      "img.product-details__image",
      "img.product-image",
      "meta[property='og:image']",
    ],
  },
  default: {
    titleSelectors: ["h1", "title"],
    priceSelectors: [".price", ".product-price"],
    imageSelectors: ["img", "meta[property='og:image']"],
  },
};

const getRetailerConfig = (url: string): RetailerConfig => {
  if (url.includes("chemistwarehouse.com.au"))
    return RETAILER_CONFIGS.chemistwarehouse;
  if (url.includes("coles.com.au")) return RETAILER_CONFIGS.coles;
  if (url.includes("aldi.com.au")) return RETAILER_CONFIGS.aldi;
  return RETAILER_CONFIGS.default;
};

let cluster: Cluster<ClusterData, ScrapeResult> | undefined;

const initCluster = async () => {
  if (!cluster) {
    const launchOptions: any = {
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 5,
      puppeteer, // Use puppeteer-extra
      puppeteerOptions: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--disable-extensions",
          "--disable-accelerated-2d-canvas",
        ],
        timeout: 30000,
      },
    };

    if (process.env.CHROME_PATH) {
      launchOptions.puppeteerOptions.executablePath = process.env.CHROME_PATH;
    }

    cluster = await Cluster.launch(launchOptions);

    cluster.on("taskerror", (err: Error, data: ClusterData) => {
      console.error(`Cluster task error for ${data.url}:`, err.message);
    });

    await cluster.task(
      async ({ page, data }: { page: Page; data: ClusterData }) => {
        const { url, rate } = data;
        const config = getRetailerConfig(url);

        try {
          await page.setRequestInterception(true);
          page.on("request", (req) => {
            const resourceType = req.resourceType();
            if (
              ["image", "stylesheet", "font", "media"].includes(resourceType)
            ) {
              req.abort();
            } else {
              req.continue();
            }
          });

          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
          );

          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          });

          const extractText = async (selectors: string[]) => {
            for (const sel of selectors) {
              try {
                const text = await page.$eval(
                  sel,
                  (el) => el.textContent?.trim() || ""
                );
                if (text) return text;
              } catch {}
            }
            return null;
          };

          const extractImage = async (selectors: string[]) => {
            for (const sel of selectors) {
              try {
                if (sel.startsWith("meta")) {
                  const content = await page.$eval(sel, (el) =>
                    el.getAttribute("content")
                  );
                  if (content) return content;
                } else {
                  const img = await page.$(sel);
                  if (img) {
                    const src = await page.evaluate(
                      (el) =>
                        el.getAttribute("src") ||
                        el.getAttribute("data-src") ||
                        el.getAttribute("content"),
                      img
                    );
                    if (src) {
                      if (src.startsWith("http")) return src;
                      if (url.includes("chemistwarehouse.com.au"))
                        return `https://www.chemistwarehouse.com.au${src}`;
                      if (url.includes("coles.com.au"))
                        return `https://shop.coles.com.au${src}`;
                      if (url.includes("aldi.com.au"))
                        return `https://www.aldi.com.au${src}`;
                      return src;
                    }
                  }
                }
              } catch {}
            }
            return null;
          };

          const title =
            (await extractText(config.titleSelectors)) ||
            (await page
              .$eval(
                'meta[property="og:title"]',
                (el) => el.getAttribute("content") || ""
              )
              .catch(() => null)) ||
            "Title not found";

          const price =
            (await extractText(config.priceSelectors)) || "Price not found";

          const image =
            (await extractImage(config.imageSelectors)) || "Image not found";

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
          const error = err as Error;
          throw error;
        }
      }
    );
  }
  return cluster;
};

export const scrapeUrls = async (
  urls: string[],
  rate: number
): Promise<ScrapeResult[]> => {
  try {
    const cluster = await initCluster();

    const promises = urls.map((url) =>
      cluster.execute({ url, rate }).catch((err) => ({
        url,
        error: `Scraping failed: ${err.message}`,
        success: false,
      }))
    );

    const results = await Promise.all(promises);
    return results as ScrapeResult[];
  } catch (err) {
    const error = err as Error;
    console.error("Scraping service error:", error.message);
    return urls.map((url) => ({
      url,
      error: `Service error: ${error.message}`,
      success: false,
    }));
  }
};
