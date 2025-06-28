import exchangeRate from "../models/exchangeRate.js";

export const calculate = async (value, productUrl) => {
  try {
    // Input validation
    if (typeof value !== "string") {
      throw new Error('Price must be a string like "$41.99"');
    }

    // Extract numeric value
    const numericPart = value.replace(/[^0-9.]/g, "");
    if (isNaN(numericPart)) {
      throw new Error("Invalid numeric value in price");
    }

    // Get latest exchange rate
    const latestRate = await exchangeRate
      .findOne()
      .sort({ timestamp: -1 })
      .limit(1);

    if (!latestRate) {
      throw new Error("No exchange rate available");
    }

    // Calculate with current rate
    const result = parseFloat(numericPart) * latestRate.rate;
    return result;
  } catch (error) {
    console.error(`Calculation error for ${productUrl}:`, error);
    throw new Error(`Price conversion failed: ${error.message}`);
  }
};
