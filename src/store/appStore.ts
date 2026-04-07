import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import type { Transaction, BudgetCategory, PortfolioPosition } from '../types';

const STORAGE_DIR = FileSystem.documentDirectory + 'fintrack/';

const PATHS = {
  transactions: STORAGE_DIR + 'transactions.json',
  budgetCategories: STORAGE_DIR + 'budgetCategories.json',
  portfolioPositions: STORAGE_DIR + 'portfolioPositions.json',
};

const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: '1', name: 'Alimentacion', icon: 'restaurant-outline', spent: 0, limit: 600000, transactionCount: 0 },
  { id: '2', name: 'Transporte', icon: 'car-outline', spent: 0, limit: 200000, transactionCount: 0 },
  { id: '3', name: 'Entretenimiento', icon: 'game-controller-outline', spent: 0, limit: 200000, transactionCount: 0 },
  { id: '4', name: 'Salud', icon: 'medkit-outline', spent: 0, limit: 300000, transactionCount: 0 },
  { id: '5', name: 'Educacion', icon: 'book-outline', spent: 0, limit: 400000, transactionCount: 0 },
];

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(STORAGE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
  }
}

async function readJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return fallback;
    const raw = await FileSystem.readAsStringAsync(path);
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(path: string, data: unknown) {
  await ensureDir();
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
}

export interface AppState {
  isDarkMode: boolean;
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  portfolioPositions: PortfolioPosition[];
  hydrated: boolean;
  toggleDarkMode: () => void;
  hydrate: () => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addPortfolioPosition: (position: PortfolioPosition) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: true,
  transactions: [],
  budgetCategories: DEFAULT_BUDGET_CATEGORIES,
  portfolioPositions: [],
  hydrated: false,

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  hydrate: async () => {
    try {
      const [transactions, budgetCategories, portfolioPositions] = await Promise.all([
        readJSON<Transaction[]>(PATHS.transactions, []),
        readJSON<BudgetCategory[]>(PATHS.budgetCategories, DEFAULT_BUDGET_CATEGORIES),
        readJSON<PortfolioPosition[]>(PATHS.portfolioPositions, []),
      ]);
      set({ transactions, budgetCategories, portfolioPositions, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  addTransaction: async (tx) => {
    const current = get().transactions;
    const updatedTransactions = [tx, ...current];
    set({ transactions: updatedTransactions });
    await writeJSON(PATHS.transactions, updatedTransactions);

    if (tx.type === 'expense') {
      const categories = get().budgetCategories;
      const updatedCategories = categories.map((cat) =>
        cat.name === tx.category
          ? { ...cat, spent: cat.spent + tx.amount, transactionCount: cat.transactionCount + 1 }
          : cat
      );
      set({ budgetCategories: updatedCategories });
      await writeJSON(PATHS.budgetCategories, updatedCategories);
    }
  },

  addPortfolioPosition: async (position) => {
    const current = get().portfolioPositions;
    const updated = [position, ...current];
    set({ portfolioPositions: updated });
    await writeJSON(PATHS.portfolioPositions, updated);
  },
}));