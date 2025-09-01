// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import {
  Activity,
  Droplets,
  Brain,
  Sparkles,
  Code,
  Sun,
  Moon,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('Token:', token); // Debug
      if (!token) {
        console.log('No token found, redirecting to login');
        setError('Authentication required');
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setInsights(data.insights);
        } else if (response.status === 401) {
          console.log('Unauthorized, redirecting to login');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleToggle = () => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 min-h-screen">
      <div className="flex justify-end p-4">
        <button
          onClick={handleToggle}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          )}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            AI Wellness Insights
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Personalized recommendations based on your activity patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">

          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{insight}</p>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No insights available yet. Log more data to get personalized recommendations!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;