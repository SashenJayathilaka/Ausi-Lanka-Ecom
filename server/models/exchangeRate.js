import mongoose from "mongoose";

const exchangeRateSchema = new mongoose.Schema({
  fromCurrency: { type: String, required: true, default: "AUD" },
  toCurrency: { type: String, required: true, default: "LKR" },
  rate: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Change from CommonJS exports to ES Module export
const exchangeRate = mongoose.model("ExchangeRate", exchangeRateSchema);
export default exchangeRate;
