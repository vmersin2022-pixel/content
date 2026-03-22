import React from 'react';
import { Idea, useContentStore } from '../../store/useContentStore';
import { Sparkles, Calendar, Edit2, Trash2, CheckCircle2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface GeneratedUnitsTabProps {
  idea: Idea;
}

export default function GeneratedUnitsTab({ idea }: GeneratedUnitsTabProps) {
  const { contentUnits, deleteContentUnit, updateContentUnit, autoScheduleQueue } = useContentStore();
  
  const units = contentUnits.filter(unit => unit.ideaId === idea.id);
  const approvedUnitsCount = units.filter(u => u.status === 'approved').length;

  const handleApprove = (id: string) => {
    updateContentUnit(id, { status: 'approved' });
  };

  const handleSendToQueue = () => {
    autoScheduleQueue();
    toast.success("Отправлено в очередь", {
      description: `Утвержденные единицы контента (${approvedUnitsCount}) переданы автопланировщику.`
    });
  };

  if (units.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-12 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет сгенерированного контента</h3>
        <p className="mt-1 text-sm text-gray-500">
          Перейдите на вкладку "Content Plan" и сгенерируйте контент для этой идеи.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {approvedUnitsCount > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSendToQueue}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Send className="w-4 h-4 mr-2" />
            Отправить в очередь ({approvedUnitsCount})
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map(unit => (
          <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                {unit.platform}
              </span>
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                unit.status === 'draft' ? "bg-amber-100 text-amber-800" :
                unit.status === 'approved' ? "bg-emerald-100 text-emerald-800" :
                unit.status === 'scheduled' ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {unit.status}
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{unit.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-4 mb-4 flex-1 whitespace-pre-wrap">{unit.content}</p>
              
              {unit.platform === 'Pinterest' && (
                <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
                  {unit.angle && (
                    <div className="flex items-start">
                      <span className="text-xs font-medium text-gray-500 w-20">Angle:</span>
                      <span className="text-xs text-gray-900">{unit.angle}</span>
                    </div>
                  )}
                  {unit.keywords && unit.keywords.length > 0 && (
                    <div className="flex items-start">
                      <span className="text-xs font-medium text-gray-500 w-20">Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {unit.keywords.map(kw => (
                          <span key={kw} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {formatDistanceToNow(new Date(unit.createdAt), { addSuffix: true, locale: ru })}
              </div>
              <div className="flex space-x-2">
                {unit.status === 'draft' && (
                  <button 
                    onClick={() => handleApprove(unit.id)}
                    className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    title="Утвердить"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="Редактировать">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteContentUnit(unit.id)}
                  className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
