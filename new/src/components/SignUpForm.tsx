// src/components/SignUpForm.tsx
import React, { useState, FormEvent } from "react";

interface SignUpFormProps {
  onSubscribe: (email: string) => void;
  isLoading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

export default function SignUpForm({
  onSubscribe,
  isLoading,
  successMessage,
  errorMessage,
}: SignUpFormProps) {
  const [emailInput, setEmailInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onSubscribe(emailInput.trim());
    setEmailInput("");
  }

  return (
    <div
      style={{
        marginTop: "80px", /* make room for fixed SearchBar */
        marginBottom: "32px",
        textAlign: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <input
          type="email"
          placeholder="Enter your email for alerts"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {successMessage && (
        <p style={{ color: "green", marginTop: "8px" }}>{successMessage}</p>
      )}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>
      )}
    </div>
  );
}
