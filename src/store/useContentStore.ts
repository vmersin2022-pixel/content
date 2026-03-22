import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IdeaStatus = 'inbox' | 'research' | 'ready' | 'in_progress' | 'active';

export interface ChannelSettings {
  toneOfVoice: string;
  characterLimit: number;
  seoRules: string;
  ctaTemplates: string[];
  hashtags: string[];
  publishingFrequency: number;
  activeWindows: string[];
  minGapMinutes: number;
  defaultBoard?: string;
}

export interface StrategyRecommendation {
  channel: 'pinterest' | 'vk';
  formats: string[];
  recommendedCount: number;
  recommendedAngles: string[];
  recommendedCTA: string;
  reason: string[];
  confidence: number;
}

export interface ContentPlanItem {
  id: string;
  channel: 'pinterest' | 'vk';
  format: string;
  quantity: number;
  templateId: string;
  angles: string[];
  ctaStyle: string;
  priority: 'high' | 'medium' | 'low';
  recommended: boolean;
}

export interface Recommendation {
  id: string;
  type: 'scale' | 'optimize' | 'gap' | 'schedule' | 'recovery';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  impact: number;
  action: string;
}

export interface Pattern {
  type: 'angle' | 'cta' | 'template';
  value: string;
  score: number;
  confidence: number;
  sampleSize: number;
}

export interface GenerationBias {
  preferredAngles: string[];
  avoidAngles: string[];
  preferredCTA: string;
  preferredTemplates: string[];
  preferredChannels: string[];
  strength: 'low' | 'medium' | 'high';
  autoApply: boolean;
}

export interface AppSettings {
  general: {
    projectName: string;
    domain: string;
    language: string;
  };
  channels: {
    vk: ChannelSettings;
    pinterest: ChannelSettings;
    telegram: ChannelSettings;
  };
  generationBias: GenerationBias;
}

export interface IdeaContentPlan {
  channels: {
    [platform: string]: {
      enabled: boolean;
      contentType: string;
      amount: number;
      template: string;
      tonePreset?: string;
    }
  };
  aiInputs: {
    targetAudience: string;
    funnelStage: string;
    toneOfVoice: string;
    keywords: string;
    forbiddenWords: string;
    ctaStyle: string;
    contentGoal: string;
  };
  blueprint?: any[];
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  tags: string[];
  createdAt: string;
  performanceScore?: number;
  contentPlan?: IdeaContentPlan;
}

export interface ContentPlan {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
}

export interface ContentUnit {
  id: string;
  ideaId?: string;
  planId?: string;
  title: string;
  content: string;
  platform: string;
  status: 'draft' | 'approved' | 'scheduled' | 'published';
  createdAt: string;
  scheduledDate?: string;
  priorityScore?: number;
  schedulingReason?: string;
  
  // Pinterest specific fields
  pinPackId?: string;
  keywords?: string[];
  angle?: string;
  searchIntent?: string;
  cta?: string;
  boardSuggestion?: string;
  visualHook?: string;
  headlineText?: string;
  imageTemplateId?: string;
}

interface ContentState {
  ideas: Idea[];
  contentPlans: ContentPlan[];
  contentUnits: ContentUnit[];
  settings: AppSettings;
  
  // Settings Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateChannelSettings: (channel: keyof AppSettings['channels'], updates: Partial<ChannelSettings>) => void;

  // Idea Actions
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  moveIdea: (id: string, newStatus: IdeaStatus) => void;

  // Plan Actions
  addContentPlan: (plan: Omit<ContentPlan, 'id'>) => void;
  updateContentPlan: (id: string, updates: Partial<ContentPlan>) => void;
  deleteContentPlan: (id: string) => void;

  // Unit Actions
  addContentUnit: (unit: Omit<ContentUnit, 'id' | 'createdAt'>) => void;
  updateContentUnit: (id: string, updates: Partial<ContentUnit>) => void;
  deleteContentUnit: (id: string) => void;

  // Smart Queue Actions
  autoScheduleQueue: () => void;
}

const initialSettings: AppSettings = {
  general: {
    projectName: 'Content Hub Pro',
    domain: 'https://example.com',
    language: 'ru',
  },
  channels: {
    vk: {
      toneOfVoice: 'Дружелюбный, экспертный, с юмором',
      characterLimit: 4000,
      seoRules: 'Использовать ключевые слова в первом абзаце',
      ctaTemplates: ['Пишите в комментарии!', 'Сохраняйте пост, чтобы не потерять'],
      hashtags: ['#маркетинг', '#дизайн'],
      publishingFrequency: 2,
      activeWindows: ['10:00-12:00', '18:00-20:00'],
      minGapMinutes: 180,
    },
    pinterest: {
      toneOfVoice: 'Вдохновляющий, эстетичный, лаконичный',
      characterLimit: 500,
      seoRules: 'Ключевые слова в заголовке и описании, использовать long-tail запросы',
      ctaTemplates: ['Сохрани на доску', 'Переходи по ссылке за подробностями'],
      hashtags: ['#design', '#inspiration'],
      publishingFrequency: 5,
      activeWindows: ['20:00-23:00'],
      minGapMinutes: 60,
      defaultBoard: 'Ideas & Inspiration',
    },
    telegram: {
      toneOfVoice: 'Краткий, по делу, инсайдерский',
      characterLimit: 1000,
      seoRules: 'Не применимо',
      ctaTemplates: ['Подписывайтесь на канал', 'Обсудим в чате?'],
      hashtags: [],
      publishingFrequency: 1,
      activeWindows: ['09:00-11:00'],
      minGapMinutes: 240,
    }
  },
  generationBias: {
    preferredAngles: ["how_to", "tips", "step-by-step guide"],
    avoidAngles: ["generic", "overly promotional"],
    preferredCTA: "soft educational",
    preferredTemplates: ["Minimal SEO", "Warm Expert"],
    preferredChannels: ["pinterest", "vk"],
    strength: 'medium',
    autoApply: true
  }
};

const initialIdeas: Idea[] = [
  {
    id: '1',
    title: 'Как выбрать свечи для дома: гайд',
    description: 'Сборник советов по выбору ароматических свечей, воска, фитилей. Разбор частых ошибок.',
    status: 'inbox',
    tags: ['SEO', 'Pinterest'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    performanceScore: 85,
  },
  {
    id: '2',
    title: 'Тренды дизайна 2026',
    description: 'Обзор новых веяний в UI/UX, типографике и 3D.',
    status: 'research',
    tags: ['Design', 'Blog'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    performanceScore: 92,
  },
  {
    id: '3',
    title: 'Интервью с экспертом: AI в копирайтинге',
    description: 'Вопросы и ответы с ведущим специалистом по нейросетям.',
    status: 'ready',
    tags: ['Interview', 'YouTube'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    performanceScore: 45,
  }
];

const initialPlans: ContentPlan[] = [
  {
    id: '1',
    title: 'Запуск весенней коллекции',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  }
];

const initialUnits: ContentUnit[] = [
  {
    id: '1',
    ideaId: '1',
    planId: '1',
    title: 'Пост в Telegram: Анонс гайда по свечам',
    content: 'Скоро мы выпустим большой гайд по выбору свечей...',
    platform: 'Telegram',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priorityScore: 88,
    schedulingReason: 'Ручное планирование',
  },
  {
    id: '2',
    ideaId: '1',
    title: 'Пин: 5 ошибок при выборе свечей',
    content: 'Инфографика с частыми ошибками. Ссылка на полный гайд.',
    platform: 'Pinterest',
    status: 'draft',
    createdAt: new Date().toISOString(),
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    ideaId: '2',
    title: 'Статья: Тренды дизайна 2026',
    content: 'Развернутая статья про UI/UX тренды с примерами.',
    platform: 'VK',
    status: 'published',
    createdAt: new Date().toISOString(),
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    priorityScore: 95,
  }
];

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      ideas: initialIdeas,
      contentPlans: initialPlans,
      contentUnits: initialUnits,
      settings: initialSettings,

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      updateChannelSettings: (channel, updates) => set((state) => ({
        settings: {
          ...state.settings,
          channels: {
            ...state.settings.channels,
            [channel]: {
              ...state.settings.channels[channel],
              ...updates
            }
          }
        }
      })),

      addIdea: (idea) => set((state) => ({
        ideas: [
          {
            ...idea,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            performanceScore: Math.floor(Math.random() * 40) + 60, // Mock initial score
          },
          ...state.ideas
        ]
      })),

      updateIdea: (id, updates) => set((state) => ({
        ideas: state.ideas.map(idea => idea.id === id ? { ...idea, ...updates } : idea)
      })),

      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter(idea => idea.id !== id)
      })),

      moveIdea: (id, newStatus) => set((state) => ({
        ideas: state.ideas.map(idea => idea.id === id ? { ...idea, status: newStatus } : idea)
      })),

      addContentPlan: (plan) => set((state) => ({
        contentPlans: [
          {
            ...plan,
            id: Math.random().toString(36).substring(2, 9),
          },
          ...state.contentPlans
        ]
      })),

      updateContentPlan: (id, updates) => set((state) => ({
        contentPlans: state.contentPlans.map(plan => plan.id === id ? { ...plan, ...updates } : plan)
      })),

      deleteContentPlan: (id) => set((state) => ({
        contentPlans: state.contentPlans.filter(plan => plan.id !== id)
      })),

      addContentUnit: (unit) => set((state) => ({
        contentUnits: [
          {
            ...unit,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
          },
          ...state.contentUnits
        ]
      })),

      updateContentUnit: (id, updates) => set((state) => ({
        contentUnits: state.contentUnits.map(unit => unit.id === id ? { ...unit, ...updates } : unit)
      })),

      deleteContentUnit: (id) => set((state) => ({
        contentUnits: state.contentUnits.filter(unit => unit.id !== id)
      })),

      autoScheduleQueue: () => set((state) => {
        const { contentUnits, ideas, settings } = state;
        
        // 1. Get all draft units
        const pendingUnits = contentUnits.filter(u => u.status === 'approved');
        if (pendingUnits.length === 0) return state;

        // 2. Calculate priority scores and sort
        const unitsWithScores = pendingUnits.map(unit => {
          let priorityScore = unit.priorityScore;
          let schedulingReason = unit.schedulingReason;
          
          if (priorityScore === undefined) {
            const idea = ideas.find(i => i.id === unit.ideaId);
            const ideaPerformance = idea?.performanceScore || 50;
            // Freshness: 100 if created today, decreases over 30 days
            const daysOld = idea ? (Date.now() - new Date(idea.createdAt).getTime()) / (1000 * 60 * 60 * 24) : 0;
            const freshness = Math.max(0, 100 - (daysOld * 3.33));
            
            priorityScore = Math.round((ideaPerformance * 0.5) + (freshness * 0.3) + 20); // 20 is base manual priority
            
            if (ideaPerformance >= 80) schedulingReason = '🔥 High priority (Top performing idea)';
            else if (freshness >= 80) schedulingReason = '🆕 Fresh content';
            else schedulingReason = '⚡ Standard priority';
          }
          return { ...unit, priorityScore, schedulingReason };
        }).sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

        // 3. Group by platform
        const unitsByPlatform: Record<string, ContentUnit[]> = {};
        unitsWithScores.forEach(u => {
          const platform = u.platform.toLowerCase();
          if (!unitsByPlatform[platform]) unitsByPlatform[platform] = [];
          unitsByPlatform[platform].push(u);
        });

        const updatedUnits = [...contentUnits];

        // 4. Assign slots per platform
        Object.keys(unitsByPlatform).forEach(platform => {
          const channelSettings = settings.channels[platform as keyof AppSettings['channels']];
          if (!channelSettings) return;

          let units = unitsByPlatform[platform];
          const postsPerDay = channelSettings.publishingFrequency;
          const activeWindows = channelSettings.activeWindows;
          
          if (postsPerDay <= 0) return; // Prevent infinite loop if frequency is 0

          let currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + 1); // Start scheduling from tomorrow
          currentDate.setHours(0, 0, 0, 0);

          let lastIdeaId: string | null = null;
          let lastAngle: string | null = null;

          while (units.length > 0) {
            // Generate slots for currentDate
            const slotsForDay: Date[] = [];
            activeWindows.forEach(window => {
              const [start] = window.split('-');
              if (start) {
                const [hours, minutes] = start.split(':').map(Number);
                const slotTime = new Date(currentDate);
                slotTime.setHours(hours, minutes, 0, 0);
                slotsForDay.push(slotTime);
              }
            });

            // Fallback if no active windows
            if (slotsForDay.length === 0) {
              const slotTime = new Date(currentDate);
              slotTime.setHours(12, 0, 0, 0);
              slotsForDay.push(slotTime);
            }

            // Filter out slots that are already taken by other units on this platform
            const availableSlots = slotsForDay.filter(slot => {
              return !updatedUnits.some(u => 
                u.platform.toLowerCase() === platform && 
                u.status === 'scheduled' && 
                u.scheduledDate && 
                new Date(u.scheduledDate).getTime() === slot.getTime()
              );
            });

            let scheduledToday = 0;
            
            for (let i = 0; i < availableSlots.length && scheduledToday < postsPerDay && units.length > 0; i++) {
              const slot = availableSlots[i];
              
              // Diversity Engine: Prevent repetitive content
              let unitIndex = -1;
              
              // 1. Try to find a unit with a different idea AND different angle
              if (lastIdeaId && lastAngle) {
                unitIndex = units.findIndex(u => u.ideaId !== lastIdeaId && u.angle !== lastAngle);
              }
              
              // 2. Fallback: Try to find a unit with just a different idea
              if (unitIndex === -1 && lastIdeaId) {
                unitIndex = units.findIndex(u => u.ideaId !== lastIdeaId);
              }
              
              // 3. Fallback: Try to find a unit with just a different angle
              if (unitIndex === -1 && lastAngle) {
                unitIndex = units.findIndex(u => u.angle !== lastAngle);
              }
              
              // 4. Final fallback: Just take the highest priority unit (first in array)
              if (unitIndex === -1) {
                unitIndex = 0;
              }
              
              const unit = units[unitIndex];
              
              const index = updatedUnits.findIndex(u => u.id === unit.id);
              if (index !== -1) {
                updatedUnits[index] = {
                  ...updatedUnits[index],
                  status: 'scheduled',
                  scheduledDate: slot.toISOString(),
                  priorityScore: unit.priorityScore,
                  schedulingReason: unit.schedulingReason ? `${unit.schedulingReason} (Diversity Engine optimized)` : 'Diversity Engine optimized'
                };
              }
              
              lastIdeaId = unit.ideaId || null;
              lastAngle = unit.angle || null;
              units.splice(unitIndex, 1); // Remove from pending
              scheduledToday++;
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        return { contentUnits: updatedUnits };
      }),
    }),
    {
      name: 'content-hub-storage',
    }
  )
);
