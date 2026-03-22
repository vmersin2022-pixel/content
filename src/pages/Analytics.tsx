import { motion } from "framer-motion";
import { BentoCard } from "../components/ui/bento-card";
import { BarChart3, TrendingUp, Users, Eye, MessageCircle, Heart, Share2, ArrowUpRight, Lightbulb } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useContentStore } from "../store/useContentStore";
import { useMemo } from "react";

const data = [
  { name: 'Пн', views: 4000, engagement: 2400, newFollowers: 240 },
  { name: 'Вт', views: 3000, engagement: 1398, newFollowers: 2210 },
  { name: 'Ср', views: 2000, engagement: 9800, newFollowers: 2290 },
  { name: 'Чт', views: 2780, engagement: 3908, newFollowers: 2000 },
  { name: 'Пт', views: 1890, engagement: 4800, newFollowers: 2181 },
  { name: 'Сб', views: 2390, engagement: 3800, newFollowers: 2500 },
  { name: 'Вс', views: 3490, engagement: 4300, newFollowers: 2100 },
];

export default function Analytics() {
  const { ideas, contentUnits } = useContentStore();

  // Calculate platform distribution
  const platformData = useMemo(() => {
    const counts: Record<string, number> = {};
    contentUnits.forEach(unit => {
      counts[unit.platform] = (counts[unit.platform] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [contentUnits]);

  // Calculate ROI per Idea (Mock data based on real ideas)
  const ideaROI = useMemo(() => {
    return ideas.map(idea => {
      const units = contentUnits.filter(u => u.ideaId === idea.id);
      const postsCount = units.length;
      
      // Mock metrics based on idea ID length to make it deterministic but varied
      const mockMultiplier = (idea.id.length % 5) + 1;
      const views = postsCount * 1200 * mockMultiplier;
      const likes = Math.floor(views * 0.05);
      const er = (likes / (views || 1) * 100).toFixed(1);

      return {
        id: idea.id,
        title: idea.title,
        postsCount,
        views,
        likes,
        er: `${er}%`
      };
    }).sort((a, b) => b.views - a.views).slice(0, 5); // Top 5 ideas
  }, [ideas, contentUnits]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Аналитика</h2>
          <p className="text-zinc-500 mt-1">Отслеживайте эффективность вашего контента по всем каналам.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]">
            <option>Последние 7 дней</option>
            <option>Последние 30 дней</option>
            <option>Этот месяц</option>
            <option>Прошлый месяц</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Всего идей</p>
              <h3 className="text-2xl font-semibold text-zinc-900">{ideas.length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Активных: {ideas.filter(i => i.status === 'active' || i.status === 'in_progress').length}</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Единиц контента</p>
              <h3 className="text-2xl font-semibold text-zinc-900">{contentUnits.length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Опубликовано: {contentUnits.filter(u => u.status === 'published').length}</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Общий охват (прогноз)</p>
              <h3 className="text-2xl font-semibold text-zinc-900">
                {(contentUnits.length * 1250).toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>В среднем 1.2K на пост</span>
          </div>
        </BentoCard>

        <BentoCard className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Средний ER</p>
              <h3 className="text-2xl font-semibold text-zinc-900">4.8%</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Выше нормы на 1.2%</span>
          </div>
        </BentoCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard className="lg:col-span-2 min-h-[400px]">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">Динамика охвата и вовлеченности</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0077FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" name="Охват" dataKey="views" stroke="#0077FF" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" name="Вовлеченность" dataKey="engagement" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        <BentoCard className="min-h-[400px]">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">Контент по каналам</h3>
          <div className="h-[300px] w-full">
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E4E7" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#18181B', fontSize: 14, fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{fill: '#F4F4F5'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="value" name="Постов" fill="#0077FF" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Нет данных о контенте
              </div>
            )}
          </div>
        </BentoCard>
      </div>

      {/* ROI per Idea */}
      <BentoCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">ROI Идей (Выхлоп)</h3>
            <p className="text-sm text-zinc-500">Эффективность сгенерированных идей на основе созданного контента.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500 border-b border-zinc-200/60">
              <tr>
                <th className="pb-3 font-medium">Идея</th>
                <th className="pb-3 font-medium text-center">Сгенерировано постов</th>
                <th className="pb-3 font-medium text-right">Охват (прогноз)</th>
                <th className="pb-3 font-medium text-right">Лайки (прогноз)</th>
                <th className="pb-3 font-medium text-right">ER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ideaROI.map((idea, i) => (
                <tr key={idea.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-4 font-medium text-zinc-900 max-w-[300px] truncate" title={idea.title}>
                    {idea.title}
                  </td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                      {idea.postsCount}
                    </span>
                  </td>
                  <td className="py-4 text-right text-zinc-600">{(idea.views / 1000).toFixed(1)}K</td>
                  <td className="py-4 text-right text-zinc-600">{idea.likes}</td>
                  <td className="py-4 text-right font-medium text-emerald-600">{idea.er}</td>
                </tr>
              ))}
              {ideaROI.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    Нет данных. Создайте идеи и сгенерируйте контент-план.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* Best Patterns */}
      <BentoCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Лучшие паттерны (CTA)</h3>
            <p className="text-sm text-zinc-500">Какие призывы к действию работают лучше всего.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { cta: "«Сохраняй, чтобы не потерять»", er: "8.4%", platform: "Pinterest" },
            { cta: "«Делись мнением в комментариях»", er: "7.2%", platform: "VK" },
            { cta: "«Переходи по ссылке в профиле»", er: "5.1%", platform: "Telegram" },
          ].map((pattern, i) => (
            <div key={i} className="p-4 rounded-xl border border-zinc-200/60 bg-zinc-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{pattern.platform}</span>
                <span className="text-sm font-bold text-emerald-600">{pattern.er} ER</span>
              </div>
              <p className="font-medium text-zinc-900">"{pattern.cta}"</p>
            </div>
          ))}
        </div>
      </BentoCard>
    </div>
  );
}
