import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const CodingPage = () => {
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
    <div className="grid gap-6 md:grid-cols-2">
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
  );
};