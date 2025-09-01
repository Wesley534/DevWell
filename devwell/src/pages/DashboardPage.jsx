import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { TrendingUp, Activity, Droplets, Brain, Sparkles, Code } from 'lucide-react';

export const DashboardPage = () => {
  const stats = [
    {
      title: "Avg. Mood Score",
      value: "4.2/5",
      description: "Excellent mental health this week",
      icon: Brain,
      trend: 12,
      color: "mood-excellent",
    },
    {
      title: "Hydration Goal",
      value: "87%",
      description: "7 out of 8 glasses daily",
      icon: Droplets,
      trend: 8,
      color: "hydration-excellent",
    },
    {
      title: "Coding Sessions",
      value: "23",
      description: "Total sessions this week",
      icon: Code,
      trend: -5,
      color: "session-active",
    },
    {
      title: "Focus Time",
      value: "6.5h",
      description: "Daily average focus time",
      icon: Activity,
      trend: 15,
      color: "productivity-high",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <Card className="relative overflow-hidden glow-quad animate-gradient-fast">
        <div className="absolute inset-0 bg-gradient-to-r from-wellness-primary/10 to-wellness-mauve/10 dark:from-wellness-primary/20 dark:to-wellness-mauve/20 animate-gradient" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-wellness-accent pulse-glow-peach" />
            AI Wellness Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your activity patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-wellness-mauve/10 dark:bg-wellness-mauve/20 border border-wellness-mauve/50 dark:border-wellness-mauve/30 hover-glow-mauve shimmer">
            <h4 className="font-medium bg-gradient-mauve-peach bg-clip-text text-transparent mb-2">🎯 Weekly Goal Achievement</h4>
            <p className="text-sm text-muted-foreground">
              Great work this week! You've maintained excellent hydration levels and consistent coding sessions. 
              Consider adding more short breaks between long sessions to optimize your productivity.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-wellness-mauve/10 dark:bg-wellness-mauve/20 border border-wellness-mauve/50 dark:border-wellness-mauve/30 hover-glow-mauve shimmer">
            <h4 className="font-medium bg-gradient-mauve-emerald bg-clip-text text-transparent mb-2">🧠 Mental Health Pattern</h4>
            <p className="text-sm text-muted-foreground">
              Your mood patterns show highest energy in the morning. Schedule your most challenging coding tasks 
              between 9-11 AM for optimal performance.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-wellness-mauve/10 dark:bg-wellness-mauve/20 border border-wellness-mauve/50 dark:border-wellness-mauve/30 hover-glow-mauve shimmer">
            <h4 className="font-medium bg-gradient-clay-emerald bg-clip-text text-transparent mb-2">⚡ Productivity Optimization</h4>
            <p className="text-sm text-muted-foreground">
              You're most productive during 25-minute focused sessions. Try implementing the Pomodoro Technique 
              to maximize your coding efficiency.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};