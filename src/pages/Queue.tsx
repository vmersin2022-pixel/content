import { useState } from "react";
import { motion } from "framer-motion";
import { useContentStore, ContentUnit } from "../store/useContentStore";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Plus, Clock, Wand2, GripVertical, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function Queue() {
  const { contentUnits, autoScheduleQueue, settings } = useContentStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate week days
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const today = () => setCurrentDate(new Date());

  const handleAutoSchedule = () => {
    autoScheduleQueue();
    toast.success("Автопланирование завершено", {
      description: "Черновики распределены по доступным слотам с учетом приоритета."
    });
  };

  const approvedCount = contentUnits.filter(u => u.status === 'approved').length;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Умная очередь</h2>
          <p className="text-zinc-500 mt-1">Автоматическое планирование контента на основе аналитики и настроек.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mr-4">
            <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
            Ожидающих (Approved): <strong className="text-zinc-900">{approvedCount}</strong>
          </div>
          <Button 
            onClick={handleAutoSchedule}
            disabled={approvedCount === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Автопланирование
          </Button>
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
      </div>

      {/* Timeline Grid */}
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
              <div key={i} className="p-2 border-r border-zinc-200/60 last:border-r-0 min-h-[500px] bg-zinc-50/30">
                <div className="space-y-3">
                  {dayUnits.map(unit => (
                    <motion.div 
                      key={unit.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all hover:shadow-md group relative bg-white",
                        unit.status === 'published' ? "border-emerald-200" :
                        unit.status === 'scheduled' ? "border-blue-200" :
                        "border-zinc-200"
                      )}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-zinc-400" />
                      </div>
                      
                      <div className="pl-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              unit.status === 'published' ? "bg-emerald-500" :
                              unit.status === 'scheduled' ? "bg-blue-500" : "bg-zinc-400"
                            )} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                              {unit.platform}
                            </span>
                          </div>
                          {unit.priorityScore && (
                            <span className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                              unit.priorityScore >= 80 ? "bg-orange-100 text-orange-700" :
                              unit.priorityScore >= 50 ? "bg-blue-100 text-blue-700" :
                              "bg-zinc-100 text-zinc-600"
                            )}>
                              ★ {unit.priorityScore}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug mb-2">
                          {unit.title}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                          <div className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {unit.scheduledDate ? format(new Date(unit.scheduledDate), 'HH:mm') : ''}
                          </div>
                        </div>

                        {unit.schedulingReason && (
                          <div className="mt-2 text-[10px] text-zinc-500 bg-zinc-50 p-1.5 rounded-md flex items-start gap-1.5">
                            <AlertCircle className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{unit.schedulingReason}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {dayUnits.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-8">
                      <span className="text-xs">Нет постов</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
