import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // Added for success/error feedback

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      console.log('Token found, redirecting to /dashboard');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = { email, password, remember_me: rememberMe };
    console.log('Submitting login payload:', payload);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        const { access_token, token_type, needs_onboarding } = data;
        console.log('Access Token:', access_token);
        console.log('Token Type:', token_type);
        console.log('Needs Onboarding:', needs_onboarding);

        // Store token
        if (rememberMe) {
          localStorage.setItem('token', access_token);
          console.log('Token stored in localStorage');
        } else {
          sessionStorage.setItem('token', access_token);
          console.log('Token stored in sessionStorage');
        }

        toast.success('Login successful!');

        // Redirect based on needs_onboarding
        if (needs_onboarding) {
          console.log('Redirecting to /onboarding');
          navigate('/onboarding');
        } else {
          console.log('Redirecting to:', location.state?.from || '/dashboard');
          navigate(location.state?.from || '/dashboard');
        }
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
        toast.error(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-green-100 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-md">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">DevWell Login</h1>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-emerald-700 dark:text-emerald-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
              required
              disabled={loading}
            />
          </div>
          <div className="relative">
            <Label htmlFor="password" className="text-emerald-700 dark:text-emerald-300">Password</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-emerald-700 dark:text-emerald-300"
              aria-label="Toggle password visibility"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 dark:border-emerald-600 rounded"
              disabled={loading}
            />
            <Label htmlFor="remember-me" className="ml-2 text-emerald-700 dark:text-emerald-300">
              Remember me for 30 days
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3 shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Don't have an account?{' '}
          <a href="/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;