import { useState } from "react";
import { EmptyState } from "../../components/ui/interactive-empty-state";
import { ImagePlus, LayoutGrid, Pin, TrendingUp, Users, Eye, ArrowUpRight, Calendar as CalendarIcon, Trash2, Wand2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useContentStore, ContentUnit } from "../../store/useContentStore";
import { BentoCard } from "../../components/ui/bento-card";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { generatePostContent, improveText } from "../../services/ai";

export default function Pinterest() {
  const { contentUnits, addContentUnit, updateContentUnit, deleteContentUnit, settings } = useContentStore();
  const pinterestUnits = contentUnits.filter(unit => unit.platform === 'Pinterest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ContentUnit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ContentUnit>>({
    title: '',
    content: '',
    platform: 'Pinterest',
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
        platform: 'Pinterest',
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
      const content = await generatePostContent(formData.title, 'Pinterest', settings.channels.pinterest);
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
      const improvedContent = await improveText(formData.content, 'Pinterest', settings.channels.pinterest);
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
          <div className="w-12 h-12 rounded-2xl bg-[#E60023] flex items-center justify-center text-white font-bold text-2xl shadow-sm">
            P
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Рабочая область Pinterest</h2>
            <p className="text-zinc-500 mt-1">Управление пинами, досками и SEO.</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-[#E60023] text-white rounded-xl text-sm font-medium hover:bg-[#E60023]/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Создать пин
        </button>
      </div>

      {/* Channel Navigation */}
      <div className="flex gap-6 border-b border-zinc-200">
        {['Обзор', 'Очередь', 'Пины', 'SEO', 'Доски', 'Шаблоны', 'Настройки'].map((tab, i) => (
          <button 
            key={tab}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              i === 0 
                ? 'border-[#E60023] text-[#E60023]' 
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
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Показы за месяц</p>
              <h3 className="text-2xl font-semibold text-zinc-900">124.5K</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% к прошлому месяцу</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <Pin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Сохранения</p>
              <h3 className="text-2xl font-semibold text-zinc-900">3,492</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+5.2% к прошлому месяцу</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Переходы по ссылкам</p>
              <h3 className="text-2xl font-semibold text-zinc-900">892</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+18.1% к прошлому месяцу</span>
          </div>
        </BentoCard>
      </div>

      {/* Workspace Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900">Недавние пины</h3>
        
        {pinterestUnits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-8 min-h-[400px] flex items-center justify-center"
          >
            <EmptyState
              title="Обзор Pinterest пуст"
              description="Здесь будет находиться очередь публикаций Pinterest, управление досками и отслеживание SEO. Создайте свой первый пин, чтобы начать."
              icons={[<Pin key="1" className="w-5 h-5" />, <ImagePlus key="2" className="w-6 h-6" />, <LayoutGrid key="3" className="w-5 h-5" />]}
              action={{
                label: "Создать пин",
                icon: <Pin className="w-4 h-4" />,
                onClick: () => handleOpenModal()
              }}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinterestUnits.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleOpenModal(unit)}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-zinc-100 relative">
                  {/* Placeholder for Pin Image */}
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                    <ImagePlus className="w-8 h-8 opacity-50" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-white/80 shadow-sm ${
                      unit.status === 'published' ? 'text-emerald-700' :
                      unit.status === 'scheduled' ? 'text-blue-700' :
                      'text-zinc-700'
                    }`}>
                      {unit.status === 'published' ? 'Опубликовано' :
                       unit.status === 'scheduled' ? 'Запланировано' : 'Черновик'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-zinc-900 mb-2 line-clamp-2 group-hover:text-[#E60023] transition-colors">
                    {unit.title}
                  </h4>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                    {unit.content}
                  </p>
                  {unit.scheduledDate && (
                    <div className="text-xs text-zinc-400 font-medium">
                      {format(new Date(unit.scheduledDate), "d MMMM yyyy, HH:mm", { locale: ru })}
                    </div>
                  )}
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
        title={editingUnit ? "Редактировать пин" : "Новый пин"}
        maxWidth="xl"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Название пина</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Например: 5 идей для осеннего декора"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60023]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Статус</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as ContentUnit['status']})}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60023] bg-white"
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
                  className="w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
                <CalendarIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-zinc-700">Описание (SEO)</label>
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
              rows={4}
              placeholder="Введите описание пина с ключевыми словами..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60023] resize-none"
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
              <Button onClick={handleSave} disabled={!formData.title} className="bg-[#E60023] hover:bg-[#E60023]/90 text-white">
                {editingUnit ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
