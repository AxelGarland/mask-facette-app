import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

interface EmailSignupProps {
  onSignup: (email: string) => void;
}

const EmailSignup: React.FC<EmailSignupProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Send welcome email
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          message: 'Welcome to Weather Alerts! You will now receive weather alerts for your subscribed locations.',
          subject: 'Welcome to Weather Alerts'
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      setSuccess(true);
      onSignup(email);
      setEmail('');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      console.error('Email signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Sign Up for Weather Alerts</h2>
      <p className="text-gray-600 mb-4">
        Get notified about severe weather conditions in your area. We'll send you alerts for:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6">
        <li>Severe weather warnings</li>
        <li>Extreme temperature alerts</li>
        <li>Storm notifications</li>
        <li>Other weather emergencies</li>
      </ul>

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
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up for Alerts'}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p>Successfully signed up! You will receive a confirmation email shortly.</p>
          </div>
        )}
      </form>

      <p className="mt-4 text-sm text-gray-500">
        By signing up, you agree to receive weather alerts and updates. You can unsubscribe at any time.
      </p>
    </div>
  );
};

export default EmailSignup; 