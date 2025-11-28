"use client";

import { Button } from "@heroui/react";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <Button color="primary" onPress={() => alert("Hello World")}>
        Logo
      </Button>
    </nav>
  );
};
