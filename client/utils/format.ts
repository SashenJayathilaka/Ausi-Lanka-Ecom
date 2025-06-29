export const LkrFormat = (value: number): string => {
  return `Rs. ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
