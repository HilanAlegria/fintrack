export function withAlpha(hex: string, alpha: number): string {
  const full = hex.replace('#', '');
  const normalized =
    full.length === 3
      ? full.split('').map((c) => c + c).join('')
      : full.slice(0, 6);

  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${normalized}${a}`;
}