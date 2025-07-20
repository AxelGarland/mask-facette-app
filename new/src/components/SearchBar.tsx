// src/components/SearchBar.tsx
import React, { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function SearchBar({ onSearch, isLoading, error }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSearch(inputValue.trim());
    setInputValue("");
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          maxWidth: "600px",
          margin: "0 auto",
          gap: "8px",
        }}
      >
        <input
          type="text"
          placeholder="Search locations..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
          {isLoading ? "Loading…" : "Search"}
        </button>
      </form>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "8px" }}>{error}</p>
      )}
    </div>
  );
}
