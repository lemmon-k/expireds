export function capitalizeFirstWord(text) {
  if (!text) return "";
  const words = text.trim().split(" ");
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

export function capitalizeEachWord(text) {
  if (!text) return "";
  return text
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
