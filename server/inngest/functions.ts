import { inngest } from "./client";
import { scrapeUrls } from "../services/scraper";

export const scrapeProductJob = inngest.createFunction(
  { id: "scrape-product" },
  { event: "scraping/product.requested" },
  async ({ event, step }) => {
    const { url, rate } = event.data;
    console.log("🚀 Starting scrape job for:", url);
    const urls = Array.isArray(url) ? url : [url];

    const results = await step.run("scrape-urls", async () => {
      console.log("Running scraping service...");
      const scrapeResults = await scrapeUrls(urls, rate);
      console.log("Scraping completed:", scrapeResults);
      return scrapeResults;
    });

    return { body: results };
  }
);
