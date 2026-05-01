import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Repeat, 
  ArrowLeftRight, 
  Settings, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'month', label: 'Este Mês', icon: Calendar },
  { id: 'recurring', label: 'Contratos', icon: Repeat },
  { id: 'transactions', label: 'Extrato', icon: ArrowLeftRight },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, theme, toggleTheme }: SidebarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:top-0 lg:left-0 lg:w-64 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-slate-800 z-50 px-4 py-2 lg:py-8 flex lg:flex-col justify-around lg:justify-start gap-4 transition-colors duration-300">
      <div className="hidden lg:block mb-8 px-4">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" /> SoloFinance
        </h1>
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">Privacidade Total</p>
      </div>
      
      <div className="flex lg:flex-col gap-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col lg:flex-row items-center gap-2 p-3 rounded-xl lg:w-full transition-all duration-200 relative group",
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
              <span className="text-[10px] lg:text-sm font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 border-indigo-600 dark:border-indigo-400 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto hidden lg:block px-4">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-sm font-medium">{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>
      </div>
    </nav>
  );
}
