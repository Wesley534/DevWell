import { useState, useEffect } from 'react';
import React from 'react';
import { Heart, Code, User, Settings, Moon, Sun } from 'lucide-react';

// Button Component
const Button = ({ variant = 'default', size = 'default', onClick, children, className }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    icon: 'h-10 w-10',
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Card Components
const Card = ({ children, className }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => <div className="p-6">{children}</div>;
const CardTitle = ({ children, className }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}>
    {children}
  </h3>
);
const CardDescription = ({ children }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
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
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);
const TabsTrigger = ({ value, activeTab, setActiveTab, children }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
      activeTab === value ? 'bg-background text-foreground shadow-sm' : ''
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

// Tracker Components
const DashboardStats = () => (
  <div className="grid gap-6 md:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Mood Overview</CardTitle>
        <CardDescription>Your weekly emotional summary</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Good</p>
        <p className="text-sm text-muted-foreground">Based on 5 days of tracking</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Hydration</CardTitle>
        <CardDescription>Weekly water intake</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">85%</p>
        <p className="text-sm text-muted-foreground">Of daily goal achieved</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Coding Sessions</CardTitle>
        <CardDescription>Weekly coding time</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">12h 30m</p>
        <p className="text-sm text-muted-foreground">Across 5 sessions</p>
      </CardContent>
    </Card>
  </div>
);

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
          <p className="text-sm">Glasses today: {glasses}</p>
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
          <p className="text-sm">Time: {Math.floor(sessionTime / 60)}m {sessionTime % 60}s</p>
          <Button onClick={() => setIsTracking(!isTracking)}>
            {isTracking ? 'Stop' : 'Start'}
          </Button>
          <Button variant="ghost" onClick={() => setSessionTime(0)}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-wellness">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
              DevWell
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-3xl font-bold tracking-tight">
              AI-Powered Wellness for Developers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                        <span className="text-sm">Monday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-good"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tuesday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-excellent"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wednesday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-excellent"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Thursday</span>
                        <div className="w-4 h-4 rounded-full bg-mood-neutral"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Friday</span>
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
                          <span className="text-sm">{day}</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 8 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-4 rounded-sm ${
                                  i < (8 - index) ? 'bg-hydration-excellent' : 'bg-muted'
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
                        <span className="text-sm text-muted-foreground">Optimal Session Length</span>
                        <span className="text-sm font-medium">25 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average Session</span>
                        <span className="text-sm font-medium">32 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Most Productive Hour</span>
                        <span className="text-sm font-medium">10:00 AM</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
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