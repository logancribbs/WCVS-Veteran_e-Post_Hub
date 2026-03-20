"use client";

import { useEffect, useMemo, useState } from "react";
import { christmasTheme } from "./christmasTheme";
import { defaultTheme } from "./defaultTheme";
import { fourthOfJulyTheme } from "./fourthOfJulyTheme";
import { LandingTheme, ThemeName, ThemeOverride } from "./types";

export const landingThemes: Record<ThemeName, LandingTheme> = {
  default: defaultTheme,
  fourthOfJuly: fourthOfJulyTheme,
  christmas: christmasTheme,
};

export function isValidThemeOverride(value: string): value is ThemeOverride {
  return value === "auto" || value === "default" || value === "fourthOfJuly" || value === "christmas";
}

export function resolveAutoTheme(date = new Date()): LandingTheme {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Christmas: Dec 1 through Dec 31
  if (month === 12 && day >= 1) {
    return christmasTheme;
  }

  // 4th of July: June 27 through July 7
  if ((month === 6 && day >= 27) || (month === 7 && day <= 7)) {
    return fourthOfJulyTheme;
  }

  return defaultTheme;
}

export function resolveThemeFromOverride(override: ThemeOverride): LandingTheme {
  if (override === "auto") {
    return resolveAutoTheme();
  }

  return landingThemes[override];
}

export function useLandingTheme() {
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>("auto");

  useEffect(() => {
    async function fetchThemeOverride() {
      try {
        const response = await fetch("/api/theme", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();

        if (typeof data.override === "string" && isValidThemeOverride(data.override)) {
          setThemeOverride(data.override);
        }
      } catch {}
    }

    fetchThemeOverride();
  }, []);

  const theme = useMemo(() => resolveThemeFromOverride(themeOverride), [themeOverride]);

  return {
    theme,
    themeOverride,
    setThemeOverride,
  };
}