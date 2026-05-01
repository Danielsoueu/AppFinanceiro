import { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { MonthView } from './components/MonthView';
import { RecurringView } from './components/RecurringView';
import { TransactionsView } from './components/TransactionsView';
import { SettingsView } from './components/SettingsView';
import { TransactionModal } from './components/TransactionModal';
import { RecurringModal } from './components/RecurringModal';
import { useFinance } from './hooks/useFinance';
import { runTests } from './lib/tests';
import { useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      runTests();
    }
  }, []);

  const {
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
    isInstallable
  } = useFinance();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      theme={state.theme}
      toggleTheme={toggleTheme}
      privacyMode={state.privacyMode}
      togglePrivacy={togglePrivacy}
      notifications={notifications}
      openTransactionModal={() => setIsTxModalOpen(true)}
    >
      {activeTab === 'dashboard' && (
        <DashboardView 
          transactions={state.transactions} 
          recurring={state.recurring} 
          privacyMode={state.privacyMode}
        />
      )}
      {activeTab === 'month' && (
        <MonthView 
          transactions={state.transactions} 
          recurring={state.recurring} 
          privacyMode={state.privacyMode}
          processRecurringPayment={processRecurringPayment}
        />
      )}
      {activeTab === 'recurring' && (
        <RecurringView 
          recurring={state.recurring} 
          deleteRecurring={deleteRecurring}
          openRecurringModal={() => setIsRecModalOpen(true)}
          privacyMode={state.privacyMode}
        />
      )}
      {activeTab === 'transactions' && (
        <TransactionsView 
          transactions={state.transactions} 
          deleteTransaction={deleteTransaction}
          privacyMode={state.privacyMode}
        />
      )}
      {activeTab === 'settings' && (
        <SettingsView 
          state={state} 
          installApp={installApp} 
          isInstallable={isInstallable} 
        />
      )}

      <TransactionModal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)} 
        onSubmit={addTransaction}
      />

      <RecurringModal 
        isOpen={isRecModalOpen} 
        onClose={() => setIsRecModalOpen(false)} 
        onSubmit={addRecurring}
      />
    </Layout>
  );
}
