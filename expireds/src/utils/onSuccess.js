import { addToast } from "@heroui/react";

export const onSuccess = (msg) => {
  addToast({
    title: "Success",
    description: msg,
    color: "success",
  });
};

export const onInfo = (title, msg) => {
  addToast({
    title: title,
    description: msg,
    color: "primary",
  });
};
