import React from 'react';
import MetricCard from './MetricCard';
import InsightCard from './InsightCard';

function App() {
  // Dummy data for demonstration
  const metrics = [
    {
      title: 'Avg. Mood Score',
      value: '4.2/5',
      description: 'of excellent mental health this week',
      change: '+12% from last week',
      icon: '😊', // You can replace with an actual icon component
      color: 'text-blue-600',
    },
    {
      title: 'Hydration Goal',
      value: '87%',
      description: 'of 8 glasses daily',
      change: '+5% from last week',
      icon: '💧', // You can replace with an actual icon component
      color: 'text-green-600',
    },
    {
      title: 'Coding Sessions',
      value: '23',
      description: 'total sessions this week',
      change: '-5% from last week',
      icon: '💻', // You can replace with an actual icon component
      color: 'text-purple-600',
    },
    {
      title: 'Focus Time',
      value: '6.5H',
      description: 'daily average focus time',
      change: '+15% from last week',
      icon: '⏰', // You can replace with an actual icon component
      color: 'text-red-600',
    },
  ];

  const insights = [
    {
      title: 'Weekly Goal Achievement',
      description: 'Great work this week! You\'ve maintained excellent hydration levels and consistent coding sessions. Consider adding more short breaks between long sessions to optimize your productivity.',
      icon: '✅', // Placeholder
      type: 'success',
    },
    {
      title: 'Mental Health Pattern',
      description: 'Your mood patterns show highest energy in the morning. Schedule your most challenging coding tasks between 9-11 AM for optimal performance.',
      icon: '🧠', // Placeholder
      type: 'info',
    },
    {
      title: 'Productivity Optimization',
      description: 'You\'re most productive when listening to lo-fi music. Explore new playlists to maintain focus during extended coding periods.',
      icon: '📈', // Placeholder
      type: 'warning', // Or a different type as needed
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold mr-2">D</div>
          <span className="text-xl font-semibold text-gray-800">DevWell</span>
        </div>
        <nav className="flex items-center space-x-4 text-gray-600">
          {/* You might replace these with actual icons */}
          <button className="p-2 hover:bg-gray-100 rounded">🔍</button>
          <button className="p-2 hover:bg-gray-100 rounded">🔔</button>
          <button className="p-2 hover:bg-gray-100 rounded">⚙️</button>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">J</div> {/* User Avatar */}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          AI-Powered Wellness for Developers
        </h1>
        <p className="text-gray-600 mb-8">
          Track your mental health, hydration, and coding sessions with personalized AI insights to maintain peak productivity and well-being.
        </p>

        {/* Tabs - You'll need state for active tab */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button className="whitespace-nowrap py-3 px-1 border-b-2 border-blue-600 font-medium text-sm text-blue-600">Dashboard</button>
            <button className="whitespace-nowrap py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Mental Health</button>
            <button className="whitespace-nowrap py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Hydration</button>
            <button className="whitespace-nowrap py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Coding Sessions</button>
          </nav>
        </div>

        {/* Metric Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* AI Wellness Insights Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center text-gray-700 mb-4">
            <span className="text-xl mr-2">🤖</span>
            <h2 className="text-xl font-semibold">AI Wellness Insights</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Personalized recommendations based on your activity patterns
          </p>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;