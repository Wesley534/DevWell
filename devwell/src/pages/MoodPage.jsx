import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const MoodPage = () => {
  const [mood, setMood] = useState('');
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {['Excellent', 'Good', 'Neutral', 'Poor'].map((m) => (
                <Button
                  key={m}
                  variant={mood === m ? 'default' : 'ghost'}
                  onClick={() => setMood(m)}
                  // You'll need to define custom colors like bg-mood-excellent in your Tailwind config
                  // For now, removing dynamic class to avoid build issues if not defined.
                  // className={mood === m ? `bg-mood-${m.toLowerCase()}` : ''}
                >
                  {m}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Mood Trends</CardTitle>
          <CardDescription>Your emotional well-being over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Monday</span>
              <div className="w-4 h-4 rounded-full bg-green-400"></div> {/* Placeholder color */}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Tuesday</span>
              <div className="w-4 h-4 rounded-full bg-green-500"></div> {/* Placeholder color */}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Wednesday</span>
              <div className="w-4 h-4 rounded-full bg-green-500"></div> {/* Placeholder color */}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Thursday</span>
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div> {/* Placeholder color */}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Friday</span>
              <div className="w-4 h-4 rounded-full bg-green-400"></div> {/* Placeholder color */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};