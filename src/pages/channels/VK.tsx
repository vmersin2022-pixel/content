import { useState } from "react";
import { EmptyState } from "../../components/ui/interactive-empty-state";
import { FileText, Users, Hash, TrendingUp, MessageCircle, Heart, Share2, Calendar as CalendarIcon, Trash2, Wand2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useContentStore, ContentUnit } from "../../store/useContentStore";
import { BentoCard } from "../../components/ui/bento-card";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { generatePostContent, improveText } from "../../services/ai";

export default function VK() {
  const { contentUnits, addContentUnit, updateContentUnit, deleteContentUnit, settings } = useContentStore();
  const vkUnits = contentUnits.filter(unit => unit.platform === 'VK');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ContentUnit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ContentUnit>>({
    title: '',
    content: '',
    platform: 'VK',
    status: 'draft',
    scheduledDate: new Date().toISOString(),
  });

  const handleOpenModal = (unit?: ContentUnit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData(unit);
    } else {
      setEditingUnit(null);
      const scheduledDate = new Date();
      scheduledDate.setHours(12, 0, 0, 0);
      setFormData({
        title: '',
        content: '',
        platform: 'VK',
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

  const handleGenerateContent = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    try {
      const content = await generatePostContent(formData.title, 'VK', settings.channels.vk);
      setFormData(prev => ({ ...prev, content }));
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveText = async () => {
    if (!formData.content) return;
    setIsImproving(true);
    try {
      const improvedContent = await improveText(formData.content, 'VK', settings.channels.vk);
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0077FF] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
            V
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Рабочая область VK</h2>
            <p className="text-zinc-500 mt-1">Управление постами, аудиториями и хэштегами.</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-[#0077FF] text-white rounded-xl text-sm font-medium hover:bg-[#0077FF]/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Создать пост
        </button>
      </div>

      {/* Channel Navigation */}
      <div className="flex gap-6 border-b border-zinc-200">
        {['Обзор', 'Очередь', 'Посты', 'Хэштеги', 'Аудитории', 'Шаблоны', 'Настройки'].map((tab, i) => (
          <button 
            key={tab}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              i === 0 
                ? 'border-[#0077FF] text-[#0077FF]' 
                : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Охват аудитории</p>
              <h3 className="text-2xl font-semibold text-zinc-900">45.2K</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+8.4% к прошлому месяцу</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Вовлеченность (ER)</p>
              <h3 className="text-2xl font-semibold text-zinc-900">3.8%</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+1.2% к прошлому месяцу</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Новые подписчики</p>
              <h3 className="text-2xl font-semibold text-zinc-900">+428</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+24.5% к прошлому месяцу</span>
          </div>
        </BentoCard>
      </div>

      {/* Workspace Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900">Недавние публикации</h3>
        
        {vkUnits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-8 min-h-[400px] flex items-center justify-center"
          >
            <EmptyState
              title="Обзор VK пуст"
              description="Здесь будет находиться очередь публикаций VK, сегменты аудиторий и управление хэштегами. Создайте свой первый пост, чтобы начать."
              icons={[<Hash key="1" className="w-5 h-5" />, <FileText key="2" className="w-6 h-6" />, <Users key="3" className="w-5 h-5" />]}
              action={{
                label: "Создать пост",
                icon: <FileText className="w-4 h-4" />,
                onClick: () => handleOpenModal()
              }}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {vkUnits.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleOpenModal(unit)}
                className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-6 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      unit.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      unit.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {unit.status === 'published' ? 'Опубликовано' :
                       unit.status === 'scheduled' ? 'Запланировано' : 'Черновик'}
                    </span>
                    {unit.scheduledDate && (
                      <span className="text-sm text-zinc-500 font-medium">
                        {format(new Date(unit.scheduledDate), "d MMMM yyyy, HH:mm", { locale: ru })}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-semibold text-zinc-900 mb-2 group-hover:text-[#0077FF] transition-colors">
                    {unit.title}
                  </h4>
                  <p className="text-zinc-600 line-clamp-3 mb-4">
                    {unit.content}
                  </p>
                  
                  {/* Fake Engagement Metrics for Published Posts */}
                  {unit.status === 'published' && (
                    <div className="flex items-center gap-6 text-zinc-500 text-sm font-medium mt-4 pt-4 border-t border-zinc-100">
                      <div className="flex items-center gap-1.5 hover:text-[#0077FF] cursor-pointer transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>124</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-[#0077FF] cursor-pointer transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>18</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-[#0077FF] cursor-pointer transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>5</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Optional Placeholder for Attachment */}
                <div className="w-full md:w-48 h-32 md:h-auto bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 shrink-0">
                  <FileText className="w-8 h-8 opacity-50" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUnit ? "Редактировать пост" : "Новый пост"}
        maxWidth="xl"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Заголовок поста</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Например: Анонс нового продукта"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Статус</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as ContentUnit['status']})}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077FF] bg-white"
              >
                <option value="draft">Черновик</option>
                <option value="scheduled">Запланировано</option>
                <option value="published">Опубликовано</option>
              </select>
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
                  className="w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                />
                <CalendarIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-zinc-700">Текст поста</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateContent}
                  disabled={!formData.title || isGenerating}
                  className="h-8 text-xs bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700"
                >
                  <Wand2 className="w-3 h-3 mr-1.5" />
                  {isGenerating ? "Генерация..." : "Сгенерировать ИИ"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleImproveText}
                  disabled={!formData.content || isImproving}
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
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077FF] resize-none"
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
              <Button onClick={handleSave} disabled={!formData.title} className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white">
                {editingUnit ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
