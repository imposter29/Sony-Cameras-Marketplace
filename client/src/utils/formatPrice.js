/**
 * Format a number as Indian Rupee currency string
 * @param {number} amount
 * @returns {string} e.g. "₹2,49,990"
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
