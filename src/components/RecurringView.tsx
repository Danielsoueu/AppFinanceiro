import { Trash2, Plus, Infinity as Infinite, ArrowRightCircle } from 'lucide-react';
import { RecurringItem, OperationType } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface RecurringViewProps {
  recurring: RecurringItem[];
  deleteRecurring: (id: string) => void;
  openRecurringModal: () => void;
  privacyMode: boolean;
}

export function RecurringView({ recurring, deleteRecurring, openRecurringModal, privacyMode }: RecurringViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gestão Estratégica</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Contratos parcelados e assinaturas contínuas.</p>
        </div>
        <button 
          onClick={openRecurringModal}
          className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Item Fixo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recurring.map((r, idx) => {
          const isContract = r.category === 'contract';
          const typeColor = r.type === 'income' ? 'border-emerald-500' : 'border-rose-500';
          const typeLabel = r.type === 'income' ? 'Receita' : 'Despesa';
          
          return (
            <motion.div 
              key={r.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden",
                "border-l-8", typeColor
              )}
            >
              <button 
                onClick={() => deleteRecurring(r.id)} 
                className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <span className={cn(
                  "text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest",
                  r.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                )}>
                  {typeLabel} • Dia {r.day}
                </span>
                <h4 className="text-xl font-bold mt-4 text-slate-800 dark:text-white leading-tight">{r.description}</h4>
                <p className={cn("text-2xl font-bold mt-2", privacyMode && "blur-md")}>
                  {formatCurrency(r.amount)} 
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 lowercase ml-1">/mês</span>
                </p>
              </div>

              {isContract ? (
                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Saldo Restante</p>
                      <p className={cn("font-bold text-slate-700 dark:text-slate-300", privacyMode && "blur-sm")}>
                        {formatCurrency((r.totalParcels! - r.paidParcels!) * r.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Valor Total</p>
                      <p className={cn("font-semibold text-slate-500 dark:text-slate-400", privacyMode && "blur-sm")}>
                        {formatCurrency(r.totalParcels! * r.amount)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <span>Progresso: {r.paidParcels} de {r.totalParcels}</span>
                      <span>{((r.paidParcels! / r.totalParcels!) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.paidParcels! / r.totalParcels!) * 100}%` }}
                        className="bg-indigo-500 dark:bg-indigo-600 h-full rounded-full" 
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <Infinite className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Renovação Automática</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {recurring.length === 0 && (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
          <ArrowRightCircle className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
          <p className="text-slate-400 dark:text-slate-600 font-medium">Você ainda não configurou contratos recorrentes.</p>
          <button onClick={openRecurringModal} className="text-indigo-600 dark:text-indigo-400 font-bold mt-2 hover:underline">Adicionar primeiro item</button>
        </div>
      )}
    </div>
  );
}
