import axios from "axios";
import dotenv from "dotenv";
import ExchangeRate from "../models/exchangeRate.js";

dotenv.config();

const API_KEY = process.env.EXCHANGE_API_KEY;
const BASE_URL = "https://v6.exchangerate-api.com/v6";

async function fetchAndStoreExchangeRate() {
  try {
    const response = await axios.get(`${BASE_URL}/${API_KEY}/latest/AUD`);
    const rate = response.data.conversion_rates.LKR;

    const newRate = new ExchangeRate({
      rate: rate,
    });

    await newRate.save();
    console.log(
      `Successfully stored AUD to LKR rate: ${rate} at ${new Date()}`
    );
    return rate;
  } catch (error) {
    console.error("Error fetching or storing exchange rate:", error.message);
    throw error;
  }
}

// Change from CommonJS exports to ES Module export
export { fetchAndStoreExchangeRate };
