import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added for better UX
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      if (response.ok) {
        const data = await response.json();
        if (rememberMe) {
          localStorage.setItem('token', data.access_token);
        } else {
          sessionStorage.setItem('token', data.access_token);
        }
        navigate(location.state?.from || '/dashboard');
      } else {
        const data = await response.json();
        setError(data.detail || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-green-100 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-md">
            <UserPlus className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">DevWell Signup</h1>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-6">
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
          <div className="relative">
            <Label htmlFor="confirmPassword" className="text-emerald-700 dark:text-emerald-300">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-emerald-700 dark:text-emerald-300"
              aria-label="Toggle confirm password visibility"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;