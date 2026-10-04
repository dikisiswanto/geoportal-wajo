"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";

const THEME_STORAGE_KEY = "wajo-theme";

function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Prefer the active in-memory theme when storage is unavailable.
  }
}

export default function ThemeToggle() {
  const toggleTheme = (event) => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    const label = nextTheme === "dark" ? "Gunakan mode terang" : "Gunakan mode gelap";
    event.currentTarget.setAttribute("aria-label", label);
    event.currentTarget.setAttribute("title", label);
  };

  return (
    <button
      type="button"
      className="theme-toggle ui-icon-button relative grid size-10 shrink-0 place-items-center rounded-md bg-white/95 text-slate-700 shadow-sm ring-1 ring-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      onClick={toggleTheme}
      aria-label="Ganti mode tampilan"
      title="Ganti mode tampilan"
    >
      <span className="theme-toggle-icon theme-toggle-icon-sun" aria-hidden="true">
        <IconSun size={18} stroke={1.8} />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon-moon" aria-hidden="true">
        <IconMoon size={18} stroke={1.8} />
      </span>
      <span className="sr-only">Ganti mode tampilan terang dan gelap</span>
    </button>
  );
}
