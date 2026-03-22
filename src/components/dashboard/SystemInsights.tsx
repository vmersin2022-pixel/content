import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Target, RefreshCw } from 'lucide-react';
import { Recommendation } from '../../store/useContentStore';

interface SystemInsightsProps {
  recommendations: Recommendation[];
}

export default function SystemInsights({ recommendations }: SystemInsightsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">System Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{rec.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.confidence > 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {Math.round(rec.confidence)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
            </div>
            <button className="w-full text-sm bg-indigo-50 text-indigo-700 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
              {rec.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
