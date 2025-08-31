import React from 'react';
import { useState, useEffect } from 'react';
import { Heart, Code, User, Settings, Moon, Sun, TrendingUp, Activity, Droplets, Brain, Sparkles } from 'lucide-react';

// Button Component
const Button = ({ variant = 'default', size = 'default', onClick, children }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    ghost: 'text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-gray-700',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    icon: 'h-10 w-10',
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Card Components
const Card = ({ children, className }) => (
  <div className={`rounded-lg border border-green-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ${className || ''}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className }) => <div className={`p-6 ${className || ''}`}>{children}</div>;
const CardTitle = ({ children, className }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-emerald-800 dark:text-emerald-200 ${className || ''}`}>
    {children}
  </h3>
);
const CardDescription = ({ children }) => (
  <p className="text-sm text-emerald-700 dark:text-emerald-300">{children}</p>
);
const CardContent = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>
);

// Tabs Components
const Tabs = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};
const TabsList = ({ activeTab, setActiveTab, className, children }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-emerald-100 dark:bg-gray-700 p-1 text-emerald-700 dark:text-emerald-300 ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);
const TabsTrigger = ({ value, activeTab, setActiveTab, children }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
      activeTab === value ? 'bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200 shadow-sm' : 'text-emerald-700 dark:text-emerald-300'
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);
const TabsContent = ({ value, activeTab, children, className }) => (
  <div className={`${className} ${activeTab === value ? 'block' : 'hidden'}`}>
    {children}
  </div>
);

// StatCard Component
const StatCard = ({ title, value, description, icon: Icon, trend, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{value}</div>
        <p className="text-xs text-emerald-700 dark:text-emerald-300">{description}</p>
        {trend !== undefined && (
          <div className="flex items-center mt-1">
            <TrendingUp className={`h-3 w-3 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// DashboardStats Component
const DashboardStats = () => {
  const stats = [
    {
      title: "Avg. Mood Score",
      value: "4.2/5",
      description: "Excellent mental health this week",
      icon: Brain,
      trend: 12,
      color: "mood-excellent"
    },
    {
      title: "Hydration Goal",
      value: "87%",
      description: "7 out of 8 glasses daily",
      icon: Droplets,
      trend: 8,
      color: "hydration-excellent"
    },
    {
      title: "Coding Sessions",
      value: "23",
      description: "Total sessions this week",
      icon: Code,
      trend: -5,
      color: "emerald-500"
    },
    {
      title: "Focus Time",
      value: "6.5h",
      description: "Daily average focus time",
      icon: Activity,
      trend: 15,
      color: "productivity-high"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            AI Wellness Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your activity patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">🎯 Weekly Goal Achievement</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Great work this week! You've maintained excellent hydration levels and consistent coding sessions. 
              Consider adding more short breaks between long sessions to optimize your productivity.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">🧠 Mental Health Pattern</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your mood patterns show highest energy in the morning. Schedule your most challenging coding tasks 
              between 9-11 AM for optimal performance.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">⚡ Productivity Optimization</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              You're most productive during 25-minute focused sessions. Try implementing the Pomodoro Technique 
              to maximize your coding efficiency.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Tracker Components
const MoodTracker = () => {
  const [mood, setMood] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Mood</CardTitle>
        <CardDescription>How are you feeling today?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {['Excellent', 'Good', 'Neutral', 'Poor'].map((m) => (
            <Button
              key={m}
              variant={mood === m ? 'default' : 'ghost'}
              onClick={() => setMood(m)}
              className={mood === m ? `bg-mood-${m.toLowerCase()}` : ''}
            >
              {m}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const HydrationTracker = () => {
  const [glasses, setGlasses] = useState(0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Hydration</CardTitle>
        <CardDescription>Track your daily water intake</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Glasses today: {glasses}</p>
          <Button onClick={() => setGlasses(glasses + 1)}>Add Glass</Button>
          <Button variant="ghost" onClick={() => setGlasses(0)}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CodingSessionTracker = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let timer;
    if (isTracking) {
      timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Coding Session</CardTitle>
        <CardDescription>Monitor your coding time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Time: {Math.floor(sessionTime / 60)}m {sessionTime % 60}s</p>
          <Button onClick={() => setIsTracking(!isTracking)}>
            {isTracking ? 'Stop' : 'Start'}
          </Button>
          <Button variant="ghost" onClick={() => setSessionTime(0)}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="border-b border-green-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-md">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              DevWell
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4 text-emerald-500" /> : <Moon className="h-4 w-4 text-emerald-500" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-200">
              AI-Powered Wellness for Developers
            </h2>
            <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
              Track your mental health, hydration, and coding sessions with personalized AI insights 
              to maintain peak productivity and well-being.
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="mood">Mental Health</TabsTrigger>
              <TabsTrigger value="hydration">Hydration</TabsTrigger>
              <TabsTrigger value="coding">Coding Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <DashboardStats />
            </TabsContent>
            
            <TabsContent value="mood" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2">
                  <MoodTracker />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Mood Trends</CardTitle>
                    <CardDescription>Your emotional well-being over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Monday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-good"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Tuesday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-excellent"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Wednesday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-excellent"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Thursday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-neutral"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Friday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-good"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="mood" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2">
                  <MoodTracker />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Mood Trends</CardTitle>
                    <CardDescription>Your emotional well-being over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Monday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-good"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Tuesday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-excellent"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Wednesday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-excellent"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Thursday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-neutral"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Friday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-good"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="hydration" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2">
                  <HydrationTracker />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hydration History</CardTitle>
                    <CardDescription>Daily water intake progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="text-sm text-emerald-700 dark:text-emerald-300">{day}</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 8 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-4 rounded-sm ${
                                  i < (8 - index) ? 'bg-hydration-excellent' : 'bg-emerald-100 dark:bg-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="coding" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <CodingSessionTracker />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Analytics</CardTitle>
                    <CardDescription>Your coding patterns and productivity insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Optimal Session Length</span>
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">25 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Average Session</span>
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">32 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Most Productive Hour</span>
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">10:00 AM</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-green-200 dark:border-gray-700">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        You tend to have longer sessions than recommended. Consider taking more frequent breaks to maintain focus.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
