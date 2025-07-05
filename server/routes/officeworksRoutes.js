import { Router } from "express";
import { scrapeOfficeworksProduct } from "../controller/officeworksController.js";

const router = Router();

router.get("/scrape", scrapeOfficeworksProduct);

export default router;
