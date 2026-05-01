export type OperationType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: OperationType;
  description: string;
  amount: number;
  date: string;
  category: string;
  recurringId?: string;
  origin: 'manual' | 'system';
}

export interface RecurringItem {
  id: string;
  category: 'subscription' | 'contract';
  type: OperationType;
  description: string;
  amount: number;
  day: number;
  totalParcels?: number;
  paidParcels?: number;
}

export interface FinanceState {
  transactions: Transaction[];
  recurring: RecurringItem[];
  theme: 'light' | 'dark';
  privacyMode: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
