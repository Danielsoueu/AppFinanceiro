import { CheckCircle, Circle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, RecurringItem } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface MonthViewProps {
  transactions: Transaction[];
  recurring: RecurringItem[];
  privacyMode: boolean;
  processRecurringPayment: (id: string) => void;
}

export function MonthView({ transactions, recurring, privacyMode, processRecurringPayment }: MonthViewProps) {
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  
  // Recurring items that should be shown in this month
  const activeRecurring = recurring.filter(r => {
    if (r.category === 'contract') return (r.paidParcels || 0) < (r.totalParcels || 0);
    return true;
  }).sort((a, b) => a.day - b.day);

  let mIncTotal = 0, mIncDone = 0;
  let mExpTotal = 0, mExpDone = 0;

  const agenda = activeRecurring.map(item => {
    const isPaid = transactions.some(t => t.recurringId === item.id && t.date.startsWith(monthKey));
    
    if (item.type === 'income') {
      mIncTotal += item.amount;
      if (isPaid) mIncDone += item.amount;
    } else {
      mExpTotal += item.amount;
      if (isPaid) mExpDone += item.amount;
    }

    return { ...item, isPaid };
  });

  // Include manual transactions of this month for projected balance
  const manualThisMonth = transactions.filter(t => t.origin === 'manual' && t.date.startsWith(monthKey));
  manualThisMonth.forEach(t => {
    if (t.type === 'income') {
      mIncTotal += t.amount;
      mIncDone += t.amount;
    } else {
      mExpTotal += t.amount;
      mExpDone += t.amount;
    }
  });

  const cards = [
    { label: 'Receitas Previstas', value: mIncTotal, done: mIncDone, color: 'text-emerald-600', border: 'border-emerald-500' },
    { label: 'Despesas Previstas', value: mExpTotal, done: mExpDone, color: 'text-rose-600', border: 'border-rose-500' },
    { label: 'Saldo Projetado', value: mIncTotal - mExpTotal, color: 'text-slate-900 dark:text-white', border: 'border-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm border-b-4" style={{ borderBottomColor: card.border.includes('emerald') ? '#10b981' : card.border.includes('rose') ? '#f43f5e' : '#6366f1' }}>
            <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.label}</h4>
            <p className={cn("text-3xl font-bold mt-2", card.color, privacyMode && "blur-md")}>{formatCurrency(card.value)}</p>
            {card.done !== undefined && (
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                {formatCurrency(card.done)} já realizado
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h4 className="font-bold text-slate-700 dark:text-slate-200">Agenda de Obrigações (Mês Atual)</h4>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {agenda.length > 0 ? agenda.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="text-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 min-w-[70px]">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Dia</p>
                  <p className="font-bold text-lg text-slate-700 dark:text-slate-200">{item.day}</p>
                </div>
                <div>
                  <p className={cn(
                    "font-bold text-lg",
                    item.isPaid ? 'text-slate-300 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-white'
                  )}>
                    {item.description}
                  </p>
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-widest mt-0.5">
                    {item.category === 'contract' ? 'Parcelamento Fixo' : 'Assinatura Recorrente'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className={cn(
                  "font-bold text-lg",
                  item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                  privacyMode && "blur-md"
                )}>
                  {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                </p>
                <button 
                  onClick={() => processRecurringPayment(item.id)}
                  className={cn(
                    "p-3 rounded-2xl transition-all active:scale-90",
                    item.isPaid 
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                  )}
                >
                  {item.isPaid ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-slate-400 dark:text-slate-600">
              Nenhuma obrigação recorrente encontrada para este mês.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
