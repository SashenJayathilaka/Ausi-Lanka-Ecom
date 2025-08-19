export const calculate = async (value, productUrl, rate) => {
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
    const latestRate = rate;
    if (!latestRate) {
      throw new Error("No exchange rate available");
    }

    function roundUpToNext100(price) {
      return (Math.ceil(price / 100) * 100).toFixed(2);
    }

    // calculate with current rate
    let finalResult;
    const result = parseFloat(numericPart);

    if (productUrl.includes("chemistwarehouse.com.au")) {
      if ((result) => 10) {
        const pharmacy = result * 1.65;
        finalResult = pharmacy * latestRate;
        return roundUpToNext100(Math.round(finalResult));
      } else {
        const pharmacy = result * 1.5;
        finalResult = pharmacy * latestRate;
        return roundUpToNext100(Math.round(finalResult));
      }
    } else {
      if ((result) => 10) {
        const pharmacy = result * 1.5;
        finalResult = pharmacy * latestRate;
        return roundUpToNext100(Math.round(finalResult));
      } else {
        const pharmacy = result * 1.45;
        finalResult = pharmacy * latestRate;
        return roundUpToNext100(Math.round(finalResult));
      }
    }
  } catch (error) {
    console.error(`Calculation error for ${productUrl}:`, error);
    throw new Error(`Price conversion failed: ${error.message}`);
  }
};
