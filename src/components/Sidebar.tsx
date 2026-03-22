import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Telescope, 
  LayoutTemplate, 
  Settings, 
  ChevronDown,
  Pin,
  MessageSquare,
  Calendar,
  BarChart3,
  ListOrdered
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const mainNav = [
  { name: 'Дашборд', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Идеи', to: '/ideas', icon: Lightbulb },
  { name: 'Контент-план', to: '/plan', icon: Calendar },
  { name: 'Очередь', to: '/queue', icon: ListOrdered },
  { name: 'Источники', to: '/research', icon: Telescope },
  { name: 'Шаблоны', to: '/templates', icon: LayoutTemplate },
  { name: 'Аналитика', to: '/analytics', icon: BarChart3 },
];

const channels = [
  { name: 'Pinterest', to: '/channels/pinterest', icon: Pin },
  { name: 'VK', to: '/channels/vk', icon: MessageSquare },
];

export default function Sidebar() {
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const location = useLocation();

  const isChannelActive = location.pathname.startsWith('/channels');

  return (
    <div className="w-64 bg-[var(--color-sidebar)] text-zinc-400 flex flex-col h-screen border-r border-zinc-800 shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="text-zinc-100 font-semibold tracking-tight text-lg">Content Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-6 px-3 flex flex-col gap-6">
        
        {/* Main Menu */}
        <div className="flex flex-col gap-1">
          <div className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Меню
          </div>
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-zinc-800/50 text-zinc-100" 
                  : "hover:bg-zinc-800/30 hover:text-zinc-200"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Channels Menu */}
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setIsChannelsOpen(!isChannelsOpen)}
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors group"
          >
            <span>Каналы</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", isChannelsOpen ? "rotate-180" : "")} />
          </button>
          
          {isChannelsOpen && (
            <div className="flex flex-col gap-1 mt-1">
              {channels.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-2",
                    isActive 
                      ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]" 
                      : "hover:bg-zinc-800/30 hover:text-zinc-200"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-zinc-800/50">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive 
              ? "bg-zinc-800/50 text-zinc-100" 
              : "hover:bg-zinc-800/30 hover:text-zinc-200"
          )}
        >
          <Settings className="w-4 h-4" />
          Настройки
        </NavLink>
      </div>
    </div>
  );
}
