import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import type { Transaction, BudgetCategory, PortfolioPosition, Transfer, Goal } from '../types';

const STORAGE_DIR = FileSystem.documentDirectory + 'fintrack/';

const PATHS = {
  transactions: STORAGE_DIR + 'transactions.json',
  budgetCategories: STORAGE_DIR + 'budgetCategories.json',
  portfolioPositions: STORAGE_DIR + 'portfolioPositions.json',
  transfers: STORAGE_DIR + 'transfers.json',
  goals: STORAGE_DIR + 'goals.json',
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

interface User {
  name: string;
  email: string;
  plan: string;
}

export interface AppState {
  isDarkMode: boolean;
  isAuthenticated: boolean;
  user: User | null;
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  portfolioPositions: PortfolioPosition[];
  transfers: Transfer[];
  goals: Goal[];
  hydrated: boolean;
  toggleDarkMode: () => void;
  setAuth: (isAuthenticated: boolean, user: User | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addPortfolioPosition: (position: PortfolioPosition) => Promise<void>;
  addTransfer: (transfer: Transfer) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoalSavings: (goalId: string, amount: number) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: true,
  isAuthenticated: false,
  user: null,
  transactions: [],
  budgetCategories: DEFAULT_BUDGET_CATEGORIES,
  portfolioPositions: [],
  transfers: [],
  goals: [],
  hydrated: false,

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),

  logout: () => set({
    isAuthenticated: false,
    user: null,
    transactions: [],
    budgetCategories: DEFAULT_BUDGET_CATEGORIES,
    portfolioPositions: [],
    transfers: [],
    goals: [],
  }),

  hydrate: async () => {
    try {
      const [transactions, budgetCategories, portfolioPositions, transfers, goals] = await Promise.all([
        readJSON<Transaction[]>(PATHS.transactions, []),
        readJSON<BudgetCategory[]>(PATHS.budgetCategories, DEFAULT_BUDGET_CATEGORIES),
        readJSON<PortfolioPosition[]>(PATHS.portfolioPositions, []),
        readJSON<Transfer[]>(PATHS.transfers, []),
        readJSON<Goal[]>(PATHS.goals, []),
      ]);
      set({ transactions, budgetCategories, portfolioPositions, transfers, goals, hydrated: true });
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

  addTransfer: async (transfer) => {
    const current = get().transfers;
    const updated = [transfer, ...current];
    set({ transfers: updated });
    await writeJSON(PATHS.transfers, updated);
  },

  addGoal: async (goal) => {
    const current = get().goals;
    const updated = [goal, ...current];
    set({ goals: updated });
    await writeJSON(PATHS.goals, updated);
  },

  updateGoalSavings: async (goalId, amount) => {
    const goals = get().goals;
    const updated = goals.map((g) =>
      g.id === goalId
        ? { ...g, savedAmount: Math.min(g.savedAmount + amount, g.targetAmount) }
        : g
    );
    set({ goals: updated });
    await writeJSON(PATHS.goals, updated);
  },

  completeGoal: async (goalId) => {
    const goals = get().goals;
    const updated = goals.map((g) =>
      g.id === goalId ? { ...g, status: 'completed' as const } : g
    );
    set({ goals: updated });
    await writeJSON(PATHS.goals, updated);
  },
}));