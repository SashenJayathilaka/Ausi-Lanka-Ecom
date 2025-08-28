export const calculate = async (value, productUrl, rate) => {
  try {
    // Input validation
    if (typeof value !== "string") {
      throw new Error('Price must be a string like "$41.99"');
    }

    // Extract numeric value
    const numericPart = value.replace(/[^0-9.]/g, "");
    const result = parseFloat(numericPart);
    if (isNaN(result)) {
      throw new Error("Invalid numeric value in price");
    }

    // Validate exchange rate
    if (rate === undefined || rate === null) {
      throw new Error("No exchange rate available");
    }

    // Helper function: round up to the next multiple of 50
    function roundUpToNext50(price) {
      return (Math.ceil(price / 50) * 50).toFixed(2);
    }

    // Determine multiplier based on product URL and price
    let multiplier;
    if (productUrl.includes("chemistwarehouse.com.au")) {
      multiplier = result >= 10 ? 1.65 : 1.5;
    } else {
      multiplier = result >= 10 ? 1.5 : 1.45;
    }

    // Calculate final price
    const finalResult = result * multiplier * rate;

    // Round up to next 50
    return roundUpToNext50(finalResult);
  } catch (error) {
    console.error(`Calculation error for ${productUrl}:`, error);
    throw new Error(`Price conversion failed: ${error.message}`);
  }
};
