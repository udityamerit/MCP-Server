"use client";

import { useState, useEffect } from "react";

export function usePreferences() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [lang, setLangState] = useState<"en" | "hi">("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("app_theme") as "light" | "dark" | null;
    const savedLang = localStorage.getItem("app_lang") as "en" | "hi" | null;

    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Check system preference
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = isSystemDark ? "dark" : "light";
      setThemeState(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }

    if (savedLang) {
      setLangState(savedLang);
    }

    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("app_theme") as "light" | "dark" | null;
      const currentLang = localStorage.getItem("app_lang") as "en" | "hi" | null;
      if (currentTheme) {
        setThemeState(currentTheme);
        document.documentElement.classList.toggle("dark", currentTheme === "dark");
      }
      if (currentLang) {
        setLangState(currentLang);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("preferences_update", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("preferences_update", handleStorageChange);
    };
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("app_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    window.dispatchEvent(new Event("preferences_update"));
  };

  const setLang = (newLang: "en" | "hi") => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    window.dispatchEvent(new Event("preferences_update"));
  };

  return { theme, setTheme, lang, setLang, mounted };
}
