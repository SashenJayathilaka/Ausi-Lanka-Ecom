import { Router } from "express";
import { scrapeWoolworthsProduct } from "../controller/woolworthsController.js";

const router = Router();

router.get("/scrape", scrapeWoolworthsProduct);

export default router;
