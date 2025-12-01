"use client";

import { useState } from 'react'
import { createClientBrowser } from "@/utils";
import { Button } from "@heroui/react";

export const Menu = ({ user }) => {
  const supabase = createClientBrowser();
  const [loading, setLoading] = useState(false  )

  return user ? (
    <Button
      color="danger"
      isLoading={loading}
      onPress={async () => {
        setLoading(true)
        await supabase.auth.signOut();
        return window.location.reload();
      }}
    >
      logout
    </Button>
  ) : null;
};
