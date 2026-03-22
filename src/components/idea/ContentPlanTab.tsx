import React, { useState } from 'react';
import { Idea, useContentStore } from '../../store/useContentStore';
import { Settings, Check, Play, FileText, BarChart2, Zap, RefreshCw, Send, LayoutTemplate, Sparkles, Image as ImageIcon, MessageSquare, Hash, Layers, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface ContentPlanTabProps {
  idea: Idea;
}

export default function ContentPlanTab({ idea }: ContentPlanTabProps) {
  const { updateIdea, settings } = useContentStore();
  const [isGenerating, setIsGenerating] = useState(false);

  type ChannelConfig = {
    enabled: boolean;
    contentType: string;
    amount: number;
    template: string;
    tonePreset: string;
  };

  const [channels, setChannels] = useState<Record<string, ChannelConfig>>({
    pinterest: { enabled: true, contentType: 'SEO Pins', amount: 5, template: 'Minimal SEO', tonePreset: 'Inspirational' },
    vk: { enabled: true, contentType: 'Post', amount: 1, template: 'Warm Expert', tonePreset: 'Expert' },
    telegram: { enabled: false, contentType: 'Short Post', amount: 1, template: 'Insider', tonePreset: 'Direct' }
  });

  const [aiInputs, setAiInputs] = useState({
    targetAudience: 'Женщины 25-45, интересующиеся уютом',
    funnelStage: 'Warm',
    toneOfVoice: 'Вдохновляющий, экспертный',
    keywords: 'свечи для дома, уютный декор, ароматические свечи',
    forbiddenWords: 'дешево, скидка, распродажа',
    ctaStyle: 'Soft engagement',
    contentGoal: 'Saves & Traffic'
  });

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const handleGenerateContent = async () => {
    if (!idea.contentPlan?.blueprint) return;
    
    setIsGeneratingContent(true);
    toast.info('Генерация контента...');
    
    try {
      const { generatePinPack, generateVkPost } = await import('../../services/ai');
      const { addContentUnit } = useContentStore.getState();
      
      for (const item of idea.contentPlan.blueprint) {
        if (item.channel === 'pinterest') {
          const pins = await generatePinPack(
            { title: idea.title, description: idea.description },
            idea.contentPlan.aiInputs,
            settings.channels.pinterest,
            item.quantity,
            settings.generationBias
          );
          
          const pinPackId = Math.random().toString(36).substring(2, 9);
          
          pins.forEach(pin => {
            addContentUnit({
              ideaId: idea.id,
              title: pin.title,
              content: pin.description,
              platform: 'Pinterest',
              status: 'draft',
              pinPackId,
              keywords: pin.keywords,
              angle: pin.angle,
              searchIntent: pin.search_intent,
              cta: pin.cta,
              visualHook: pin.visual_hook,
              boardSuggestion: pin.board_suggestion
            });
          });
        } else if (item.channel === 'vk') {
          for (const preview of item.previews) {
            const post = await generateVkPost(
              { title: idea.title, description: idea.description },
              idea.contentPlan.aiInputs,
              settings.channels.vk,
              preview,
              settings.generationBias
            );
            
            addContentUnit({
              ideaId: idea.id,
              title: preview.title,
              content: post.content,
              platform: 'VK',
              status: 'draft',
              angle: preview.angle
            });
          }
        }
      }
      
      toast.success('Контент успешно сгенерирован!');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при генерации контента');
    } finally {
      setIsGeneratingContent(false);
    }
  };
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    toast.info('Генерация плана...');
    
    try {
      const { generateContentPlanBlueprint } = await import('../../services/ai');
      const blueprint = await generateContentPlanBlueprint(
        { title: idea.title, description: idea.description },
        channels,
        aiInputs,
        settings.generationBias
      );

      updateIdea(idea.id, {
        contentPlan: {
          channels,
          aiInputs,
          blueprint
        }
      });
      
      toast.success('План успешно сгенерирован');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при генерации плана');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Strategy & Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        
        {/* System Insights */}
        {settings.generationBias && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-indigo-900 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-indigo-600" />
                System Insights
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start">
                <span className="text-lg mr-3">🔥</span>
                <div>
                  <p className="text-sm text-indigo-900 font-medium">Analytics-Driven Optimization</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Based on recent performance, the system recommends focusing on <strong>{settings.generationBias.preferredAngles[0]}</strong> angles.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-lg mr-3">⚠️</span>
                <div>
                  <p className="text-sm text-indigo-900 font-medium">Avoid Underperforming Angles</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Content using <strong>{settings.generationBias.avoidAngles[0]}</strong> angles has shown lower engagement.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-lg mr-3">🎯</span>
                <div>
                  <p className="text-sm text-indigo-900 font-medium">Recommended CTA</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Use <strong>{settings.generationBias.bestCTA}</strong> for higher conversion rates.
                  </p>
                </div>
              </div>
            </div>
            {idea.performanceScore && idea.performanceScore > 70 && (
              <div className="px-5 py-3 bg-indigo-100/50 border-t border-indigo-100 flex justify-between items-center">
                <span className="text-xs text-indigo-800 font-medium">High performance detected!</span>
                <button 
                  onClick={() => {
                    setChannels(prev => ({
                      ...prev,
                      pinterest: { ...prev.pinterest, amount: prev.pinterest.amount + 3 },
                      vk: { ...prev.vk, amount: prev.vk.amount + 1 },
                      telegram: { ...prev.telegram, enabled: true, amount: 2 }
                    }));
                    toast.success('Scaling strategy applied! Amounts increased and Telegram enabled.');
                  }}
                  className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                  Apply Scaling Strategy
                </button>
              </div>
            )}
          </div>
        )}

        {/* Channel Strategy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Layers className="w-4 h-4 mr-2 text-indigo-500" />
              Channel Strategy
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {Object.entries(channels).map(([platform, configValue]) => {
              const config = configValue as ChannelConfig;
              return (
              <div key={platform} className={`p-4 rounded-lg border ${config.enabled ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => setChannels({...channels, [platform]: {...config, enabled: e.target.checked}})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-900 capitalize">
                      {platform}
                    </label>
                  </div>
                  {config.enabled && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      {config.amount} {config.amount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                
                {config.enabled && (
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Format</label>
                        <select 
                          value={config.contentType}
                          onChange={(e) => setChannels({...channels, [platform]: {...config, contentType: e.target.value}})}
                          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option>SEO Pins</option>
                          <option>Idea Pins</option>
                          <option>Post</option>
                          <option>Short Post</option>
                          <option>Article</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={config.amount}
                          onChange={(e) => setChannels({...channels, [platform]: {...config, amount: parseInt(e.target.value)}})}
                          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Template</label>
                      <select 
                        value={config.template}
                        onChange={(e) => setChannels({...channels, [platform]: {...config, template: e.target.value}})}
                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option>Minimal SEO</option>
                        <option>Warm Expert</option>
                        <option>Insider</option>
                        <option>Product Showcase</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>

        {/* AI Generation Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
              AI Generation Controls
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Target Audience</label>
              <input 
                type="text" 
                value={aiInputs.targetAudience}
                onChange={(e) => setAiInputs({...aiInputs, targetAudience: e.target.value})}
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Funnel Stage</label>
                <select 
                  value={aiInputs.funnelStage}
                  onChange={(e) => setAiInputs({...aiInputs, funnelStage: e.target.value})}
                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Cold (Awareness)</option>
                  <option>Warm (Consideration)</option>
                  <option>Hot (Conversion)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Content Goal</label>
                <select 
                  value={aiInputs.contentGoal}
                  onChange={(e) => setAiInputs({...aiInputs, contentGoal: e.target.value})}
                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Traffic</option>
                  <option>Saves / Bookmarks</option>
                  <option>Education</option>
                  <option>Engagement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <Hash className="w-3 h-3 mr-1" /> Keywords
              </label>
              <textarea 
                rows={2}
                value={aiInputs.keywords}
                onChange={(e) => setAiInputs({...aiInputs, keywords: e.target.value})}
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tone of Voice</label>
              <input 
                type="text" 
                value={aiInputs.toneOfVoice}
                onChange={(e) => setAiInputs({...aiInputs, toneOfVoice: e.target.value})}
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">CTA Style</label>
              <select 
                value={aiInputs.ctaStyle}
                onChange={(e) => setAiInputs({...aiInputs, ctaStyle: e.target.value})}
                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Soft engagement</option>
                <option>Direct link click</option>
                <option>Question to audience</option>
                <option>Save for later</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Blueprint & Previews */}
      <div className="w-full lg:w-2/3 space-y-6">
        
        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex space-x-3">
            <button 
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate Plan
            </button>
            
            {idea.contentPlan?.blueprint && (
              <>
                <button 
                  onClick={handleGenerateContent}
                  disabled={isGeneratingContent}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {isGeneratingContent ? (
                    <RefreshCw className="w-4 h-4 mr-2 text-indigo-500 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                  )}
                  Generate Content
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Approve All
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Send className="w-4 h-4 mr-2 text-blue-500" />
                  Send to Queue
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Blueprint */}
        {idea.contentPlan?.blueprint ? (
          <div className="space-y-6">
            {idea.contentPlan.blueprint.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${item.channel === 'pinterest' ? 'bg-red-100 text-red-800' : 
                        item.channel === 'vk' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {item.channel}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.quantity} {item.format}
                    </h3>
                    <span className="text-xs text-gray-500 border-l border-gray-300 pl-3">
                      Template: {item.template}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-indigo-600">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Preview of Planned Output</h4>
                  <div className="space-y-3">
                    {item.previews.map((preview: any, pIdx: number) => (
                      <div key={pIdx} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-indigo-200 transition-colors">
                        <div className="flex-shrink-0 mt-0.5">
                          {item.channel === 'pinterest' ? (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{preview.title}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-800">
                              Angle: {preview.angle}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                          <button className="text-xs text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Regenerate</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-12 text-center">
            <LayoutTemplate className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Content Plan Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure your strategy on the left and click "Generate Plan" to create a blueprint.
            </p>
            <div className="mt-6">
              <button
                onClick={handleGeneratePlan}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
