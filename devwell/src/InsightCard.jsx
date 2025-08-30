import React from 'react';

const InsightCard = ({ title, description, icon, type }) => {
  const bgColorClass = {
    success: 'bg-green-50',
    info: 'bg-blue-50',
    warning: 'bg-yellow-50',
  }[type] || 'bg-gray-50'; // Default background

  const textColorClass = {
    success: 'text-green-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  }[type] || 'text-gray-800'; // Default text color

  const iconBgColorClass = {
    success: 'bg-green-200',
    info: 'bg-blue-200',
    warning: 'bg-yellow-200',
  }[type] || 'bg-gray-200'; // Default icon background

  return (
    <div className={`flex items-start p-4 rounded-lg ${bgColorClass}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${iconBgColorClass}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <h3 className={`font-semibold text-md mb-1 ${textColorClass}`}>{title}</h3>
        <p className={`text-sm ${textColorClass}`}>{description}</p>
      </div>
    </div>
  );
};

export default InsightCard;