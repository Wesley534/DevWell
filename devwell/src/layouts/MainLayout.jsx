import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Heart, User, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export const MainLayout = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/mood', label: 'Mental Health' },
    { path: '/hydration', label: 'Hydration' },
    { path: '/coding', label: 'Coding Sessions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-emerald-200/30 dark:border-blue-800/30 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg supports-[backdrop-filter]:bg-white/10 dark:supports-[backdrop-filter]:bg-gray-900/10 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              DevWell
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-blue-900/50 hover:shadow-sm hover:shadow-emerald-500/20'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-emerald-100/50 dark:hover:bg-blue-900/50 hover:shadow-sm hover:shadow-emerald-500/20"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-emerald-500" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-emerald-100/50 dark:hover:bg-blue-900/50 hover:shadow-sm hover:shadow-emerald-500/20"
            >
              <Settings className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />

            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="hover:bg-emerald-100/50 dark:hover:bg-blue-900/50 hover:shadow-sm hover:shadow-emerald-500/20"
                aria-label="Profile menu"
              >
                <User className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              </Button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-emerald-200/50 dark:border-blue-700/50 rounded-xl shadow-xl shadow-emerald-500/10 dark:shadow-blue-900/10 z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-100/50 dark:hover:bg-blue-900/50 transition-all duration-200 rounded-xl"
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

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
};