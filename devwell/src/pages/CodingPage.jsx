import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Play, Pause, RotateCcw, Send, PenSquare } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CodingPage = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [notes, setNotes] = useState('');
  const [weeklySessions, setWeeklySessions] = useState([]);
  const [tirednessLevel, setTirednessLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const favoriteSnack = 'Dark Chocolate Almonds';

  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking]);

  useEffect(() => {
    const fetchWeeklySessions = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        toast.error('Please log in to continue');
        window.location.href = '/login';
        return;
      }

      try {
        console.log('Fetching weekly sessions...');
        const response = await fetch(`${API_URL}/api/coding/weekly-trends`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Weekly sessions:', data);
          setWeeklySessions(data);
        } else if (response.status === 401) {
          console.error('Unauthorized: Clearing tokens');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        } else {
          const errorData = await response.json();
          console.error('Failed to load sessions:', errorData);
          setError(`Failed to load coding sessions: ${errorData.detail || response.statusText}`);
          toast.error('Failed to load coding sessions');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An error occurred while fetching sessions');
        toast.error('Network error while fetching sessions');
      }
    };

    const fetchLatestMood = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      try {
        console.log('Fetching latest mood...');
        const response = await fetch(`${API_URL}/api/mood/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Latest mood:', data);
          setTirednessLevel(data.tiredness_level);
        } else {
          console.error('Failed to fetch mood:', await response.json());
        }
      } catch (err) {
        console.error('Fetch error for mood:', err);
      }
    };

    fetchWeeklySessions();
    fetchLatestMood();
  }, []);

  const handleSaveSession = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      toast.error('Please log in to continue');
      setLoading(false);
      window.location.href = '/login';
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
    console.log('Submitting payload:', payload);

    try {
      console.log('Sending request to /api/coding/log...');
      const response = await fetch(`${API_URL}/api/coding/log`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Session logged:', data);
        toast.success('Coding session logged successfully!');
        setSuccess('Coding session logged successfully!');
        setSessionTime(0);
        setNotes('');
        setIsTracking(false);
        const trendsResponse = await fetch(`${API_URL}/api/coding/weekly-trends`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (trendsResponse.ok) {
          const trendsData = await trendsResponse.json();
          console.log('Updated weekly sessions:', trendsData);
          setWeeklySessions(trendsData);
        } else {
          console.error('Failed to refresh sessions:', await trendsResponse.json());
          setError('Failed to refresh coding sessions');
          toast.error('Failed to refresh coding sessions');
        }
      } else if (response.status === 401) {
        console.error('Unauthorized: Clearing tokens');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        console.error('Error response details:', errorData);
        const errorMessage = Array.isArray(errorData.detail)
          ? errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
          : errorData.detail || 'Failed to log coding session';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error while logging session');
      toast.error('Network error while logging session');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset session time?')) {
      setSessionTime(0);
      setNotes('');
      setIsTracking(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Compute analytics
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
  const optimalSessionLength = 25;
  const insights =
    averageSession > optimalSessionLength
      ? ['Your sessions are longer than recommended. Consider 25-minute Pomodoro sessions for better focus.']
      : ['Great job keeping sessions concise! Try maintaining this for optimal productivity.'];

  const uniqueSessions = weeklySessions.reduce((acc, session) => {
    const date = new Date(session.created_at).toLocaleDateString('en-US');
    if (!acc[date] || new Date(session.created_at) > new Date(acc[date].created_at)) {
      acc[date] = session;
    }
    return acc;
  }, {});
  const filteredSessions = Object.values(uniqueSessions);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Track Coding Session</CardTitle>
            <CardDescription>Monitor your coding time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Time: {Math.floor(sessionTime / 60)}m {sessionTime % 60}s
                </p>
                <Button
                  onClick={() => setIsTracking(!isTracking)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  disabled={loading}
                >
                  {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTracking ? 'Stop' : 'Start'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-300">Notes:</p>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
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
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Analytics</CardTitle>
          <CardDescription>Your coding patterns and productivity insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Optimal Session Length</span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{optimalSessionLength} minutes</span>
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
          <div className="pt-2 border-t border-green-200 dark:border-gray-700">
            {insights.map((insight, index) => (
              <p key={index} className="text-sm text-emerald-700 dark:text-emerald-300">{insight}</p>
            ))}
          </div>
          <div className="pt-2">
            <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Weekly Sessions</h4>
            {filteredSessions.length > 0 ? (
              <>
                {filteredSessions.map((session, index) => (
                  <div key={index} className="flex justify-between items-center mt-2">
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                      {formatDate(session.created_at)}: {session.duration_minutes}m
                      {session.notes ? ` (${session.notes})` : ''}
                    </span>
                  </div>
                ))}
                <BarChart width={300} height={200} data={filteredSessions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="duration_minutes" fill="#16a34a" />
                </BarChart>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
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