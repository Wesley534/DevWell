import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { TrendingUp } from 'lucide-react';

export const StatCard = ({ title, value, description, icon: Icon, trend, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-emerald-500`} /> {/* Removed dynamic color class here to prevent purgecss issues, you can re-add it carefully if you manage dynamic class generation */}
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