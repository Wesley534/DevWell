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
  TrendingUp,
  Activity,
  Droplets,
  Brain,
  Sparkles,
  Code,
  Sun,
  Moon,
} from "lucide-react"; // Import icons

export const Dashboard = () => {
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
      color: "emerald-500",
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

  // 🌙☀️ Theme toggle state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load saved theme or match system preference
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
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

  return (
    // Add default background and text colors to the parent div
    <div className="space-y-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 min-h-screen">
      {/* Theme Toggle Button at top */}
      <div className="flex justify-end p-4"> {/* Added padding for better spacing */}
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4"> {/* Added horizontal padding */}
        {stats.map((stat, index) => (
          // Assuming StatCard itself handles dark mode for its internal elements
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* AI Insights Card */}
      <Card className="mx-4"> {/* Added horizontal margin for the card */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            AI Wellness Insights
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400"> {/* Added dark text for description */}
            Personalized recommendations based on your activity patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
              🎯 Weekly Goal Achievement
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Great work this week! You've maintained excellent hydration levels
              and consistent coding sessions. Consider adding more short breaks
              between long sessions to optimize your productivity.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
              🧠 Mental Health Pattern
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your mood patterns show highest energy in the morning. Schedule
              your most challenging coding tasks between 9-11 AM for optimal
              performance.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-800 border border-green-200 dark:border-gray-700">
            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
              ⚡ Productivity Optimization
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              You're most productive during 25-minute focused sessions. Try
              implementing the Pomodoro Technique to maximize your coding
              efficiency.
            </p>
          
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;