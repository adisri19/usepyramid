"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColorMode = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";

interface ThemeCtx {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (t: Theme) => void;
  setColorMode: (c: ColorMode) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorMode, setColorModeState] = useState<ColorMode>("blue");

  useEffect(() => {
    const t = (localStorage.getItem("pyramid-theme") as Theme) || "light";
    const c = (localStorage.getItem("pyramid-color") as ColorMode) || "blue";
    setThemeState(t);
    setColorModeState(c);
    document.documentElement.classList.toggle("dark", t === "dark");
    document.documentElement.setAttribute("data-color", c);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("pyramid-theme", t);
    document.cookie = `pyramid-theme=${t}; path=/; max-age=31536000`;
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  const setColorMode = (c: ColorMode) => {
    setColorModeState(c);
    localStorage.setItem("pyramid-color", c);
    document.cookie = `pyramid-color=${c}; path=/; max-age=31536000`;
    document.documentElement.setAttribute("data-color", c);
  };

  return (
    <Ctx.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
