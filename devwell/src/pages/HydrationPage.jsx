import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const HydrationPage = () => {
  const [glasses, setGlasses] = useState(0);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Hydration</CardTitle>
            <CardDescription>Track your daily water intake</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Glasses today: {glasses}</p>
              <Button onClick={() => setGlasses(glasses + 1)}>Add Glass</Button>
              <Button variant="ghost" onClick={() => setGlasses(0)}>Reset</Button>
            </div>
          </CardContent>
        </Card>
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
                <span className="text-sm text-emerald-700 dark:text-emerald-300">{day}</span>
                <div className="flex gap-1">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-4 rounded-sm ${
                        i < (8 - index) ? 'bg-blue-400' : 'bg-emerald-100 dark:bg-gray-700' // Placeholder color
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
  );
};