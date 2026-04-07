import type {
  Transaction,
  BudgetCategory,
  PortfolioPosition,
  MonthlyMetric,
  Report,
  LinkedAccount,
} from '../types';

export const mockTransactions: Transaction[] = [
  { id: '1', name: 'Nomina marzo', category: 'Ingreso', amount: 4500000, type: 'income', date: '2026-03-30', icon: 'briefcase-outline' },
  { id: '2', name: 'Supermercado Exito', category: 'Alimentacion', amount: 187000, type: 'expense', date: '2026-03-29', icon: 'cart-outline' },
  { id: '3', name: 'Netflix', category: 'Entretenimiento', amount: 47900, type: 'expense', date: '2026-03-28', icon: 'play-circle-outline' },
  { id: '4', name: 'Freelance web', category: 'Ingreso', amount: 800000, type: 'income', date: '2026-03-27', icon: 'laptop-outline' },
  { id: '5', name: 'Uber', category: 'Transporte', amount: 23500, type: 'expense', date: '2026-03-26', icon: 'car-outline' },
];

export const mockBudgetCategories: BudgetCategory[] = [
  { id: '1', name: 'Alimentacion', icon: 'restaurant-outline', spent: 420000, limit: 600000, transactionCount: 12 },
  { id: '2', name: 'Transporte', icon: 'car-outline', spent: 195000, limit: 200000, transactionCount: 8 },
  { id: '3', name: 'Entretenimiento', icon: 'game-controller-outline', spent: 215000, limit: 200000, transactionCount: 5 },
  { id: '4', name: 'Salud', icon: 'medkit-outline', spent: 80000, limit: 300000, transactionCount: 2 },
  { id: '5', name: 'Educacion', icon: 'book-outline', spent: 150000, limit: 400000, transactionCount: 3 },
];

export const mockPortfolioPositions: PortfolioPosition[] = [
  { id: '1', name: 'S&P 500 ETF', description: '12.5 unidades', currentPrice: 5842.30, returnPercent: 8.4, type: 'etf' },
  { id: '2', name: 'Bitcoin', description: '0.042 BTC', currentPrice: 87420.00, returnPercent: 23.1, type: 'crypto' },
  { id: '3', name: 'Tesla', description: '8 acciones', currentPrice: 248.75, returnPercent: -4.2, type: 'stock' },
  { id: '4', name: 'Fondo Renta Fija', description: '500 cuotas', currentPrice: 1124.50, returnPercent: 5.8, type: 'fund' },
];

export const mockMonthlyMetrics: MonthlyMetric[] = [
  { month: 'Oct', income: 4800000, expenses: 3200000 },
  { month: 'Nov', income: 5100000, expenses: 3600000 },
  { month: 'Dic', income: 6200000, expenses: 4800000 },
  { month: 'Ene', income: 4500000, expenses: 3100000 },
  { month: 'Feb', income: 5300000, expenses: 3400000 },
  { month: 'Mar', income: 5300000, expenses: 3280000 },
];

export const mockReports: Report[] = [
  { id: '1', title: 'Estado de resultados', format: 'PDF' },
  { id: '2', title: 'Flujo de caja', format: 'XLS' },
];

export const mockLinkedAccounts: LinkedAccount[] = [
  { id: '1', bankName: 'Bancolombia', accountNumber: '****4872', isActive: true },
  { id: '2', bankName: 'Nequi', accountNumber: '****1234', isActive: true },
];