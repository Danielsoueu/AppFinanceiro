import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { Transaction, RecurringItem, FinanceState, Notification } from '../types';

const DB_NAME = 'solofinance_db';
const STORE_NAME = 'finance_state';

export function useFinance() {
  const [state, setState] = useState<FinanceState>({
    transactions: [],
    recurring: [],
    theme: 'light',
    privacyMode: false,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Initialize DB and load state
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    async function initDB() {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME);
        },
      });

      const savedState = await db.get(STORE_NAME, 'current_state');
      // Migration from localStorage if exists
      const oldStorage = localStorage.getItem('solofinance_state');
      
      if (!savedState && oldStorage) {
        const parsed = JSON.parse(oldStorage);
        setState(parsed);
        await db.put(STORE_NAME, parsed, 'current_state');
        localStorage.removeItem('solofinance_state');
      } else if (savedState) {
        setState(savedState);
      }
      setIsLoaded(true);
    }
    initDB();
  }, []);

  // Sync state to IndexedDB
  useEffect(() => {
    if (!isLoaded) return;
    async function sync() {
      const db = await openDB(DB_NAME, 1);
      await db.put(STORE_NAME, state, 'current_state');
    }
    sync();

    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state, isLoaded]);

  const hapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    hapticFeedback();
    const newTx = { ...tx, id: Math.random().toString(36).substring(2, 9) };
    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
    addNotification('Lançamento adicionado com sucesso', 'success');
  }, [addNotification, hapticFeedback]);

  const deleteTransaction = useCallback((id: string) => {
    hapticFeedback();
    setState(prev => {
      const tx = prev.transactions.find(t => t.id === id);
      const newState = {
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id),
      };

      if (tx?.recurringId) {
        newState.recurring = prev.recurring.map(r => {
          if (r.id === tx.recurringId && r.category === 'contract') {
            return { ...r, paidParcels: Math.max(0, (r.paidParcels || 0) - 1) };
          }
          return r;
        });
      }
      return newState;
    });
    addNotification('Lançamento removido', 'info');
  }, [addNotification, hapticFeedback]);

  const addRecurring = useCallback((item: Omit<RecurringItem, 'id'>) => {
    hapticFeedback();
    const newItem = { ...item, id: Math.random().toString(36).substring(2, 9) };
    setState(prev => ({
      ...prev,
      recurring: [...prev.recurring, newItem],
    }));
    addNotification('Item fixo configurado', 'success');
  }, [addNotification, hapticFeedback]);

  const deleteRecurring = useCallback((id: string) => {
    hapticFeedback();
    setState(prev => ({
      ...prev,
      recurring: prev.recurring.filter(r => r.id !== id),
    }));
    addNotification('Item fixo removido', 'info');
  }, [addNotification, hapticFeedback]);

  const toggleTheme = useCallback(() => {
    hapticFeedback();
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, [hapticFeedback]);

  const togglePrivacy = useCallback(() => {
    hapticFeedback();
    setState(prev => ({ ...prev, privacyMode: !prev.privacyMode }));
  }, [hapticFeedback]);

  const processRecurringPayment = useCallback((recId: string) => {
    hapticFeedback();
    const today = new Date();
    const monthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
    setState(prev => {
      const rec = prev.recurring.find(r => r.id === recId);
      if (!rec) return prev;

      const alreadyPaid = prev.transactions.some(t => t.recurringId === recId && t.date.startsWith(monthKey));

      if (alreadyPaid) {
        const newState = {
          ...prev,
          transactions: prev.transactions.filter(t => !(t.recurringId === recId && t.date.startsWith(monthKey))),
        };
        if (rec.category === 'contract') {
          newState.recurring = prev.recurring.map(r => 
            r.id === recId ? { ...r, paidParcels: Math.max(0, (r.paidParcels || 0) - 1) } : r
          );
        }
        return newState;
      } else {
        let descSuffix = '';
        const updatedRec = { ...rec };
        if (rec.category === 'contract') {
          if ((rec.paidParcels || 0) >= (rec.totalParcels || 0)) return prev;
          updatedRec.paidParcels = (rec.paidParcels || 0) + 1;
          descSuffix = ` (Parc. ${updatedRec.paidParcels}/${rec.totalParcels})`;
        }

        const newTx: Transaction = {
          id: Math.random().toString(36).substring(2, 9),
          recurringId: recId,
          type: rec.type,
          description: rec.description + descSuffix,
          amount: rec.amount,
          date: `${monthKey}-${rec.day.toString().padStart(2, '0')}`,
          category: rec.category === 'contract' ? 'Contrato' : 'Assinatura',
          origin: 'system',
        };

        return {
          ...prev,
          transactions: [newTx, ...prev.transactions],
          recurring: prev.recurring.map(r => r.id === recId ? updatedRec : r),
        };
      }
    });
  }, [hapticFeedback]);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      addNotification('App instalado com sucesso!', 'success');
    }
  }, [deferredPrompt, addNotification]);

  return {
    state,
    notifications,
    addTransaction,
    deleteTransaction,
    addRecurring,
    deleteRecurring,
    toggleTheme,
    togglePrivacy,
    processRecurringPayment,
    isLoaded,
    installApp,
    isInstallable: !!deferredPrompt
  };
}
