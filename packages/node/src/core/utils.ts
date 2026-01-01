export const isValidAmount = (amount: number): boolean => {
  const amt = Number(amount);
  if (!isFinite(amt) || isNaN(amt) || amt <= 0 || amt > Number.MAX_SAFE_INTEGER) {
    return false;
  }
  return true;
};
