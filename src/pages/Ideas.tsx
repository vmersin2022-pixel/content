import React, { useState, useEffect } from "react";
import { AIInputWithLoading } from "../components/ui/ai-input-with-loading";
import { motion, AnimatePresence } from "framer-motion";
import { useContentStore, IdeaStatus, Idea } from "../store/useContentStore";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "../lib/utils";
import { Modal } from "../components/ui/modal";
import { Button } from "../components/ui/button";
import { Trash2, Edit2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateIdeaContent } from "../services/ai";

const COLUMNS: { id: IdeaStatus; label: string }[] = [
  { id: 'inbox', label: 'Входящие' },
  { id: 'research', label: 'На изучение' },
  { id: 'ready', label: 'Готовы' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'active', label: 'Активные' },
];

export default function Ideas() {
  const { ideas, addIdea, moveIdea, deleteIdea, updateIdea, addContentUnit, contentUnits, settings } = useContentStore();
  const [draggedIdeaId, setDraggedIdeaId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const ideaContentUnits = contentUnits.filter(unit => unit.ideaId === selectedIdea?.id);

  const handleGenerateIdea = async (value: string) => {
    try {
      const generatedIdeas = await generateIdeaContent(value);
      
      // Add each generated idea to the store
      generatedIdeas.forEach(idea => {
        addIdea({
          title: idea.title,
          description: idea.description,
          status: 'inbox',
          tags: idea.tags,
        });
      });
    } catch (error) {
      console.error("Failed to generate ideas:", error);
      // Fallback if AI fails
      addIdea({
        title: value,
        description: 'Не удалось сгенерировать идеи с помощью ИИ. Это черновик на основе вашего запроса.',
        status: 'inbox',
        tags: ['Draft'],
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedIdeaId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: IdeaStatus) => {
    e.preventDefault();
    if (draggedIdeaId) {
      moveIdea(draggedIdeaId, status);
      setDraggedIdeaId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteIdea(id);
    setSelectedIdea(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Банк идей</h2>
          <p className="text-zinc-500 mt-1">Управляйте контентными гипотезами и планами.</p>
        </div>
        <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === 'list' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            Списком
          </button>
          <button 
            onClick={() => setViewMode('board')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              viewMode === 'board' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            Доской
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl mx-auto my-4"
      >
        <AIInputWithLoading 
          onSubmit={handleGenerateIdea} 
          placeholder="Опишите идею, а ИИ превратит её в контент-план..."
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {viewMode === 'board' ? (
            <motion.div 
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex gap-4 overflow-x-auto pb-4"
            >
              {COLUMNS.map((col, i) => {
                const columnIdeas = ideas.filter(idea => idea.status === col.id);
                
                return (
                  <motion.div 
                    key={col.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="w-80 shrink-0 flex flex-col gap-3"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-medium text-sm text-zinc-600 uppercase tracking-wider">{col.label}</h3>
                      <span className="bg-zinc-200 text-zinc-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {columnIdeas.length}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-h-[200px] rounded-xl transition-colors duration-200">
                      {columnIdeas.map((idea) => (
                        <div 
                          key={idea.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, idea.id)}
                          onClick={() => setSelectedIdea(idea)}
                          className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/60 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[var(--color-brand)]/50 transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <div className="relative z-10">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {idea.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-2 py-1 rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h4 className="font-semibold text-zinc-900 mb-2 group-hover:text-[var(--color-brand)] transition-colors">
                              {idea.title}
                            </h4>
                            <p className="text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                              {idea.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                              <span>{formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true, locale: ru })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-zinc-200/60"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-200/60 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Название</th>
                    <th className="px-6 py-4 font-medium">Статус</th>
                    <th className="px-6 py-4 font-medium">Теги</th>
                    <th className="px-6 py-4 font-medium">Добавлено</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {ideas.map(idea => (
                    <tr 
                      key={idea.id} 
                      onClick={() => setSelectedIdea(idea)}
                      className="hover:bg-zinc-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 group-hover:text-[var(--color-brand)] transition-colors">{idea.title}</div>
                        <div className="text-zinc-500 text-xs mt-1 line-clamp-1 max-w-md">{idea.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                          {COLUMNS.find(c => c.id === idea.status)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {idea.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true, locale: ru })}
                      </td>
                    </tr>
                  ))}
                  {ideas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                        Идей пока нет. Создайте первую идею выше.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Idea Detail Modal */}
      <Modal 
        isOpen={!!selectedIdea} 
        onClose={() => { setSelectedIdea(null); setIsEditing(false); }}
        title={isEditing ? "Редактирование идеи" : "Детали идеи"}
        maxWidth="2xl"
      >
        {selectedIdea && (
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Название</label>
                  <input 
                    type="text" 
                    value={selectedIdea.title}
                    onChange={(e) => setSelectedIdea({...selectedIdea, title: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Описание</label>
                  <textarea 
                    value={selectedIdea.description}
                    onChange={(e) => setSelectedIdea({...selectedIdea, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Статус</label>
                  <select 
                    value={selectedIdea.status}
                    onChange={(e) => setSelectedIdea({...selectedIdea, status: e.target.value as IdeaStatus})}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] bg-white"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Отмена</Button>
                  <Button onClick={() => {
                    updateIdea(selectedIdea.id, selectedIdea);
                    setIsEditing(false);
                  }}>Сохранить</Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">{selectedIdea.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6">
                    <span className="bg-zinc-100 px-2.5 py-1 rounded-md font-medium text-zinc-700">
                      {COLUMNS.find(c => c.id === selectedIdea.status)?.label}
                    </span>
                    <span>Добавлено {formatDistanceToNow(new Date(selectedIdea.createdAt), { addSuffix: true, locale: ru })}</span>
                  </div>
                  
                  <div className="prose prose-zinc max-w-none">
                    <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                      {selectedIdea.description}
                    </p>
                  </div>
                </div>

                {selectedIdea.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 mb-2">Теги</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIdea.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleDelete(selectedIdea.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Изменить
                    </Button>
                    <Button onClick={() => navigate(`/ideas/${selectedIdea.id}`)}>
                      Развернуть идею
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
