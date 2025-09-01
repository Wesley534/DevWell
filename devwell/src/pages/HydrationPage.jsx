// frontend/src/components/HydrationPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Coffee, Droplet, RotateCcw, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const HydrationPage = () => {
    const [glasses, setGlasses] = useState(0);
    const [coffeeCups, setCoffeeCups] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(8);
    const [weeklyTrends, setWeeklyTrends] = useState([]);
    const [tirednessLevel, setTirednessLevel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const favoriteSnack = 'Dark Chocolate Almonds';

    useEffect(() => {
        const fetchWeeklyTrends = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('Token for hydration trends:', token);
            if (!token) {
                setError('Authentication required');
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/hydration/weekly-trends`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Hydration trends:', data);
                    setWeeklyTrends(data);
                } else if (response.status === 401) {
                    console.log('Unauthorized, redirecting to login');
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    setError('Failed to load hydration trends');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('An error occurred while fetching trends');
            }
        };

        const fetchLatestMood = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            try {
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
                }
            } catch (err) {
                console.error('Fetch error for mood:', err);
            }
        };

        fetchWeeklyTrends();
        fetchLatestMood();
    }, []);

    const handleLogHydration = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token for hydration log:', token);
        if (!token) {
            setError('Authentication required');
            setLoading(false);
            window.location.href = '/login';
            return;
        }

        const payload = {
            water_glasses: glasses,
            coffee_cups: coffeeCups,
            daily_goal: parseInt(dailyGoal), // Ensure integer
        };
        console.log('Submitting payload:', payload);

        try {
            const response = await fetch(`${API_URL}/api/hydration/log`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess('Hydration logged successfully!');
                setGlasses(0);
                setCoffeeCups(0);
                setDailyGoal(8);
                const trendsResponse = await fetch(`${API_URL}/api/hydration/weekly-trends`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                if (trendsResponse.ok) {
                    setWeeklyTrends(await trendsResponse.json());
                } else {
                    setError('Failed to refresh hydration trends');
                }
            } else if (response.status === 401) {
                console.log('Unauthorized, redirecting to login');
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                console.error('Error response details:', errorData.detail); // Log full details
                const errorMessage = Array.isArray(errorData.detail)
                    ? errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
                    : errorData.detail || 'Failed to log hydration';
                setError(errorMessage);
                console.error('Error response:', errorData);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An error occurred while logging hydration');
        } finally {
            setLoading(false);
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

    const uniqueTrends = weeklyTrends.reduce((acc, trend) => {
        const date = new Date(trend.created_at).toLocaleDateString('en-US');
        if (!acc[date] || new Date(trend.created_at) > new Date(acc[date].created_at)) {
            acc[date] = trend;
        }
        return acc;
    }, {});
    const filteredTrends = Object.values(uniqueTrends);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Log Hydration</CardTitle>
                        <CardDescription>Track your daily water and coffee intake</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    Water Glasses Today: {glasses}/{dailyGoal}
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => setGlasses(glasses + 1)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    disabled={loading}
                                >
                                    <Droplet className="h-4 w-4 mr-2" />
                                    Add Glass
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setGlasses(0)}
                                    disabled={loading}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    Coffee Cups Today: {coffeeCups}
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => setCoffeeCups(coffeeCups + 1)}
                                    className="bg-amber-600 hover:bg-amber-700 text-white hover:shadow-[0_0_10px_rgba(217,119,6,0.5)]"
                                    disabled={loading}
                                >
                                    <Coffee className="h-4 w-4 mr-2" />
                                    Add Coffee
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setCoffeeCups(0)}
                                    disabled={loading}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    Daily Goal (Glasses): {dailyGoal}
                                </p>
                                <input
                                    type="number"
                                    value={dailyGoal}
                                    onChange={(e) => setDailyGoal(Math.max(1, Number(e.target.value)))}
                                    className="w-20 p-2 border rounded border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
                                    min="1"
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleLogHydration}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                disabled={loading}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {loading ? 'Logging...' : 'Log Hydration'}
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
                    <CardTitle className="text-lg">Hydration History</CardTitle>
                    <CardDescription>Daily water and coffee intake progress</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredTrends.length > 0 ? (
                            filteredTrends.map((trend, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                        {formatDate(trend.created_at)}: {trend.water_glasses}/{trend.daily_goal} glasses, {trend.coffee_cups} coffee
                                    </span>
                                    <div className="flex gap-2">
                                        <div className="flex gap-1">
                                            {Array.from({ length: trend.daily_goal }, (_, i) => (
                                                <div
                                                    key={`water-${i}`}
                                                    className={`w-2 h-4 rounded-sm ${
                                                        i < trend.water_glasses ? 'bg-blue-400' : 'bg-emerald-100 dark:bg-gray-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex gap-1">
                                            {Array.from({ length: 4 }, (_, i) => (
                                                <div
                                                    key={`coffee-${i}`}
                                                    className={`w-2 h-4 rounded-sm ${
                                                        i < trend.coffee_cups ? 'bg-amber-600' : 'bg-emerald-100 dark:bg-gray-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No hydration data for this week. Log your intake to see trends!
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HydrationPage;