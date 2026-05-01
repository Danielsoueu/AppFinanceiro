import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent } from 'react';
import { OperationType, RecurringItem } from '../types';
import { cn } from '../lib/utils';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<RecurringItem, 'id'>) => void;
}

export function RecurringModal({ isOpen, onClose, onSubmit }: RecurringModalProps) {
  const [category, setCategory] = useState<'subscription' | 'contract'>('subscription');
  const [type, setType] = useState<OperationType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('1');
  const [totalParcels, setTotalParcels] = useState('12');
  const [paidParcels, setPaidParcels] = useState('0');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      category,
      type,
      description,
      amount: parseFloat(amount),
      day: parseInt(day),
      totalParcels: category === 'contract' ? parseInt(totalParcels) : undefined,
      paidParcels: category === 'contract' ? parseInt(paidParcels) : undefined,
    });
    // Reset
    setDescription('');
    setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-xl font-bold dark:text-white">Novo item recorrente</h3>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setCategory('subscription')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest",
                    category === 'subscription' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Assinatura
                </button>
                <button 
                  type="button" 
                  onClick={() => setCategory('contract')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest",
                    category === 'contract' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Contrato
                </button>
              </div>

              <div className="flex gap-2 p-1.5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 py-2 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest",
                    type === 'expense' ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Pagar
                </button>
                <button 
                  type="button" 
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 py-2 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest",
                    type === 'income' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Receber
                </button>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  required 
                  placeholder="Nome (Ex: Netflix, Salário, Financiamento)" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-white"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="Valor / Mês" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 font-bold transition-all dark:text-white"
                    />
                  </div>
                  <input 
                    type="number" 
                    min="1" 
                    max="31"
                    required 
                    placeholder="Dia Vencimento" 
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-white"
                  />
                </div>

                <AnimatePresence>
                  {category === 'contract' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-2 gap-4 overflow-hidden pt-4"
                    >
                      <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5 ml-2">Total de Parcelas</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 48" 
                          value={totalParcels}
                          onChange={e => setTotalParcels(e.target.value)}
                          className="w-full px-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5 ml-2">Parcelas Pagas</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 0" 
                          value={paidParcels}
                          onChange={e => setPaidParcels(e.target.value)}
                          className="w-full px-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 py-5 rounded-2xl text-white font-bold transition-all active:scale-[0.98] shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-[0.15em] text-xs"
              >
                Salvar Item Fixo
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
