// useClient: necesario para useTheme y evitar hydration mismatch
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// ThemeToggle: botón que alterna entre tema oscuro y claro usando next-themes
export function ThemeToggle({ lang }: { lang?: "es" | "en" }) {
  const { theme, setTheme } = useTheme();
  // mounted: evita hydration mismatch al renderizar en cliente
  const [mounted, setMounted] = useState(false);

  // useEffect: marca como mounted tras el primer render del lado del cliente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Placeholder: evita destello del icono incorrecto durante SSR
  if (!mounted) {
    return <div className="w-10 h-10" />; // placeholder
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-neon z-50"
      aria-label={lang === "es" ? "Cambiar tema" : "Toggle theme"}
      title={lang === "es" ? "Cambiar tema" : "Toggle theme"}
    >
      {/* Muestra Sol en modo oscuro (para cambiar a claro) y Luna en modo claro */}
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
