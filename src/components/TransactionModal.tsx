import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent } from 'react';
import { OperationType, Transaction } from '../types';
import { cn } from '../lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, 'id'>) => void;
}

export function TransactionModal({ isOpen, onClose, onSubmit }: TransactionModalProps) {
  const [type, setType] = useState<OperationType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Alimentação');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      description,
      amount: parseFloat(amount),
      date,
      category,
      origin: 'manual'
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
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Mais um lançamento?</h3>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-[0.1em]",
                    type === 'expense' ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Despesa
                </button>
                <button 
                  type="button" 
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-[0.1em]",
                    type === 'income' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Receita
                </button>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  required 
                  placeholder="O que você comprou ou recebeu?" 
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
                      placeholder="0,00" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 font-bold transition-all dark:text-white"
                    />
                  </div>
                  <input 
                    type="date" 
                    required 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-white"
                  />
                </div>

                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-white appearance-none"
                >
                  <option value="Alimentação">🛒 Alimentação</option>
                  <option value="Moradia">🏠 Moradia</option>
                  <option value="Transporte">🚗 Transporte</option>
                  <option value="Lazer">🍿 Lazer / Estilo de Vida</option>
                  <option value="Saúde">⚕️ Saúde</option>
                  <option value="Trabalho">💼 Trabalho / Bônus</option>
                  <option value="Investimentos">📈 Investimentos</option>
                  <option value="Outros">✨ Outros</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 py-5 rounded-2xl text-white font-bold transition-all active:scale-[0.98] shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-[0.15em] text-xs"
              >
                Confirmar Lançamento
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
