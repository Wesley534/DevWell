import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Heart, User, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';

export const MainLayout = () => {
  const [isDark, setIsDark] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State for profile dropdown
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsProfileMenuOpen(false);
    navigate('/login');
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
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Profile menu"
              >
                <User className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
              </Button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
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

          <Tabs className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger to="/dashboard">Dashboard</TabsTrigger>
              <TabsTrigger to="/mood">Mental Health</TabsTrigger>
              <TabsTrigger to="/hydration">Hydration</TabsTrigger>
              <TabsTrigger to="/coding">Coding Sessions</TabsTrigger>
            </TabsList>

            {/* The content of the selected tab will be rendered here by Outlet */}
            <div className="py-4">
              <Outlet />
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};