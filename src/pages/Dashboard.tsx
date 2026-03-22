import { motion } from "framer-motion";
import { BentoCard } from "../components/ui/bento-card";
import { cn } from "../lib/utils";
import { useContentStore, Recommendation } from "../store/useContentStore";
import { format, isToday, isTomorrow } from "date-fns";
import { ru } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import SystemInsights from "../components/dashboard/SystemInsights";

export default function Dashboard() {
  const { ideas, contentUnits } = useContentStore();
  const navigate = useNavigate();

  // Mock recommendations
  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'scale',
      title: 'Масштабирование идеи',
      description: 'Идея "Как выбрать свечи" показывает лучший ER.',
      reason: 'Высокая вовлеченность',
      confidence: 92,
      impact: 90,
      action: 'Развернуть идею'
    },
    {
      id: '2',
      type: 'gap',
      title: 'Очередь контента',
      description: 'Очередь закончится через 2 дня.',
      reason: 'Низкое покрытие',
      confidence: 85,
      impact: 80,
      action: 'Сгенерировать контент'
    }
  ];

  const totalIdeas = ideas.length;
  const readyIdeas = ideas.filter(i => i.status === 'ready').length;
  const scheduledToday = contentUnits.filter(u => u.scheduledDate && isToday(new Date(u.scheduledDate))).length;
  const draftUnits = contentUnits.filter(u => u.status === 'draft').length;

  const stats = [
    { label: 'Всего идей', value: totalIdeas.toString(), trend: 'В базе', alert: false },
    { label: 'Готовы к генерации', value: readyIdeas.toString(), trend: readyIdeas > 0 ? 'Требует внимания' : 'В норме', alert: readyIdeas > 0 },
    { label: 'Запланировано на сегодня', value: scheduledToday.toString(), trend: 'В норме', alert: false },
    { label: 'Черновики', value: draftUnits.toString(), trend: 'Ожидают публикации', alert: draftUnits > 0 },
  ];

  // Get upcoming 5 units
  const upcomingUnits = [...contentUnits]
    .filter(u => u.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
    .slice(0, 5);

  const formatScheduleDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Сегодня, ' + format(date, 'HH:mm');
    if (isTomorrow(date)) return 'Завтра, ' + format(date, 'HH:mm');
    return format(date, 'd MMM, HH:mm', { locale: ru });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Доброе утро, Создатель</h2>
          <p className="text-zinc-500 mt-1">Вот что происходит с вашим контентом сегодня.</p>
        </div>
      </div>
      
      <SystemInsights recommendations={recommendations} />
      
      {/* Snapshot Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <BentoCard className="h-full" linkTo="#">
              <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
              <span className="text-4xl font-semibold tracking-tight mt-2 text-zinc-900">{stat.value}</span>
              <span className={cn(
                "text-xs font-medium mt-auto pt-6", 
                stat.alert ? 'text-rose-500' : 'text-emerald-600'
              )}>
                {stat.trend}
              </span>
            </BentoCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <BentoCard className="min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-zinc-900">Ближайшие публикации</h3>
              <button className="text-sm font-medium text-[var(--color-brand)] hover:underline">
                Смотреть все
              </button>
            </div>
            
            {upcomingUnits.length > 0 ? (
              <div className="space-y-4">
                {upcomingUnits.map(unit => (
                  <div key={unit.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100/80 hover:border-zinc-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        unit.status === 'published' ? "bg-emerald-500" :
                        unit.status === 'scheduled' ? "bg-blue-500" : "bg-zinc-400"
                      )} />
                      <div>
                        <h4 className="font-medium text-zinc-900">{unit.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                          <span className="text-zinc-500">{unit.platform}</span>
                          <span className="text-zinc-300">•</span>
                          <span className={cn(
                            unit.status === 'scheduled' ? "text-blue-600" : "text-zinc-500"
                          )}>
                            {unit.scheduledDate ? formatScheduleDate(unit.scheduledDate) : 'Без даты'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                      Редактировать
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
                Нет запланированных публикаций
              </div>
            )}
          </BentoCard>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-6"
        >
          <BentoCard>
            <h3 className="font-semibold text-lg mb-4 text-zinc-900 flex items-center gap-2">
              <span className="text-amber-500">✨</span> Рекомендации системы
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/50">
                <h4 className="text-sm font-medium text-amber-900 mb-1">Высокий потенциал</h4>
                <p className="text-xs text-amber-700/80 leading-relaxed">
                  Тема "AI в маркетинге" показывает ER выше среднего. Рекомендуем создать еще 2 поста для Telegram.
                </p>
                <button 
                  onClick={() => navigate('/ideas')}
                  className="mt-3 text-xs font-medium text-amber-700 bg-amber-100/50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Сгенерировать идеи
                </button>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Оптимизация расписания</h4>
                <p className="text-xs text-blue-700/80 leading-relaxed">
                  У вас {draftUnits} черновиков. Запустите автопланирование, чтобы заполнить пустые слоты на этой неделе.
                </p>
                <button 
                  onClick={() => navigate('/queue')}
                  className="mt-3 text-xs font-medium text-blue-700 bg-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Перейти в Очередь
                </button>
              </div>
            </div>
          </BentoCard>
        </motion.div>
      </div>
    </div>
  );
}
