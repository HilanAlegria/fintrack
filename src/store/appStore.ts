
import { create } from 'zustand';
import type { Transaction, BudgetCategory, PortfolioPosition } from '../types';
import {
  mockTransactions,
  mockBudgetCategories,
  mockPortfolioPositions,
} from '../constants/mockData';

export interface AppState {
  isDarkMode: boolean;
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  portfolioPositions: PortfolioPosition[];
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: true,
  transactions: mockTransactions,
  budgetCategories: mockBudgetCategories,
  portfolioPositions: mockPortfolioPositions,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));