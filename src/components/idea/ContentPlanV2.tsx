import React from 'react';
import { Idea } from '../../store/useContentStore';
import { Settings, Sparkles, LayoutTemplate, Zap, RefreshCw, Send, Check } from 'lucide-react';

interface ContentPlanV2Props {
  idea: Idea;
}

export default function ContentPlanV2({ idea }: ContentPlanV2Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Control */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Idea Context</h2>
          <div className="space-y-2">
            <p className="font-bold">{idea.title}</p>
            <p className="text-sm text-gray-600">{idea.description}</p>
            <div className="flex gap-2">
              {idea.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>)}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Strategy Recommendations</h2>
          <p className="text-sm text-gray-500">No recommendations yet.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Plan Builder</h2>
          <p className="text-sm text-gray-500">Blueprint is empty.</p>
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Optimization Signals</h2>
          <p className="text-sm text-gray-500">No signals yet.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Output Preview</h2>
          <p className="text-sm text-gray-500">No previews yet.</p>
        </div>
      </div>
    </div>
  );
}
