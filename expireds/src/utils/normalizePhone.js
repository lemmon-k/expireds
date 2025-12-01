export function normalizePhone(input) {
  // Keep digits only
  const digits = input.replace(/\D/g, "");

  // Canadian numbers are 10 digits if user omits +1
  if (digits.length === 10) {
    return "+1" + digits;
  }

  // If the user included 1 at the front
  if (digits.length === 11 && digits.startsWith("1")) {
    return "+" + digits;
  }

  return false;
}
