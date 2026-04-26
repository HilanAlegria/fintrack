export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  icon: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  spent: number;
  limit: number;
  transactionCount: number;
}

export type AssetType = 'etf' | 'crypto' | 'stock' | 'fund';

export interface PortfolioPosition {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  returnPercent: number;
  type: AssetType;
}

export interface MonthlyMetric {
  month: string;
  income: number;
  expenses: number;
}

export interface Report {
  id: string;
  title: string;
  format: 'PDF' | 'XLS';
}

export interface LinkedAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  isActive: boolean;
}

export interface Transfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  note: string;
}

export type GoalStatus = 'active' | 'completed';

export interface Goal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  status: GoalStatus;
}