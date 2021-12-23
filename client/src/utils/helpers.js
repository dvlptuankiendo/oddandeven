export const formatAmount = (amount) => {
  try {
    const amountString = `${amount}`;
    return amountString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return "";
  }
};
