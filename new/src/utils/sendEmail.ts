// src/utils/sendEmail.ts
import emailjs from "@emailjs/browser";

export interface AlertEmailData {
  city: string;
  temperature: number;
  severity: string;
  message: string;
}

export function sendWeatherAlertEmail({
  city,
  temperature,
  severity,
  message,
}: AlertEmailData) {
  // These values come from your .env
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;

  return emailjs.send(serviceId, templateId, { city, temperature, severity, message }, publicKey);
}
