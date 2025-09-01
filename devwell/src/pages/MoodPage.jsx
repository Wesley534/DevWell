// frontend/src/components/MoodPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MoodPage = () => {
    const [mood, setMood] = useState('');
    const [description, setDescription] = useState('');
    const [tiredness, setTiredness] = useState(5);
    const [weeklyTrends, setWeeklyTrends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const moodOptions = [
        { name: 'Excellent', emoji: '😊', value: 5, color: 'bg-green-400' },
        { name: 'Good', emoji: '🙂', value: 4, color: 'bg-green-300' },
        { name: 'Neutral', emoji: '😐', value: 3, color: 'bg-yellow-400' },
        { name: 'Poor', emoji: '😢', value: 2, color: 'bg-red-400' },
    ];

    useEffect(() => {
        const fetchWeeklyTrends = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('Token for weekly trends:', token);
            if (!token) {
                setError('Authentication required');
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/mood/weekly-trends`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Weekly trends:', data);
                    setWeeklyTrends(data);
                } else if (response.status === 401) {
                    console.log('Unauthorized, redirecting to login');
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    setError('Failed to load weekly trends');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('An error occurred while fetching trends');
            }
        };

        fetchWeeklyTrends();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token for mood log:', token);
        if (!token) {
            setError('Authentication required');
            setLoading(false);
            window.location.href = '/login';
            return;
        }

        const payload = {
            mood_score: moodOptions.find((m) => m.name === mood)?.value || 3,
            notes: description,
            tiredness_level: Number(tiredness), // Ensure integer
        };
        console.log('Submitting payload:', payload);

        try {
            const response = await fetch(`${API_URL}/api/mood/log`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess('Mood logged successfully!');
                setMood('');
                setDescription('');
                setTiredness(5);
                const trendsResponse = await fetch(`${API_URL}/api/mood/weekly-trends`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                if (trendsResponse.ok) {
                    setWeeklyTrends(await trendsResponse.json());
                } else {
                    setError('Failed to refresh weekly trends');
                }
            } else if (response.status === 401) {
                console.log('Unauthorized, redirecting to login');
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to log mood');
                console.error('Error response:', errorData);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An error occurred while logging mood');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'No Date';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Filter to show only the latest mood log per day
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
                        <CardTitle>Log Your Mood</CardTitle>
                        <CardDescription>How are you feeling today?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-2 flex-wrap">
                                {moodOptions.map((m) => (
                                    <Button
                                        key={m.name}
                                        type="button" // Prevent form submission
                                        variant={mood === m.name ? 'default' : 'outline'}
                                        onClick={() => setMood(m.name)}
                                        className={`flex items-center gap-2 ${mood === m.name ? m.color : 'bg-gray-100 dark:bg-gray-700'}`}
                                        disabled={loading}
                                    >
                                        <span className="text-lg">{m.emoji}</span>
                                        {m.name}
                                    </Button>
                                ))}
                            </div>
                            <div>
                                <Label htmlFor="description" className="text-emerald-700 dark:text-emerald-300">
                                    Describe Your Mood
                                </Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="E.g., Feeling energized after a great coding session..."
                                    className="h-24 border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tiredness" className="text-emerald-700 dark:text-emerald-300">
                                    Tiredness Level (0 = Energetic, 10 = Exhausted)
                                </Label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        id="tiredness"
                                        min="0"
                                        max="10"
                                        value={tiredness}
                                        onChange={(e) => setTiredness(Number(e.target.value))}
                                        className="w-full"
                                        disabled={loading}
                                    />
                                    <span className="text-emerald-700 dark:text-emerald-300">{tiredness}</span>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={loading || !mood}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {loading ? 'Logging...' : 'Log Mood'}
                            </Button>
                            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                            {success && <p className="text-green-500 dark:text-green-400">{success}</p>}
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Weekly Mood Trends</CardTitle>
                    <CardDescription>Your emotional well-being over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredTrends.length > 0 ? (
                            filteredTrends.map((trend, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                        {formatDate(trend.created_at)}: {trend.notes || 'No notes'} (Tiredness: {trend.tiredness_level ?? 'N/A'})
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                            {moodOptions.find((m) => m.value === trend.mood_score)?.emoji || '😐'}
                                        </span>
                                        <div
                                            className={`w-4 h-4 rounded-full ${
                                                moodOptions.find((m) => m.value === trend.mood_score)?.color || 'bg-gray-400'
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No mood data for this week. Log your mood to see trends!
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MoodPage;