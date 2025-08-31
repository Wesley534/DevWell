import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`rounded-lg border border-green-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ${className || ''}`}>
    {children}
  </div>
);
export const CardHeader = ({ children, className }) => <div className={`p-6 ${className || ''}`}>{children}</div>;
export const CardTitle = ({ children, className }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-emerald-800 dark:text-emerald-200 ${className || ''}`}>
    {children}
  </h3>
);
export const CardDescription = ({ children }) => (
  <p className="text-sm text-emerald-700 dark:text-emerald-300">{children}</p>
);
export const CardContent = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>
);