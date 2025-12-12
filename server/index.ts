import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import aldiRoutes from "./routes/adliRoutes.js";
import colesRoutes from "./routes/colesRoutes.js";
import OfficeworksRoutes from "./routes/officeworksRoutes.js";
import chemistRoutes from "./routes/scrapeRoutes.js";
import woolworthsRoutes from "./routes/woolworthsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to the Ausi Lanka E-commerce API</h1>");
});
app.use("/api/chemist", chemistRoutes);
app.use("/api/coles", colesRoutes);
app.use("/api/woolworths", woolworthsRoutes);
app.use("/api/officeWorks", OfficeworksRoutes);
app.use("/api/aldi", aldiRoutes);

import { serve } from "inngest/express";
import { inngest } from "./inngest/client";
import { scrapeProductJob } from "./inngest/functions";

app.use(
  "/api/inngest",
  serve({ client: inngest, functions: [scrapeProductJob] })
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
