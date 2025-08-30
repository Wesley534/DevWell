import React from 'react';

const MetricCard = ({ title, value, description, change, icon, color }) => {
  const changeColorClass = change.startsWith('+') ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-md font-medium text-gray-500">{title}</h3>
        {/* Replace with actual icon if desired */}
        <span className="text-gray-400 text-lg">ⓘ</span> {/* Info icon */}
      </div>
      <div className="flex items-end justify-between mb-2">
        <div className="flex items-baseline">
          <span className={`text-4xl font-bold ${color} mr-2`}>{value}</span>
          <span className="text-2xl font-semibold text-gray-500">{icon}</span> {/* Dynamic icon */}
        </div>
        <button className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
          {/* Arrow icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className={`${changeColorClass} font-medium`}>{change}</span>
        <span className="text-gray-400">from last week</span>
      </div>
    </div>
  );
};

export default MetricCard;