import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Activity, Droplets, Brain, Apple, Footprints } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'react-toastify';
import { timerService } from '../utils/timerService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const Dashboard = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark') ||
      (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches))
  );
  const [stats, setStats] = useState({
    mood_score: 0,
    hydration_glasses: 0,
    hydration_goal: 8,
    steps: 0,
    coding_sessions: 0,
    focus_time: 0,
  });
  const [insights, setInsights] = useState([]);
  const [weeklyTrends, setWeeklyTrends] = useState({
    mood: [],
    hydration: [],
    coding: [],
  });
  const [latestMood, setLatestMood] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Sync timer with timerService
  useEffect(() => {
    const updateTimer = () => {
      const { sessionTime, isTracking } = timerService.getTimerState();
      setTimer(sessionTime);
      setIsTimerRunning(isTracking);
    };
    updateTimer(); // Initial sync
    const unsubscribe = timerService.subscribe(updateTimer);

    // Fallback for cross-tab updates
    const handleStorageChange = () => {
      updateTimer();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        toast.error('Please log in to continue');
        setLoading(false);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
        return;
      }

      try {
        // Fetch dashboard stats
        const statsResponse = await fetch(`${API_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats({
            mood_score: data.mood_score || 0,
            hydration_glasses: data.hydration_glasses || 0,
            hydration_goal: data.hydration_goal || 8,
            steps: data.steps || 0,
            coding_sessions: data.coding_sessions || 0,
            focus_time: data.focus_time || 0,
          });
          setInsights(data.insights || []);
        } else if (statsResponse.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
          return;
        } else {
          setError('Failed to load dashboard data');
          toast.error('Failed to load dashboard data');
        }

        // Fetch weekly trends
        const trendEndpoints = [
          '/api/mood/weekly-trends',
          '/api/hydration/weekly-trends',
          '/api/coding/weekly-trends',
        ];
        const trendResponses = await Promise.all(
          trendEndpoints.map((endpoint) =>
            fetch(`${API_URL}${endpoint}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          )
        );
        const [moodTrends, hydrationTrends, codingTrends] = await Promise.all(
          trendResponses.map(async (res) => {
            if (res.ok) return res.json();
            throw new Error('Failed to fetch trends');
          })
        );
        setWeeklyTrends({
          mood: moodTrends.data || [],
          hydration: hydrationTrends.data || [],
          coding: codingTrends.data || [],
        });

        // Fetch latest mood
        const moodResponse = await fetch(`${API_URL}/api/mood/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (moodResponse.ok) {
          const data = await moodResponse.json();
          
          setLatestMood(data.mood_score|| null);
        } else {
          setError('Failed to load latest mood');
          toast.error('Failed to load latest mood');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        toast.error('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }

      // Fetch latest hydration
const hydrationResponse = await fetch(`${API_URL}/api/hydration/latest`, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

if (hydrationResponse.ok) {
  const data = await hydrationResponse.json();
  // Update the stats state with the latest hydration
  setStats(prev => ({
    ...prev,
    hydration_glasses: data.water_glasses || 0, // make sure this matches your schema field
  }));
} else {
  toast.error('Failed to load latest hydration');
}

    };
      
    
    fetchDashboardData();
  }, [navigate]);

  
  const toggleTheme = () => setIsDark(!isDark);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

   const addHydrationGlass = () => {
  setStats(prev => ({
    ...prev,
    hydration_glasses: Math.min(prev.hydration_glasses + 1, prev.hydration_goal)
  }));
};
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
          Developer Wellness Dashboard
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-emerald-100/50 dark:hover:bg-blue-900/50 hover:shadow-sm hover:shadow-emerald-500/20"
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-yellow-400" />
          ) : (
            <Moon className="h-6 w-6 text-emerald-500" />
          )}
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Mood & Hydration Cards */}
        <div className="space-y-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <Brain className="h-5 w-5 text-purple-500" />
                Daily Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.mood_score * 20} className="h-2 bg-emerald-100 dark:bg-blue-900" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
             Mood Score: {latestMood ? latestMood : stats.mood_score}/5
              {/* Mood Score: {stats.mood_score}/5*/}
              {/* {latestMood && ` (Latest: ${latestMood})`} */}
              </p>
              {weeklyTrends.mood.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Weekly Mood Trend</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400">
                    {weeklyTrends.mood.map((trend, index) => (
                      <li key={index}>{trend.date}: {trend.score}/5</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <Droplets className="h-5 w-5 text-cyan-500" />
                Hydration Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={(stats.hydration_glasses / stats.hydration_goal) * 100}
                className="h-2 bg-emerald-100 dark:bg-blue-900"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {stats.hydration_glasses}/{stats.hydration_goal} glasses
              </p>
              
              {weeklyTrends.hydration.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Weekly Hydration Trend</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400">
                    {weeklyTrends.hydration.map((trend, index) => (
                      <li key={index}>{trend.date}: {trend.glasses} glasses</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center: Timer Circle */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={cn(
              'relative flex items-center justify-center h-64 w-64 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-4 border-emerald-500/50 shadow-xl shadow-emerald-500/20 dark:shadow-blue-900/20'
            )}
          >
            <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatTime(timer)}
            </div>
            {isTimerRunning && (
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin-slow" />
            )}
          </div>
        </div>

        {/* Right: Break Suggestions & Nutrition Advice */}
        <div className="space-y-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <Footprints className="h-5 w-5 text-teal-500" />
                Break Suggestions
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Optimize your productivity with intentional breaks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-emerald-100/50 dark:bg-blue-900/50 border border-emerald-200/50 dark:border-blue-700/50 hover:shadow-md hover:shadow-emerald-500/20"
                  >
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Take a 5-minute walk every 90 minutes to refresh your mind.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <Apple className="h-5 w-5 text-red-500" />
                Nutrition Advice
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Fuel your coding sessions with healthy snacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Try dark chocolate almonds for a quick energy boost, or hydrate with lemon-infused water.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Center: Session Summary & Weekly Coding Trends */}
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Activity className="h-5 w-5 text-emerald-500" />
              Session Summary
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your coding and focus sessions today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Coding Sessions</span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{stats.coding_sessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Focus Time</span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {Math.floor(stats.focus_time / 60)}h {stats.focus_time % 60}m
              </span>
            </div>
            {weeklyTrends.coding.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Weekly Coding Trend</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400">
                  {weeklyTrends.coding.map((trend, index) => (
                    <li key={index}>{trend.date}: {trend.sessions} sessions</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;