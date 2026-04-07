import { useAppStore } from '../../store/appStore';
import { Colors } from '../../constants/tokens';
import type { AppState } from '../../store/appStore';

export function useTheme() {
  const isDarkMode = useAppStore((s: AppState) => s.isDarkMode);

  return {
    isDarkMode,
    bg: isDarkMode ? Colors.darkBg : Colors.lightBg,
    surfaceSolid: isDarkMode ? Colors.darkSurface : Colors.lightSurface,
    textPrimary: isDarkMode ? Colors.textPrimaryDark : Colors.textPrimaryLight,
    textSecondary: isDarkMode ? Colors.textSecondaryDark : Colors.textSecondaryLight,
    border: isDarkMode ? Colors.borderDark : Colors.borderLight,
  };
}