import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, description, icon: Icon, trend, color }) => {
  // Map color to static Tailwind classes to avoid PurgeCSS issues
  const colorClasses = {
    'mood-excellent': 'border-emerald-500',
    'hydration-excellent': 'border-blue-500',
    'emerald-500': 'border-emerald-500',
    'productivity-high': 'border-purple-500',
  };
  const borderClass = colorClasses[color] || 'border-emerald-500'; // Fallback

  return (
    <Card className={`border-2 ${borderClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-emerald-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
          {value}
        </div>
        <CardDescription className="text-xs text-emerald-700 dark:text-emerald-300">
          {description}
        </CardDescription>
        {trend !== undefined && (
          <div className="flex items-center mt-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;