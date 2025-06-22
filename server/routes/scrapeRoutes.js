import { Router } from "express";
import { scrapeProduct } from "../controller/scrapeController.js";

const router = Router();

router.get("/scrape", scrapeProduct);

export default router;
