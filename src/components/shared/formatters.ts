import { Colors } from '../../constants/tokens';
import type { AssetType } from '../../types';

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getBudgetColor(spent: number, limit: number): string {
  const ratio = spent / limit;
  if (ratio >= 1) return Colors.danger;
  if (ratio >= 0.7) return Colors.warning;
  return Colors.brand;
}

export function getAssetColor(type: AssetType): string {
  const map: Record<AssetType, string> = {
    etf: Colors.portfolio,
    crypto: Colors.crypto,
    stock: Colors.danger,
    fund: Colors.brand,
  };
  return map[type];
}