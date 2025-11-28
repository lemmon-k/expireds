import { addToast } from "@heroui/react";

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    addToast({
      title: "Copied",
      description: "A shareable link has been copied to your clipboard.",
      color: "success",
    });
  } catch (err) {
    errorHandler();
  }
};
