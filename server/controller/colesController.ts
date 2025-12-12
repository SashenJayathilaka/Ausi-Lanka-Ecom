import { Request, Response } from "express";
import { scrapeUrls } from "../services/scraper";
import { inngest } from "../inngest/client";

export const scrapeColesProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productUrl = req.query.url as string;
  const rate = parseFloat(req.query.rate as string);

  if (!productUrl) {
    res.status(400).json({
      results: [],
      total: 0,
      successful: 0,
      failed: 0,
      error: "Missing URL parameter",
    });
    return;
  }

  if (!productUrl.includes("coles.com.au")) {
    res.status(400).json({
      results: [],
      total: 0,
      successful: 0,
      failed: 0,
      error: "Invalid Coles URL",
    });
    return;
  }

  try {
    // Trigger Inngest background job
    await inngest.send({
      name: "scraping/product.requested",
      data: {
        url: productUrl,
        rate: rate,
      },
    });
    console.log("Inngest event sent for Coles.");

    const results = await scrapeUrls([productUrl], rate);
    const result = results[0];

    if (result.success) {
      res.json({
        results: [
          {
            ...result,
            retailer: "Coles",
            size: null, // Size extraction not yet implemented in shared scraper
          },
        ],
        total: 1,
        successful: 1,
        failed: 0,
      });
    } else {
      res.status(500).json({
        results: [],
        total: 1,
        successful: 0,
        failed: 1,
        error: result.error || "Failed to scrape Coles product",
      });
    }
  } catch (err) {
    console.error("Coles scrape error:", err);
    res.status(500).json({
      results: [],
      total: 0,
      successful: 0,
      failed: 1,
      error: "Failed to scrape Coles product",
    });
  }
};
