import { serve } from "inngest/express";
import { inngest } from "./client.js";
import {
  scrapeColes,
  scrapeColesBatch,
  scrapeChemistWarehouse,
  scrapeChemistWarehouseBatch,
  scheduledPriceUpdate,
} from "./functions.js";
import { Request, Response } from "express";

// Create the Inngest serve handler with all functions
export const inngestHandler = serve({
  client: inngest,
  functions: [
    scrapeColes,
    scrapeColesBatch,
    scrapeChemistWarehouse,
    scrapeChemistWarehouseBatch,
    scheduledPriceUpdate,
  ],
});

// Express middleware wrapper
export const handleInngest = (req: Request, res: Response) => {
  return inngestHandler(req, res);
};
