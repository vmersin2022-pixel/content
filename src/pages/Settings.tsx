import { useState } from "react";
import { motion } from "framer-motion";
import { BentoCard } from "../components/ui/bento-card";
import { ProfileBlock } from "../components/ui/profile-block";
import { Settings2, Link2, Users, Bell, CreditCard, Shield, CheckCircle2, Calendar } from "lucide-react";
import { useContentStore } from "../store/useContentStore";

const TABS = [
  { id: 'general', label: 'Общие', icon: Settings2 },
  { id: 'schedule', label: 'Расписание', icon: Calendar },
  { id: 'integrations', label: 'Интеграции', icon: Link2 },
  { id: 'team', label: 'Команда', icon: Users },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'billing', label: 'Биллинг', icon: CreditCard },
  { id: 'security', label: 'Безопасность', icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, updateSettings } = useContentStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Настройки</h2>
          <p className="text-zinc-500 mt-1">Управляйте параметрами вашего проекта и интеграциями.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Settings Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-64 shrink-0"
        >
          <nav className="flex flex-col gap-1">
            {TABS.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-white text-[var(--color-brand)] shadow-sm border border-zinc-200/60' 
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[var(--color-brand)]' : 'text-zinc-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {activeTab === 'team' ? (
            <ProfileBlock />
          ) : activeTab === 'schedule' ? (
            <BentoCard>
              <h3 className="text-xl font-semibold mb-6 text-zinc-900">Настройки расписания</h3>
              <p className="text-sm text-zinc-500 mb-8">Эти правила используются автопланировщиком для распределения контента.</p>
              
              <div className="space-y-8">
                {Object.entries(settings.channels).map(([platform, config]) => (
                  <div key={platform} className="p-6 border border-zinc-200 rounded-2xl bg-white space-y-4">
                    <h4 className="font-semibold text-lg text-zinc-900 capitalize flex items-center gap-2">
                      {platform}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Постов в день</label>
                        <input 
                          type="number" 
                          min="0"
                          value={config.publishingFrequency}
                          onChange={(e) => updateSettings({
                            channels: {
                              ...settings.channels,
                              [platform]: { ...config, publishingFrequency: parseInt(e.target.value) || 0 }
                            }
                          })}
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Активные окна (через запятую)</label>
                        <input 
                          type="text" 
                          value={config.activeWindows.join(', ')}
                          onChange={(e) => updateSettings({
                            channels: {
                              ...settings.channels,
                              [platform]: { ...config, activeWindows: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                            }
                          })}
                          placeholder="09:00-11:00, 18:00-20:00"
                          className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Формат: ЧЧ:ММ-ЧЧ:ММ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          ) : activeTab === 'general' ? (
            <BentoCard>
              <h3 className="text-xl font-semibold mb-6 text-zinc-900">Общие настройки</h3>
              
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Название проекта</label>
                  <input 
                    type="text" 
                    defaultValue="Content Hub Pro"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Основной домен</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Язык интерфейса</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[var(--color-brand)] transition-shadow">
                    <option>Русский (RU)</option>
                    <option>Английский (EN)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-zinc-100 mt-8">
                  <button className="px-6 py-3 bg-[var(--color-brand)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm">
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </BentoCard>
          ) : activeTab === 'integrations' ? (
            <div className="space-y-6">
              <BentoCard>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900">Социальные сети</h3>
                    <p className="text-sm text-zinc-500 mt-1">Подключите аккаунты для автоматического постинга.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* VK Integration */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0077FF] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        V
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">ВКонтакте</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">Подключено (Content Hub)</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                      Настроить
                    </button>
                  </div>

                  {/* Pinterest Integration */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E60023] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        P
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Pinterest</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">Подключено (DesignInspo)</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                      Настроить
                    </button>
                  </div>

                  {/* Telegram Integration */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#229ED9] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        T
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Telegram</h4>
                        <p className="text-sm text-zinc-500 mt-1">Не подключено</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-[#229ED9] hover:bg-[#229ED9]/90 rounded-lg transition-colors shadow-sm">
                      Подключить
                    </button>
                  </div>
                </div>
              </BentoCard>

              <BentoCard>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900">ИИ и API</h3>
                    <p className="text-sm text-zinc-500 mt-1">Настройки нейросетей и внешних сервисов.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        G
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Google Gemini API</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">Активно</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                      Изменить ключ
                    </button>
                  </div>
                </div>
              </BentoCard>
            </div>
          ) : (
            <BentoCard>
              <h3 className="text-xl font-semibold mb-6 text-zinc-900">{TABS.find(t => t.id === activeTab)?.label}</h3>
              <div className="flex items-center justify-center h-64 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
                Настройки для этого раздела в разработке.
              </div>
            </BentoCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
