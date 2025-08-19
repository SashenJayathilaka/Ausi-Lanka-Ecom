import cors from "cors";
import express from "express";
import colesRoutes from "./routes/colesRoutes.js";
import jbhifiRoutes from "./routes/jbhifiRoutes.js";
import OfficeworksRoutes from "./routes/officeworksRoutes.js";
import chemistRoutes from "./routes/scrapeRoutes.js";
import woolworthsRoutes from "./routes/woolworthsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Ausi Lanka E-commerce API</h1>");
});
app.use("/api/chemist", chemistRoutes);
app.use("/api/coles", colesRoutes);
app.use("/api/jbhifi", jbhifiRoutes);
app.use("/api/woolworths", woolworthsRoutes);
app.use("/api/officeWorks", OfficeworksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
