"use client";

import { useState } from "react";
import { createClientBrowser, normalizePhone } from "@/utils";
import { Input, Button } from "@heroui/react";

export const Header = ({ user }) => {
  const supabase = createClientBrowser();
  const [input, setInput] = useState({
    username: "",
    phone: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);

  async function sendOtp(phone) {
    try {
      const formattedPhone = normalizePhone(phone);
      if (!formattedPhone) return alert("Invalid phone number");

      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw new Error(error.message);

      return verifyOtp(formattedPhone);
    } catch (error) {
      setLoading(false);
      console.log("Error at sendOtp: ", error);
    }
  }

  async function verifyOtp(phone) {
    try {
      const token = window.prompt("Please enter your verification code.");
      if (!token) throw new Error("Invalid verification code.");

      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (error) throw new Error(error.message);

      // TODO create or update user profile

      return window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log("Error at verifyOtp: ", error);
    }
  }

  return (
    <div className="header-box">
      <section className="header-inner-box">
        <h1>Expierds</h1>
        <p>Real-time expired listings for real estate agents</p>
        {!user ? (
          <>
            <Input
              type="phone"
              placeholder="phone"
              value={input.phone}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <Button
              color="primary"
              isLoading={loading}
              onPress={() => sendOtp(input.phone)}
            >
              Sign In
            </Button>
          </>
        ) : null}
      </section>
    </div>
  );
};
