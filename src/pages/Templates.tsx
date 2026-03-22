import { motion } from "framer-motion";
import { BentoCard } from "../components/ui/bento-card";

export default function Templates() {
  const templateCategories = [
    {
      title: "Контент",
      description: "Структуры текстов",
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      items: ['Экспертный пост', 'Промо-пост', 'Гайд / Инструкция', 'Формат FAQ']
    },
    {
      title: "Дизайн",
      description: "Визуальные макеты",
      color: "purple",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      items: ['Минималистичный пин', 'Крупный заголовок', 'Карусель', 'Карточка с цитатой']
    },
    {
      title: "Автоматизация",
      description: "Рабочие процессы и правила",
      color: "emerald",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      items: ['SEO-пакет Pinterest', 'VK Теплая аудитория', '5 пинов / 5 дней', 'Цепочка для холодной воронки']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Библиотека шаблонов</h2>
          <p className="text-zinc-500 mt-1">Готовые структуры для быстрого создания контента.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm">
          Новый шаблон
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {templateCategories.map((category, i) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <BentoCard className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-${category.color}-50 flex items-center justify-center text-${category.color}-600`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900">{category.title}</h3>
                  <p className="text-sm text-zinc-500">{category.description}</p>
                </div>
              </div>
              <div className="space-y-3">
                {category.items.map((t) => (
                  <div key={t} className={`p-3 rounded-xl border border-zinc-100 hover:border-${category.color}-200 hover:bg-${category.color}-50/50 cursor-pointer transition-all duration-200 group`}>
                    <h4 className={`font-medium text-sm text-zinc-900 group-hover:text-${category.color}-700 transition-colors`}>{t}</h4>
                  </div>
                ))}
              </div>
            </BentoCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
