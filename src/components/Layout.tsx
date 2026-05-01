import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Plus, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { Sidebar } from './Sidebar';
import { Toasts } from './Toasts';
import { Notification } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  privacyMode: boolean;
  togglePrivacy: () => void;
  notifications: Notification[];
  openTransactionModal: () => void;
}

export function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  privacyMode, 
  togglePrivacy,
  notifications,
  openTransactionModal
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      <main className="lg:ml-64 p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'dashboard' && 'Resumo Geral'}
              {activeTab === 'month' && 'Este Mês'}
              {activeTab === 'recurring' && 'Contratos & Assinaturas'}
              {activeTab === 'transactions' && 'Extrato Geral'}
              {activeTab === 'settings' && 'Ajustes'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && 'Sua posição financeira consolidada.'}
              {activeTab === 'month' && 'Gerencie os pagamentos do mês atual.'}
              {activeTab === 'recurring' && 'Visão de longo prazo do seu patrimônio.'}
              {activeTab === 'transactions' && 'Todo o seu histórico de lançamentos.'}
              {activeTab === 'settings' && 'Personalize sua experiência.'}
            </p>
          </motion.div>

          <div className="flex gap-3 w-full md:w-auto items-center">
            <button 
              onClick={toggleTheme}
              className="lg:hidden p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={togglePrivacy} 
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
              title={privacyMode ? "Mostrar valores" : "Esconder valores"}
            >
              {privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button 
              onClick={openTransactionModal}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all font-semibold active:scale-95"
            >
              <Plus className="w-5 h-5" /> Novo Lançamento
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Toasts notifications={notifications} />
    </div>
  );
}
