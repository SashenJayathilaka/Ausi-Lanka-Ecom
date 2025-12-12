import { Request, Response } from "express";
import { scrapeUrls } from "../services/scraper";
import { inngest } from "../inngest/client";

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
    // Trigger Inngest background job
    await inngest.send({
      name: "scraping/product.requested",
      data: {
        url: urls,
        rate: rate,
      },
    });
    console.log("Inngest event sent for Aldi.");

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
    console.error("Aldi scrape error:", error.message);

    res.status(500).json({
      error: "Scraping failed",
      details: error.message,
    });
  }
};
