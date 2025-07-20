// src/App.tsx
import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import SignUpForm from "./components/SignUpForm";
import LocationCard, { Location } from "./components/LocationCard";
import { sendWeatherAlertEmail } from "./utils/sendEmail";

export default function App() {
  // State for weather + alerts
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // State for email subscription
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  // ================================
  // 1) Handle searching a city:
  // ================================
  async function handleSearch(city: string) {
    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      // 1a. Fetch basic weather (2.5/weather) to get coords + temperature
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY!;
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${apiKey}`
      );
      if (!res1.ok) {
        throw new Error("City not found");
      }
      const data1 = await res1.json();
      const { name, main, coord } = data1;
      const temperature = Math.round(main.temp);

      // 1b. Fetch alerts (One Call 3.0)
      const res2 = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,daily&units=metric&appid=${apiKey}`
      );
      if (!res2.ok) {
        throw new Error("Failed to fetch alerts");
      }
      const alertData = await res2.json();
      const alerts = alertData.alerts || [];

      // Determine severity based on first alert (if present)
      let severity: Location["severity"] = "none";
      let alertMessage = "No active weather alerts";
      if (alerts.length > 0) {
        const eventLower = alerts[0].event.toLowerCase();
        if (
          eventLower.includes("extreme") ||
          eventLower.includes("fire") ||
          eventLower.includes("evac")
        ) {
          severity = "red";
        } else if (
          eventLower.includes("warning") ||
          eventLower.includes("storm") ||
          eventLower.includes("wind")
        ) {
          severity = "orange";
        } else {
          severity = "yellow";
        }
        alertMessage = alerts[0].event;
      }

      // Build new location object
      const newLoc: Location = {
        city: name,
        temperature,
        severity,
        message: alertMessage,
      };

      // 1c. Add/update in state (prevent duplicates)
      setLocations((prev) => {
        const idx = prev.findIndex(
          (loc) => loc.city.toLowerCase() === newLoc.city.toLowerCase()
        );
        if (idx >= 0) {
          // Update existing
          const copy = [...prev];
          copy[idx] = newLoc;
          return copy;
        } else {
          // Add new
          return [...prev, newLoc];
        }
      });

      // 1d. Select the updated/added index
      setSelectedIndex((prev) => {
        const idx = locations.findIndex(
          (loc) => loc.city.toLowerCase() === newLoc.city.toLowerCase()
        );
        return idx >= 0 ? idx : locations.length; // if existed, use existing index; else last index
      });

      // 1e. Send an email alert if severity ≠ “none” and someone has already subscribed
      // (We’ll only do this if we have at least one subscriber, for simplicity assume we automatically email the same “default” address in this demo.)
      if (severity !== "none") {
        // In a real app, you’d track multiple subscribers per city.
        // For demo: if they subscribed once, we email them on any alert.
        sendWeatherAlertEmail({
          city: name,
          temperature,
          severity,
          message: alertMessage,
        }).catch((err) => {
          console.error("EmailJS error:", err);
        });
      }

      setIsLoadingWeather(false);
    } catch (err: any) {
      setWeatherError(err.message);
      setIsLoadingWeather(false);
    }
  }

  // ================================
  // 2) Handle subscribing an email:
  // ================================
  async function handleSubscribe(email: string) {
    setIsSubscribing(true);
    setSubscribeError(null);
    setSubscribeSuccess(null);

    try {
      // Use EmailJS to send a “Confirmation” email
      await sendWeatherAlertEmail({
        city: "Signup Confirmation",
        temperature: 0,
        severity: "none",
        message: `Thank you for subscribing, ${email}! You will now receive severe weather alerts via email.`,
      });
      setSubscribeSuccess("Subscription successful! Check your inbox for confirmation.");
    } catch (err: any) {
      setSubscribeError("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  }

  // ================================
  // 3) Render UI
  // ================================
  const selected = selectedIndex >= 0 ? locations[selectedIndex] : null;
  const activeAlerts = locations.filter((loc) => loc.severity !== "none");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Fixed Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        isLoading={isLoadingWeather}
        error={weatherError}
      />

      {/* Main content container */}
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "40px" }}>
        {/* Sign‐Up Form */}
        <SignUpForm
          onSubscribe={handleSubscribe}
          isLoading={isSubscribing}
          successMessage={subscribeSuccess}
          errorMessage={subscribeError}
        />

        {/* Selected City Banner */}
        {selected && (
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
              {selected.city}
            </h1>
            <p style={{ fontSize: "20px", marginBottom: "8px" }}>{selected.temperature}°C</p>
            <p style={{ fontSize: "16px", color: "#555" }}>{selected.message}</p>
          </div>
        )}

        {/* Location Cards */}
        {locations.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>
              Your Locations
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {locations.map((loc, idx) => (
                <LocationCard
                  key={idx}
                  data={loc}
                  isSelected={idx === selectedIndex}
                  onClick={() => setSelectedIndex(idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Global Alerts */}
        {activeAlerts.length > 0 && (
          <div
            style={{
              backgroundColor: "#fff5f5",
              borderLeft: "4px solid #EF4444",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#B91C1C", marginBottom: "8px" }}>
              Global Alerts
            </h2>
            <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
              {activeAlerts.map((alertLoc, idx) => (
                <li key={idx} style={{ marginBottom: "4px", fontSize: "16px" }}>
                  {alertLoc.message}: {alertLoc.city}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
