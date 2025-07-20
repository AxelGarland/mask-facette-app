// src/components/LocationCard.tsx
import React from "react";

export interface Location {
  city: string;
  temperature: number;
  severity: "none" | "yellow" | "orange" | "red";
  message: string;
}

interface LocationCardProps {
  data: Location;
  isSelected: boolean;
  onClick: () => void;
}

export default function LocationCard({ data, isSelected, onClick }: LocationCardProps) {
  // Choose border color based on severity
  let borderColor = "#ccc";
  if (data.severity === "red") borderColor = "#EF4444"; // red-500
  else if (data.severity === "orange") borderColor = "#F97316"; // orange-500
  else if (data.severity === "yellow") borderColor = "#FACC15"; // yellow-500

  // If selected, give a thicker black border
  const selectedStyle = isSelected
    ? { border: "2px solid #000", backgroundColor: "#ffffff" }
    : { border: `2px solid ${borderColor}`, backgroundColor: "#ffffff" };

  return (
    <div
      onClick={onClick}
      style={{
        ...selectedStyle,
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        boxShadow: isSelected
          ? "0 2px 6px rgba(0,0,0,0.2)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.2s, border 0.2s",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{data.city}</h3>
      <p style={{ fontSize: "16px", marginBottom: "4px" }}>{data.temperature}°C</p>
      <p style={{ fontSize: "14px", color: "#555" }}>{data.message}</p>
    </div>
  );
}
