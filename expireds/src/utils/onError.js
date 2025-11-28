import { addToast } from "@heroui/react";
export const onError = (msg) => {
  addToast({
    title: "Error",
    description: msg || "Sorry something went wrong.",
    color: "danger",
    
  });
};
