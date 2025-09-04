// frontend/src/pages/BuyMeCoffeePage.jsx
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Coffee } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_xxxxxxxx';

export const BuyMeCoffeePage = () => {
  const [amount, setAmount] = useState(100); // Default to 1 KES (100 cents)
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBuyCoffee = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (amount < 1) {
      setError('Amount must be at least 1 KES');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to cents
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to initialize payment');
        setLoading(false);
        return;
      }

      const { access_code } = await response.json();

      const popup = new PaystackPop();
      popup.resumeTransaction(access_code, {
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100,
        currency: 'KES',
        channels: ['mobile_money'],
        onSuccess: async (transaction) => {
          setSuccess(`Payment successful! Reference: ${transaction.reference}`);
          try {
            const verifyResponse = await fetch(`${API_URL}/api/payments/verify/${transaction.reference}`);
            const verifyData = await verifyResponse.json();
            if (verifyData.status === 'success') {
              setSuccess(`Payment verified! Thank you for your support!`);
            } else {
              setError('Payment verification failed');
            }
          } catch (err) {
            setError('Error verifying payment');
          }
          setLoading(false);
        },
        onCancel: () => {
          setError('Payment cancelled');
          setLoading(false);
        },
      });
    } catch (err) {
      setError('An error occurred while processing payment');
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-emerald-800 dark:text-emerald-200">Buy Me a Coffee</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Support the app by buying a virtual coffee with M-Pesa! ☕
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Email:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded border-emerald-300 dark:border-emerald-600 bg-white/95 dark:bg-gray-800/95 focus:ring-emerald-500"
              placeholder="your@email.com"
              disabled={loading}
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Amount (KES):</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              className="w-32 p-2 border rounded border-emerald-300 dark:border-emerald-600 bg-white/95 dark:bg-gray-800/95 focus:ring-emerald-500"
              min="1"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleBuyCoffee}
            className="bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            disabled={loading}
          >
            <Coffee className="h-4 w-4 mr-2" />
            {loading ? 'Processing...' : 'Buy Coffee with M-Pesa'}
          </Button>
          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
          {success && <p className="text-green-500 dark:text-green-400">{success}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyMeCoffeePage;