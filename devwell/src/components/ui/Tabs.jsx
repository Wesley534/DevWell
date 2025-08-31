import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Note: For multi-page tabs, we'll use React Router's `useLocation`
// instead of `useState` for `activeTab` in the main Tabs component.

export const Tabs = ({ defaultValue, className, children }) => {
  // activeTab will be managed by the router now, so no internal state here for the main tabs.
  // This component will primarily just render the TabsList and its triggers.
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const TabsList = ({ className, children }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-emerald-100 dark:bg-gray-700 p-1 text-emerald-700 dark:text-emerald-300 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
        isActive ? 'bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200 shadow-sm' : 'text-emerald-700 dark:text-emerald-300'
      }`}
    >
      {children}
    </Link>
  );
};

// TabsContent will now be rendered directly by React Router for each page.
// We'll keep a version of it here if you need nested tabs within a page,
// but for top-level navigation, the router handles it.
export const TabsContent = ({ value, activeTab, children, className }) => (
  <div className={`${className} ${activeTab === value ? 'block' : 'hidden'}`}>
    {children}
  </div>
);