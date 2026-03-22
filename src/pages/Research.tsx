import { EmptyState } from "../components/ui/interactive-empty-state";
import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Research() {
  const hasData = false; // Set to false to demonstrate EmptyState

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Лента источников</h2>
          <p className="text-zinc-500 mt-1">Отслеживайте тренды и собирайте материалы.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">
            Новые
          </button>
          <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
            Обработанные
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex gap-4 bg-zinc-50/50">
          <input 
            type="text" 
            placeholder="Фильтр сигналов..." 
            className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
          />
          <select className="px-4 py-2 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[var(--color-brand)]">
            <option>Все каналы</option>
            <option>Pinterest</option>
            <option>VK</option>
          </select>
        </div>

        {hasData ? (
          <div className="divide-y divide-zinc-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 hover:bg-zinc-50 transition-colors flex items-start justify-between group"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center shrink-0">
                    <span className="text-[var(--color-brand)] font-bold text-sm">#</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-zinc-900">"осенний декор для дома своими руками"</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Высокий спрос</span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-3">
                      Растущий поисковый запрос в Pinterest. Рост +45% за последние 7 дней.
                    </p>
                    <div className="flex gap-2">
                      <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">DIY</span>
                      <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">Home Decor</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors">
                    Игнорировать
                  </button>
                  <button className="px-3 py-1.5 bg-[var(--color-brand)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-brand-hover)] transition-colors">
                    Создать идею
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 flex justify-center">
            <EmptyState
              title="Нет новых сигналов"
              description="Мы пока не нашли новых трендов или сигналов по вашим источникам. Попробуйте добавить новые источники или изменить фильтры."
              icons={[<Search key="1" className="w-5 h-5" />, <Search key="2" className="w-6 h-6" />, <Search key="3" className="w-5 h-5" />]}
              action={{
                label: "Добавить источник",
                icon: <Plus className="w-4 h-4" />,
                onClick: () => console.log("Add source clicked")
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
