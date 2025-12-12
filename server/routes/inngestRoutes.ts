import { Router, Request, Response } from "express";
import { inngest } from "../inngest/client.js";
import axios from "axios";

const router = Router();

// Helper function to send events to Inngest Dev Server
async function sendEventToDevServer(eventName: string, data: any) {
  try {
    const response = await axios.post(
      "http://localhost:8288/e/ausi-lanka-scraper",
      {
        name: eventName,
        data: data,
        ts: Date.now(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Dev Server error: ${error.response?.status} - ${error.response?.data}`
      );
    }
    throw error;
  }
}

// Trigger Coles scraping job
router.post("/coles", async (req: Request, res: Response) => {
  const { url, rate } = req.body;

  console.log("=== ROUTE HIT ===");
  console.log("URL:", url);
  console.log("Rate:", rate);

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  // For now, just return success without calling any external service
  return res.json({
    success: true,
    message: "Coles scraping job triggered successfully (test mode)",
    url,
    rate: parseFloat(rate),
  });
});

// Batch scraping endpoint for Coles
router.post("/coles/batch", async (req: Request, res: Response) => {
  const { urls, rate } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "Missing or invalid urls array" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  try {
    const result = await sendEventToDevServer("scrape/coles-batch", {
      urls,
      rate: parseFloat(rate),
    });

    return res.json({
      success: true,
      message: `Triggered ${urls.length} Coles scraping jobs`,
      jobId: result.ids?.[0] || "dev-batch-" + Date.now(),
      count: urls.length,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger Coles batch scraping",
      details: err.message,
    });
  }
});

// Trigger Chemist Warehouse scraping job
router.post("/chemist-warehouse", async (req: Request, res: Response) => {
  const { url, rate } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  try {
    const result = await sendEventToDevServer("scrape/chemist-warehouse", {
      url,
      rate: parseFloat(rate),
    });

    return res.json({
      success: true,
      message: "Chemist Warehouse scraping job triggered successfully",
      jobId: result.ids?.[0] || "dev-job-" + Date.now(),
      status:
        "Job is processing in background. Check http://localhost:8288/runs",
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger Chemist Warehouse scraping job",
      details: err.message,
    });
  }
});

// Batch scraping endpoint for Chemist Warehouse
router.post("/chemist-warehouse/batch", async (req: Request, res: Response) => {
  const { urls, rate } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "Missing or invalid urls array" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  try {
    const result = await sendEventToDevServer(
      "scrape/chemist-warehouse-batch",
      {
        urls,
        rate: parseFloat(rate),
      }
    );

    return res.json({
      success: true,
      message: `Triggered ${urls.length} Chemist Warehouse scraping jobs`,
      jobId: result.ids?.[0] || "dev-batch-" + Date.now(),
      count: urls.length,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger Chemist Warehouse batch scraping",
      details: err.message,
    });
  }
});

// Trigger Woolworths scraping job (legacy - kept for backwards compatibility)
router.post("/woolworths", async (req: Request, res: Response) => {
  const { url, rate } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  try {
    // Send event to Inngest
    const event = await inngest.send({
      name: "scrape/woolworths",
      data: {
        url,
        rate: parseFloat(rate),
      },
    });

    return res.json({
      success: true,
      message: "Scraping job triggered successfully",
      jobId: event.ids[0],
      status:
        "Job is processing in background. Results will be available soon.",
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger scraping job",
      details: err.message,
    });
  }
});

// Batch scraping endpoint
router.post("/woolworths/batch", async (req: Request, res: Response) => {
  const { urls, rate } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "Missing or invalid urls array" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  try {
    const event = await inngest.send({
      name: "scrape/woolworths-batch",
      data: {
        urls,
        rate: parseFloat(rate),
      },
    });

    return res.json({
      success: true,
      message: `Triggered ${urls.length} scraping jobs`,
      jobId: event.ids[0],
      count: urls.length,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger batch scraping",
      details: err.message,
    });
  }
});

// Trigger manual price update (instead of waiting for cron)
router.post("/price-update", async (req: Request, res: Response) => {
  try {
    const event = await inngest.send({
      name: "app/price-update.scheduled",
      data: {},
    });

    return res.json({
      success: true,
      message: "Price update job triggered",
      jobId: event.ids[0],
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger price update",
      details: err.message,
    });
  }
});

export default router;
