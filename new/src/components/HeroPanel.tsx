import React from 'react';

interface HeroPanelProps {
  city: string;
  temperature: number;
  severity: 'red' | 'orange' | 'yellow' | 'none';
  message?: string;
}

const HeroPanel: React.FC<HeroPanelProps> = ({ city, temperature, severity, message }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'red':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'orange':
        return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'yellow':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">{city}</h2>
          <p className="text-4xl font-bold mt-2">{temperature}°C</p>
        </div>
        {severity !== 'none' && (
          <div className={`px-4 py-2 rounded-lg border ${getSeverityColor(severity)}`}>
            <p className="font-semibold">
              {severity === 'red' ? 'Severe Alert' :
               severity === 'orange' ? 'Warning' :
               'Advisory'}
            </p>
          </div>
        )}
      </div>
      {message && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
};

export default HeroPanel; 