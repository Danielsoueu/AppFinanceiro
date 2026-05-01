import { Database, Download, Trash2, ArrowRight, Smartphone } from 'lucide-react';
import { FinanceState } from '../types';

interface SettingsViewProps {
  state: FinanceState;
  installApp: () => void;
  isInstallable: boolean;
}

export function SettingsView({ state, installApp, isInstallable }: SettingsViewProps) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_solofinance_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const clearData = () => {
    if (confirm("Tem certeza que deseja apagar todos os dados permanentemente? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem('solofinance_state');
      localStorage.removeItem('solofinance_db'); // Optional, best for total wipe
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {isInstallable && (
        <div className="bg-indigo-600 dark:bg-indigo-500 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">SoloFinance em sua tela inicial</h4>
              <p className="text-white/80 text-sm">Instalar o app para acesso rápido e offline.</p>
            </div>
          </div>
          <button 
            onClick={installApp}
            className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap"
          >
            Instalar App
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-8">
          <Database className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Gestão de Dados</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Tudo o que você registra é armazenado localmente no seu navegador. 
          Isso garante privacidade total, mas recomendamos fazer backups regulares.
        </p>

        <div className="space-y-3">
          <button 
            onClick={exportData}
            className="w-full group flex items-center justify-between p-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <span>Exportar Backup (JSON)</span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
          </button>
          
          <button 
            onClick={clearData}
            className="w-full flex items-center gap-3 p-5 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-2xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
            <span>Limpar Todos os Dados</span>
          </button>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200 dark:shadow-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <h4 className="text-lg font-bold mb-2">Privacidade em primeiro lugar</h4>
        <p className="text-indigo-100 text-sm leading-relaxed mb-6">
          O SoloFinance não utiliza servidores para armazenar suas movimentações financeiras. 
          Seus dados são criptografados pelo próprio navegador.
        </p>
        <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black uppercase tracking-widest">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Sistema Ativo e Protegido
        </div>
      </div>
    </div>
  );
}
