import { Badge } from "./badge";
import { Button } from "./button";
import { motion, Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Dribbble,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

type Highlight = {
  title: string;
  description: string;
};

type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: LucideIcon;
};

const highlights: Highlight[] = [
  {
    title: "Сотрудничество",
    description:
      "Linear, Framer, Gamma, Clearbit и стартапы на ранних стадиях, создающие премиальные продукты.",
  },
  {
    title: "Последний релиз",
    description:
      "Aurora OS motion system · 47 переиспользуемых чертежей, адаптивные токены и раскадровка запуска.",
  },
  {
    title: "Доступность",
    description:
      "2 места для консультаций на Q1 · Открыт для проектной работы с мая.",
  },
];

const socialLinks: SocialLink[] = [
  {
    label: "Twitter",
    handle: "@contenthub",
    href: "#",
    icon: Twitter,
  },
  {
    label: "GitHub",
    handle: "contenthub-hq",
    href: "#",
    icon: Github,
  },
  {
    label: "LinkedIn",
    handle: "in/contenthub",
    href: "#",
    icon: Linkedin,
  },
  {
    label: "Dribbble",
    handle: "contenthub",
    href: "#",
    icon: Dribbble,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function ProfileBlock() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-black/5 p-8 md:p-12">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[var(--color-brand)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                <img
                  src="https://picsum.photos/seed/avatar/200/200"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                  Алексей Смирнов
                </h1>
                <p className="text-lg text-zinc-500 mt-1">
                  Главный редактор & Дизайнер
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm">
                  Дизайн систем
                </Badge>
                <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm">
                  Контент-стратегия
                </Badge>
                <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm">
                  UI/UX
                </Badge>
              </div>

              <p className="text-zinc-600 leading-relaxed">
                Создаю цифровые продукты, которые объединяют эстетику и функциональность. 
                Помогаю брендам рассказывать свои истории через дизайн и контент.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-3">
              <Button className="rounded-xl shadow-sm">
                Написать
              </Button>
              <Button variant="outline" className="rounded-xl bg-white/50 backdrop-blur-sm">
                Резюме
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Highlights & Socials */}
          <div className="lg:col-span-7 space-y-10">
            <div className="grid gap-8">
              {highlights.map((item, index) => (
                <motion.div key={index} variants={itemVariants} className="group">
                  <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    {item.title}
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-zinc-200/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col gap-2 p-4 rounded-2xl hover:bg-white/60 transition-colors group"
                  >
                    <link.icon className="w-5 h-5 text-zinc-400 group-hover:text-[var(--color-brand)] transition-colors" />
                    <div>
                      <div className="text-sm font-medium text-zinc-900">
                        {link.label}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {link.handle}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
