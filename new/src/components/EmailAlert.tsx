import React, { useState } from 'react';
import { sendWeatherAlertEmail } from '../utils/sendEmail';

interface EmailAlertProps {
  city: string;
  temperature: number;
  severity: 'red' | 'orange' | 'yellow' | 'none';
  message: string;
}

const EmailAlert: React.FC<EmailAlertProps> = ({ city, temperature, severity, message }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await sendWeatherAlertEmail({
        city,
        temperature,
        severity,
        message
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to send email. Please try again.');
      console.error('Email sending error:', err);
    } finally {
      setSending(false);
    }
  };

  if (severity === 'none') return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">Weather Alert</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Get Alert Updates'}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p>Successfully subscribed to weather alerts!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EmailAlert; 