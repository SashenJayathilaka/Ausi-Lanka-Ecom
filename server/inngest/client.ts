import { Inngest } from "inngest";
import dotenv from "dotenv";

dotenv.config();

// Create Inngest client for background jobs
export const inngest = new Inngest({
  id: "ausi-lanka-scraper",
  name: "Ausi Lanka Price Scraper",
  // For local development - events are sent to Dev Server at http://localhost:8288
  // No eventKey needed for local development
  eventKey: process.env.INNGEST_EVENT_KEY || undefined,
});
