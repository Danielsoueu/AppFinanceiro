import { useState } from 'react';
import { Search, Trash2, RefreshCw, Filter } from 'lucide-react';
import { Transaction } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface TransactionsViewProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
  privacyMode: boolean;
}

export function TransactionsView({ transactions, deleteTransaction, privacyMode }: TransactionsViewProps) {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição ou categoria..." 
            className="pl-12 pr-6 py-3.5 w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
          <Filter className="w-4 h-4" />
          <span>{filtered.length} lançamentos</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-[0.1em] border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-8 py-5">Data</th>
              <th className="px-8 py-5">Descrição</th>
              <th className="px-8 py-5">Categoria</th>
              <th className="px-8 py-5 text-right">Valor</th>
              <th className="px-8 py-5 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(t => (
              <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                <td className="px-8 py-6 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{t.description}</p>
                  {t.origin === 'system' && (
                    <span className="flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase mt-1 tracking-widest">
                      <RefreshCw className="w-2.5 h-2.5" /> Lançamento Automático
                    </span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {t.category}
                  </span>
                </td>
                <td className={cn(
                  "px-8 py-6 text-right font-black text-lg",
                  t.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400',
                  privacyMode && "blur-md select-none"
                )}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </td>
                <td className="px-8 py-6 text-center">
                  <button 
                    onClick={() => deleteTransaction(t.id)} 
                    className="text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Remover lançamento"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="p-20 text-center text-slate-400 dark:text-slate-600">
            Nenhum lançamento corresponde à sua busca.
          </div>
        )}
      </div>
    </div>
  );
}
