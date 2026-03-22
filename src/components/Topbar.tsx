import { useLocation } from 'react-router-dom';
import { Bell, Search, Plus } from 'lucide-react';

export default function Topbar() {
  const location = useLocation();
  
  // Simple breadcrumb logic based on pathname
  const pathnames = location.pathname.split('/').filter((x) => x);
  const routeNames: Record<string, string> = {
    dashboard: 'Дашборд',
    ideas: 'Идеи',
    research: 'Источники',
    templates: 'Шаблоны',
    settings: 'Настройки',
    pinterest: 'Pinterest',
    vk: 'VK'
  };
  const currentPath = pathnames[pathnames.length - 1];
  const title = currentPath ? (routeNames[currentPath] || currentPath.charAt(0).toUpperCase() + currentPath.slice(1)) : 'Дашборд';

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Поиск идей, шаблонов..." 
            className="pl-9 pr-4 py-1.5 bg-zinc-100 border-transparent focus:bg-white focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] rounded-full text-sm w-64 transition-all outline-none"
          />
        </div>

        {/* Quick Action */}
        <button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Новая идея
        </button>

        <div className="w-px h-6 bg-zinc-200"></div>

        {/* Notifications */}
        <button className="relative text-zinc-500 hover:text-zinc-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-brand)] rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <button className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 overflow-hidden">
          <img 
            src="https://picsum.photos/seed/user/100/100" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
}
