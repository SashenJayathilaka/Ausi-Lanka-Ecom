import { Request, Response } from "express";
import { inngest } from "../inngest/client";
import { scrapeUrls } from "../services/scraper";

interface ScrapeResponse {
  results: any[];
  total: number;
  successful: number;
  failed: number;
}

export const scrapeProduct = async (
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
    // 1. Trigger Inngest event (Background)
    // We don't await this to block the response, or we can await it just to ensure it's sent.
    // Awaiting is safer to ensure the event is queued.
    await inngest.send({
      name: "scraping/product.requested",
      data: {
        url: urls,
        rate: rate,
      },
    });
    console.log("Inngest event sent.");

    // 2. Perform Synchronous Scraping (Foreground)
    // This is to satisfy the frontend's need for immediate results.
    console.log("Starting synchronous scraping...");
    const results = await scrapeUrls(urls, rate);

    const response: ScrapeResponse = {
      results,
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };

    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error("Scrape controller error:", error.message);
    res.status(500).json({
      error: "Failed to process scraping request",
      details: error.message,
    });
  }
};
