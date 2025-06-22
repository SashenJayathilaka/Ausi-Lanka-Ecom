import cors from "cors";
import express from "express";
import colesRoutes from "./routes/colesRoutes.js";
import chemistRoutes from "./routes/scrapeRoutes.js";
import jbhifiRoutes from "./routes/jbhifiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chemist", chemistRoutes);
app.use("/api/coles", colesRoutes);
app.use("/api/jbhifi", jbhifiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
