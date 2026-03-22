import { useState } from "react";
import { motion } from "framer-motion";
import { useContentStore, ContentUnit } from "../store/useContentStore";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2, Wand2, Sparkles } from "lucide-react";
import { Modal } from "../components/ui/modal";
import { Button } from "../components/ui/button";
import { generatePostContent, improveText } from "../services/ai";

export default function ContentPlan() {
  const { contentUnits, addContentUnit, updateContentUnit, deleteContentUnit, settings } = useContentStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ContentUnit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ContentUnit>>({
    title: '',
    content: '',
    platform: 'Telegram',
    status: 'draft',
    scheduledDate: new Date().toISOString(),
  });

  // Generate week days
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const today = () => setCurrentDate(new Date());

  const handleOpenModal = (date?: Date, unit?: ContentUnit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData(unit);
    } else {
      setEditingUnit(null);
      const scheduledDate = date || new Date();
      // Set default time to 12:00
      scheduledDate.setHours(12, 0, 0, 0);
      setFormData({
        title: '',
        content: '',
        platform: 'Telegram',
        status: 'draft',
        scheduledDate: scheduledDate.toISOString(),
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.scheduledDate) return;

    if (editingUnit) {
      updateContentUnit(editingUnit.id, formData);
    } else {
      addContentUnit(formData as Omit<ContentUnit, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingUnit) {
      deleteContentUnit(editingUnit.id);
      setIsModalOpen(false);
    }
  };

  const getPlatformSettings = (platform: string) => {
    const key = platform.toLowerCase() as keyof typeof settings.channels;
    return settings.channels[key];
  };

  const handleGenerateContent = async () => {
    if (!formData.title || !formData.platform) return;
    setIsGenerating(true);
    try {
      const platformSettings = getPlatformSettings(formData.platform);
      const content = await generatePostContent(formData.title, formData.platform, platformSettings);
      setFormData(prev => ({ ...prev, content }));
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveText = async () => {
    if (!formData.content || !formData.platform) return;
    setIsImproving(true);
    try {
      const platformSettings = getPlatformSettings(formData.platform);
      const improvedContent = await improveText(formData.content, formData.platform, platformSettings);
      setFormData(prev => ({ ...prev, content: improvedContent }));
    } catch (error) {
      console.error("Failed to improve text:", error);
    } finally {
      setIsImproving(false);
    }
  };

  // Helper to format date for datetime-local input
  const getDatetimeLocalString = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Контент-план</h2>
          <p className="text-zinc-500 mt-1">Планируйте и управляйте публикациями.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-zinc-200/60">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-zinc-900 capitalize">
            {format(currentDate, 'LLLL yyyy', { locale: ru })}
          </h3>
          <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
            <button onClick={prevWeek} className="p-1 hover:bg-white rounded-md transition-colors">
              <ChevronLeft className="w-4 h-4 text-zinc-600" />
            </button>
            <button onClick={today} className="px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-white rounded-md transition-colors">
              Сегодня
            </button>
            <button onClick={nextWeek} className="p-1 hover:bg-white rounded-md transition-colors">
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-medium">
            Неделя
          </button>
          <button className="px-3 py-1.5 bg-white text-zinc-600 border border-zinc-200 rounded-lg text-xs font-medium hover:bg-zinc-50">
            Месяц
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-zinc-200/60 overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-zinc-200/60 bg-zinc-50/50">
          {weekDays.map((date, i) => (
            <div key={i} className="p-3 text-center border-r border-zinc-200/60 last:border-r-0">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                {format(date, 'EEEE', { locale: ru })}
              </div>
              <div className={cn(
                "text-lg font-semibold w-8 h-8 mx-auto flex items-center justify-center rounded-full",
                isSameDay(date, new Date()) ? "bg-[var(--color-brand)] text-white" : "text-zinc-900"
              )}>
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((date, i) => {
            const dayUnits = contentUnits
              .filter(u => u.scheduledDate && isSameDay(new Date(u.scheduledDate), date))
              .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
            
            return (
              <div key={i} className="p-2 border-r border-zinc-200/60 last:border-r-0 min-h-[400px]">
                <div className="space-y-2">
                  {dayUnits.map(unit => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleOpenModal(undefined, unit)}
                      className={cn(
                        "p-3 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md",
                        unit.status === 'published' ? "bg-emerald-50 border-emerald-100" :
                        unit.status === 'scheduled' ? "bg-blue-50 border-blue-100" :
                        "bg-zinc-50 border-zinc-200"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          unit.status === 'published' ? "bg-emerald-500" :
                          unit.status === 'scheduled' ? "bg-blue-500" : "bg-zinc-400"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          {unit.platform}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                        {unit.title}
                      </h4>
                      <div className="mt-2 text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {unit.scheduledDate ? format(new Date(unit.scheduledDate), 'HH:mm') : ''}
                      </div>
                    </motion.div>
                  ))}
                  
                  <button 
                    onClick={() => handleOpenModal(date)}
                    className="w-full py-2 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-all flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUnit ? "Редактировать публикацию" : "Новая публикация"}
        maxWidth="xl"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Название</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Например: Анонс новой статьи"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Платформа</label>
              <select 
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] bg-white"
              >
                <option value="Telegram">Telegram</option>
                <option value="VK">ВКонтакте</option>
                <option value="Pinterest">Pinterest</option>
                <option value="Instagram">Instagram</option>
                <option value="Blog">Блог</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Статус</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as ContentUnit['status']})}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] bg-white"
              >
                <option value="draft">Черновик</option>
                <option value="scheduled">Запланировано</option>
                <option value="published">Опубликовано</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Дата и время публикации</label>
            <div className="relative">
              <input 
                type="datetime-local" 
                value={getDatetimeLocalString(formData.scheduledDate)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    setFormData({...formData, scheduledDate: date.toISOString()});
                  }
                }}
                className="w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
              />
              <CalendarIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-zinc-700">Контент (текст поста)</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateContent}
                  disabled={!formData.title || !formData.platform || isGenerating}
                  className="h-8 text-xs bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700"
                >
                  <Wand2 className="w-3 h-3 mr-1.5" />
                  {isGenerating ? "Генерация..." : "Сгенерировать ИИ"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleImproveText}
                  disabled={!formData.content || !formData.platform || isImproving}
                  className="h-8 text-xs bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  {isImproving ? "Улучшение..." : "Улучшить текст"}
                </Button>
              </div>
            </div>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={6}
              placeholder="Введите текст публикации..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            {editingUnit ? (
              <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            ) : (
              <div /> // Empty div to keep save buttons on the right
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Отмена</Button>
              <Button onClick={handleSave} disabled={!formData.title}>
                {editingUnit ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
