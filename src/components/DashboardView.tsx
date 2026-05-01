import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Transaction, RecurringItem } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

interface DashboardViewProps {
  transactions: Transaction[];
  recurring: RecurringItem[];
  privacyMode: boolean;
}

export function DashboardView({ transactions, recurring, privacyMode }: DashboardViewProps) {
  const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const debt = recurring
    .filter(r => r.category === 'contract' && r.type === 'expense')
    .reduce((acc, c) => acc + ((c.totalParcels! - c.paidParcels!) * c.amount), 0);

  const stats = [
    { label: 'Saldo em Conta', value: balance, color: 'text-slate-900 dark:text-white', border: 'border-slate-200' },
    { label: 'Total Receitas', value: income, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500' },
    { label: 'Total Despesas', value: expense, color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500' },
    { label: 'Dívida / Comprometido', value: debt, color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500' },
  ];

  // Prepare chart data
  const categoriesMap: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
  });

  const pieData = Object.keys(categoriesMap).map(key => ({
    name: key,
    value: categoriesMap[key],
  }));

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#fbbf24', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={cn(
            "bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md",
            i > 0 && `border-l-4`
          )} style={{ borderLeftColor: i > 0 ? (stat.border.includes('emerald') ? '#10b981' : stat.border.includes('rose') ? '#f43f5e' : '#fbbf24') : undefined }}>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
            <h3 className={cn(
              "text-2xl font-bold tracking-tight transition-all duration-300",
              stat.color,
              privacyMode && "blur-md select-none"
            )}>
              {formatCurrency(stat.value)}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-slate-800 dark:text-white">Fluxo Diário Recente</h4>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactions.slice(0, 7).reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#FFF'
                  }}
                  itemStyle={{ color: '#818CF8' }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-slate-800 dark:text-white">Gastos por Categoria</h4>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'Vazio', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                  {pieData.length === 0 && <Cell fill="#E2E8F0" />}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
