import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentStore, Idea } from '../store/useContentStore';
import { ArrowLeft, Lightbulb, Settings, LayoutTemplate, Sparkles, Check, Play, FileText, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import ContentPlanV2 from '../components/idea/ContentPlanV2';
import GeneratedUnitsTab from '../components/idea/GeneratedUnitsTab';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ideas, updateIdea } = useContentStore();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content-plan' | 'generated-units' | 'analytics'>('content-plan');

  useEffect(() => {
    if (id) {
      const foundIdea = ideas.find(i => i.id === id);
      if (foundIdea) {
        setIdea(foundIdea);
      } else {
        toast.error('Идея не найдена');
        navigate('/ideas');
      }
    }
  }, [id, ideas, navigate]);

  if (!idea) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'content-plan', label: 'Content Plan', icon: LayoutTemplate },
    { id: 'generated-units', label: 'Generated Units', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/ideas')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Назад к идеям
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
            </div>
            <p className="text-gray-600 max-w-3xl">{idea.description}</p>
            
            <div className="flex items-center space-x-4 mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {idea.status}
              </span>
              <div className="flex space-x-2">
                {idea.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              <Play className="w-4 h-4 mr-2" />
              Запустить в работу
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`
                  w-5 h-5 mr-2
                  ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600">Здесь будет общая информация, заметки и связанные исследования.</p>
          </div>
        )}
        
        {activeTab === 'content-plan' && (
          <ContentPlanV2 idea={idea} />
        )}
        
        {activeTab === 'generated-units' && (
          <GeneratedUnitsTab idea={idea} />
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Здесь будет аналитика по этой идее.</p>
          </div>
        )}
      </div>
    </div>
  );
}
