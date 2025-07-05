import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import exchangeRate from "./models/exchangeRate.js";
import colesRoutes from "./routes/colesRoutes.js";
import jbhifiRoutes from "./routes/jbhifiRoutes.js";
import OfficeworksRoutes from "./routes/officeworksRoutes.js";
import chemistRoutes from "./routes/scrapeRoutes.js";
import woolworthsRoutes from "./routes/woolworthsRoutes.js";
import { fetchAndStoreExchangeRate } from "./services/exchangeService.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    retryWrites: true,
    w: "majority",
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chemist", chemistRoutes);
app.use("/api/coles", colesRoutes);
app.use("/api/jbhifi", jbhifiRoutes);
app.use("/api/woolworths", woolworthsRoutes);
app.use("/api/officeWorks", OfficeworksRoutes);

app.get("/api/rates/latest", async (req, res) => {
  try {
    const latestRate = await exchangeRate
      .findOne()
      .sort({ timestamp: -1 })
      .limit(1);

    if (!latestRate) {
      return res.status(404).json({ message: "No rates found" });
    }

    res.json({
      from: latestRate.fromCurrency,
      to: latestRate.toCurrency,
      rate: latestRate.rate,
      timestamp: latestRate.timestamp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Schedule to run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running hourly exchange rate update...");
  try {
    await fetchAndStoreExchangeRate();
  } catch (error) {
    console.error("Error in scheduled job:", error);
  }
});

// Initial fetch on startup
fetchAndStoreExchangeRate().catch((err) =>
  console.error("Initial fetch failed:", err)
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
