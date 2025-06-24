export const calculate = (value) => {
  if (typeof value !== "string") {
    throw new Error('Price must be a string like "$41.99"');
  }

  const numericPart = value.replace(/[^0-9.]/g, ""); // removes $ or other symbols

  if (isNaN(numericPart)) {
    throw new Error("Invalid numeric value in price");
  }

  const result = parseFloat(numericPart) * 194.59;
  return result;
};
