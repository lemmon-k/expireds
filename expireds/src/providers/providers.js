'use client'

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

export const Providers = ({ children }) => {
  return (
    <HeroUIProvider>
      <ToastProvider
        placement="top-center"
        toastOffset={50}
        maxVisibleToasts={1}
      />
      {children}
    </HeroUIProvider>
  );
};
