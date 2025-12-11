import { Router } from "express";
import { scrapeAldiProduct } from "../controller/aldiContoller.js";

const router = Router();

router.get("/scrape", scrapeAldiProduct);

export default router;
