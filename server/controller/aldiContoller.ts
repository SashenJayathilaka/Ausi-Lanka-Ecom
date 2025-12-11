import { Cluster } from "puppeteer-cluster";
import { Page } from "puppeteer";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { calculate } from "../calculator/calculator.js";

dotenv.config();

interface ClusterData {
  url: string;
  rate: number;
}

interface ScrapeResult {
  url: string;
  title?: string;
  price?: string;
  image?: string;
  calculatedPrice?: string;
  success: boolean;
  error?: string;
}

interface ScrapeResponse {
  results: ScrapeResult[];
  total: number;
  successful: number;
  failed: number;
}

let cluster: Cluster<ClusterData, ScrapeResult> | undefined;

export const initCluster = async (): Promise<
  Cluster<ClusterData, ScrapeResult>
> => {
  if (!cluster) {
    const launchOptions: any = {
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
    } else {
      console.log("Using default Chromium");
    }

    cluster = await Cluster.launch(launchOptions);

    // Error handling for cluster
    cluster.on("taskerror", (err: Error, data: ClusterData) => {
      console.error(`Error processing ${data.url}:`, err.message);
    });

    // --- Define Aldi scraping task ---
    await cluster.task(
      async ({
        page,
        data,
      }: {
        page: Page;
        data: ClusterData;
      }): Promise<ScrapeResult> => {
        const { url, rate } = data;

        try {
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
          );

          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          });

          await new Promise((r) => setTimeout(r, 2000));

          const extractText = async (
            selectors: string[]
          ): Promise<string | null> => {
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

          const extractImage = async (): Promise<string | null> => {
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
                    const metaImg = await page.$eval(
                      sel,
                      (el) => el.getAttribute("content") || ""
                    );
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

          const extractPrice = async (): Promise<string | null> => {
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
                const priceText = await page.$eval(
                  sel,
                  (el) => el.textContent?.trim() || ""
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
              .$eval(
                'meta[property="og:title"]',
                (el) => el.getAttribute("content") || ""
              )
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
          const error = err as Error;
          console.error(`Scrape error for ${url}:`, error.message);
          return {
            url,
            error: `Scraping failed: ${error.message}`,
            success: false,
          };
        }
      }
    );
  }
  return cluster;
};

// API handler
export const scrapeAldiProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productUrls = req.query.url as string | string[];
  const rate = parseFloat(req.query.rate as string);

  if (!productUrls) {
    res.status(400).json({ error: "Missing `url` query parameter." });
    return;
  }

  const urls = Array.isArray(productUrls) ? productUrls : [productUrls];

  try {
    const cluster = await initCluster();
    const results: ScrapeResult[] = [];

    // Execute all URLs in parallel using the cluster
    const scrapePromises = urls.map((url) =>
      cluster.execute({ url, rate }).catch(
        (error: Error): ScrapeResult => ({
          url,
          error: `Cluster execution failed: ${error.message}`,
          success: false,
        })
      )
    );

    const scrapeResults = await Promise.all(scrapePromises);
    results.push(...scrapeResults);

    const response: ScrapeResponse = {
      results,
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };

    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error("Cluster error:", error.message);

    res.status(500).json({
      error: "Scraping failed",
      details: error.message,
      suggestion:
        "Check if Chrome is installed and CHROME_PATH is set correctly",
    });
  }
};
