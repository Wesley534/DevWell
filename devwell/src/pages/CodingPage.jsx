import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Play, Pause, RotateCcw, Send } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { cn } from '../lib/utils';
import { timerService } from '../utils/timerService';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CodingPage = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark') ||
      (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches))
  );
  const [sessionTime, setSessionTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [notes, setNotes] = useState('');
  const [weeklySessions, setWeeklySessions] = useState([]);
  const [tirednessLevel, setTirednessLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const favoriteSnack = 'Dark Chocolate Almonds';
  const optimalSessionLength = 25 * 60; // 25 minutes in seconds

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

  // Sync with timerService
  useEffect(() => {
    const updateTimer = () => {
      const { sessionTime, isTracking } = timerService.getTimerState();
      setSessionTime(sessionTime);
      setIsTracking(isTracking);
      // console.log('Timer state updated:', { sessionTime, isTracking }); // Debug
    };
    updateTimer(); // Initial sync
    const unsubscribe = timerService.subscribe(updateTimer);

    // Handle cross-tab updates
    const handleStorageChange = (e) => {
      if (e.key === 'codingSessionTime' || e.key === 'codingIsTracking') {
        updateTimer();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        toast.error('Please log in to continue');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
        return;
      }

      try {
        // Fetch weekly sessions
        const sessionsResponse = await fetch(`${API_URL}/api/coding/weekly-trends`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (sessionsResponse.ok) {
          const data = await sessionsResponse.json();
          // Sort by created_at descending and take first 4
          const sortedSessions = data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4);
          setWeeklySessions(sortedSessions);
        } else if (sessionsResponse.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
          return;
        } else {
          const errorData = await sessionsResponse.json();
          setError(`Failed to load coding sessions: ${errorData.detail || 'Unknown error'}`);
          toast.error('Failed to load coding sessions');
        }

        // Fetch latest mood
        const moodResponse = await fetch(`${API_URL}/api/mood/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (moodResponse.ok) {
          const data = await moodResponse.json();
          setTirednessLevel(data.tiredness_level || null);
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        toast.error('Network error while fetching data');
      }
    };

    fetchData();
  }, [navigate]);

  const handleStartStop = () => {
    if (isTracking) {
      timerService.stopTimer();
      setIsTracking(false); // Explicitly update state
      console.log('Stop button clicked, timer stopped'); // Debug
    } else {
      timerService.startTimer();
      setIsTracking(true); // Explicitly update state
      console.log('Start button clicked, timer started'); // Debug
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset session time?')) {
      timerService.resetTimer();
      setIsTracking(false); // Ensure tracking is stopped on reset
      setNotes('');
    }
  };

  const handleSaveSession = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

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

    const durationMinutes = Math.floor(sessionTime / 60);
    if (durationMinutes < 1) {
      setError('Session must be at least 1 minute long');
      toast.error('Session must be at least 1 minute long');
      setLoading(false);
      return;
    }

    const payload = {
      duration_minutes: durationMinutes,
      notes: notes.trim() || null,
    };

    try {
      const response = await fetch(`${API_URL}/api/coding/log`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess('Coding session logged successfully!');
        toast.success('Coding session logged successfully!');
        timerService.resetTimer();
        setIsTracking(false); // Ensure tracking is stopped after saving
        setNotes('');

        // Refresh weekly sessions
        const trendsResponse = await fetch(`${API_URL}/api/coding/weekly-trends`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (trendsResponse.ok) {
          const data = await trendsResponse.json();
          const sortedSessions = data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4);
          setWeeklySessions(sortedSessions);
        } else {
          setError('Failed to refresh coding sessions');
          toast.error('Failed to refresh coding sessions');
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.detail)
          ? errorData.detail.map((err) => `${err.loc.join('.')}: ${err.msg}`).join('; ')
          : errorData.detail || 'Failed to log coding session';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setError('Network error while logging session');
      toast.error('Network error while logging session');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const averageSession = weeklySessions.length
    ? (weeklySessions.reduce((sum, session) => sum + session.duration_minutes, 0) / weeklySessions.length).toFixed(1)
    : 0;
  const mostProductiveHour = weeklySessions.length
    ? new Date(
        weeklySessions.reduce((max, session) => {
          const hour = new Date(session.created_at).getHours();
          return max.hour > hour ? max : { hour, count: 1 };
        }, { hour: 0, count: 0 }).hour * 1000 * 3600
      ).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    : 'N/A';
  const insights =
    averageSession > optimalSessionLength / 60
      ? ['Your sessions are longer than recommended. Consider 25-minute Pomodoro sessions for better focus.']
      : ['Great job keeping sessions concise! Try maintaining this for optimal productivity.'];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      <div className="md:col-span-2">
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
          <CardHeader>
            <CardTitle className="text-emerald-800 dark:text-emerald-200">Track Coding Session</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Monitor your coding time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  'relative flex items-center justify-center h-64 w-64 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-4 border-emerald-500/50 shadow-xl shadow-emerald-500/20 dark:shadow-blue-900/20',
                  isTracking && 'animate-pulse',
                  sessionTime > optimalSessionLength && 'border-yellow-500/50'
                )}
              >
                <div
                  className={cn(
                    'text-4xl font-bold',
                    sessionTime > optimalSessionLength ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-700 dark:text-emerald-300'
                  )}
                >
                  {formatTime(sessionTime)}
                </div>
                {isTracking && (
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin-slow" />
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleStartStop}
                  className={cn(
                    'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30',
                    isTracking && 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                  )}
                  disabled={loading}
                >
                  {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTracking ? 'Stop' : 'Start'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-100/50 dark:hover:bg-blue-900/50"
                  disabled={loading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Notes:</p>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded border-emerald-300 dark:border-emerald-600 bg-white/95 dark:bg-gray-800/95 focus:ring-emerald-500"
                placeholder="Add session notes..."
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSaveSession}
              className="bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              disabled={loading || sessionTime < 60}
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Session'
              )}
            </Button>
            {tirednessLevel >= 7 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Feeling low on energy? Try some {favoriteSnack} for a quick boost!
              </p>
            )}
            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            {success && <p className="text-green-500 dark:text-green-400">{success}</p>}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200/50 dark:border-blue-700/50 shadow-lg shadow-emerald-500/10 dark:shadow-blue-900/10">
        <CardHeader>
          <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200">Session Analytics</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your coding patterns and productivity insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Optimal Session Length</span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{optimalSessionLength / 60} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Average Session</span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{averageSession} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Most Productive Hour</span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{mostProductiveHour}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-emerald-200/50 dark:border-blue-700/50">
            {insights.map((insight, index) => (
              <p key={index} className="text-sm text-emerald-700 dark:text-emerald-300">{insight}</p>
            ))}
          </div>
          <div className="pt-2">
            <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Weekly Sessions</h4>
            {weeklySessions.length > 0 ? (
              <>
                <ul className="text-sm text-gray-600 dark:text-gray-400">
                  {weeklySessions.map((session, index) => (
                    <li key={index}>{formatDate(session.created_at)}: {session.duration_minutes} minutes</li>
                  ))}
                </ul>
                <BarChart width={300} height={200} data={weeklySessions}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E3A8A' : '#D1D5DB'} />
                  <XAxis dataKey="created_at" tickFormatter={formatDate} stroke={isDark ? '#6EE7B7' : '#047857'} />
                  <YAxis stroke={isDark ? '#6EE7B7' : '#047857'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#6EE7B7' : '#047857'}`,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="duration_minutes" fill={isDark ? '#06B6D4' : '#10B981'} />
                </BarChart>
              </>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No coding sessions this week. Start tracking to see trends!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default CodingPage;