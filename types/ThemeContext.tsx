import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getThemeColors, ThemeColors, ThemeName } from "@/constants/Color";

type ThemeContextValue = {
  theme: ThemeName;
  toggleTheme: () => Promise<void>;
};

const STORAGE_KEY = "app_theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const initialTheme: ThemeName = saved === "light" ? "light" : "dark";
        if (mounted) setTheme(initialTheme);
      } catch {
        if (mounted) setTheme("dark");
      } finally {
        if (mounted) setReady(true);
      }
    };

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = async () => {
    const nextTheme: ThemeName = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    await AsyncStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme]
  );

  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

export function useThemeColors() {
  const { theme } = useTheme();
  return useMemo(() => getThemeColors(theme), [theme]);
}

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { theme } = useTheme();
  return useMemo(() => factory(getThemeColors(theme)), [factory, theme]);
}
