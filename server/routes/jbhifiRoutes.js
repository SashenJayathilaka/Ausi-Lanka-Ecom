import { Router } from "express";
import { scrapeJBHIFIProduct } from "../controller/jbhifiController.js";

const router = Router();

router.get("/scrape", scrapeJBHIFIProduct);

export default router;
