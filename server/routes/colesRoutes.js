import { Router } from "express";
import { scrapeColesProduct } from "../controller/colesController.js";

const router = Router();

router.get("/scrape", scrapeColesProduct);

export default router;
