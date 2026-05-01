import { Transaction, RecurringItem } from '../types';

/**
 * Robust API Service (Simulated)
 * In a real environment, these would be fetch/axios calls to a backend.
 */
export const FinanceAPI = {
  // Simulate fetching initial data from a server
  async fetchRemoteData(): Promise<{ transactions: Transaction[], recurring: RecurringItem[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactions: [],
          recurring: []
        });
      }, 1000);
    });
  },

  // Sync state to a remote server
  async syncData(data: { transactions: Transaction[], recurring: RecurringItem[] }): Promise<boolean> {
    console.log('Syncing data to remote API...', data);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },

  // Export to external format
  exportToCSV(transactions: Transaction[]) {
    const headers = ['ID', 'Type', 'Description', 'Amount', 'Date', 'Category'];
    const rows = transactions.map(t => [
      t.id, t.type, t.description, t.amount, t.date, t.category
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `extrato_solofinance_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
  }
};
