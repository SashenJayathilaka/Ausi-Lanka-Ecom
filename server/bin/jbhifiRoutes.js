import { Router } from "express";
import { scrapeJBHIFIProduct } from "./jbhifiController.js";

const router = Router();

router.get("/scrape", scrapeJBHIFIProduct);

export default router;
