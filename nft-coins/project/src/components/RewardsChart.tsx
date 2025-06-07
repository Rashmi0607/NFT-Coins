import React from 'react';

export function RewardsChart() {
  // Mock data for visualization
  const data = [
    { day: 'Mon', rewards: 0.5 },
    { day: 'Tue', rewards: 1.2 },
    { day: 'Wed', rewards: 0.8 },
    { day: 'Thu', rewards: 2.1 },
    { day: 'Fri', rewards: 1.7 },
    { day: 'Sat', rewards: 2.5 },
    { day: 'Sun', rewards: 3.2 },
  ];

  const maxReward = Math.max(...data.map(d => d.rewards));

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-full max-w-8 relative">
              <div
                className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-300"
                style={{
                  height: `${(item.rewards / maxReward) * 100}%`,
                  minHeight: '4px'
                }}
              />
            </div>
            <span className="text-xs text-gray-400">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-400">
        Daily rewards earned over the past week
      </div>
    </div>
  );
}