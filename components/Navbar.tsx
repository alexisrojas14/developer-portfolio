"use client";

import { useRef, useState, useEffect } from "react";
import { Languages, Star } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

const SECTIONS = [
  { id: "hero", label: { es: "Inicio", en: "Home" } },
  { id: "about", label: { es: "Sobre mí", en: "About" } },
  { id: "tech", label: { es: "Tecnologías", en: "Tech Stack" } },
  { id: "experience", label: { es: "Experiencia", en: "Experience" } },
  { id: "projects", label: { es: "Proyectos", en: "Projects" } },
  { id: "education", label: { es: "Formación", en: "Education" } },
  { id: "extra", label: { es: "Extra", en: "Extra" } },
  { id: "contact", label: { es: "Contáctame", en: "Contact Me" } },
];

interface NavbarProps {
  lang: "es" | "en";
  onLangChange: (lang: "es" | "en") => void;
}

export default function Navbar({ lang, onLangChange }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const [heroVisible, setHeroVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handler = () => {
      const current = window.scrollY;
      const diff = current - lastScroll.current;
      if (diff > 8) setVisible(false);
      else if (diff < -8) setVisible(true);
      lastScroll.current = current;
      setHeroVisible(current < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-background/70 transition-transform duration-350 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between h-14">
        <button
          onClick={() => scrollTo("hero")}
          className={`flex items-center gap-2.5 cursor-pointer group transition-all duration-400 ease-out ${
            heroVisible ? "opacity-0 scale-60 -translate-x-5 pointer-events-none" : "opacity-100 scale-100 translate-x-0"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5 shrink-0 group-hover:shadow-[0_0_12px_var(--primary)] transition-shadow duration-300">
            <div className="w-full h-full rounded-full bg-background overflow-hidden relative">
              <Image src="/FotoCristianR.png" alt="" fill className="object-cover" sizes="32px" />
            </div>
          </div>
          <span className="text-sm font-sans font-semibold text-foreground hidden sm:block">
            Alexis Rojas
          </span>
        </button>

        <div className="flex items-center gap-0.5 md:gap-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="relative text-xs md:text-sm font-mono text-muted hover:text-primary transition-colors duration-200 whitespace-nowrap px-1.5 md:px-2.5 py-1.5 group"
            >
              {`// ${s.label[lang]}`}
              <span className="absolute inset-x-1 -bottom-px h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onLangChange(lang === "es" ? "en" : "es")} className="group relative p-2 rounded-full text-muted hover:text-primary hover:bg-card/50 transition-colors" aria-label={lang === "es" ? "Cambiar idioma" : "Toggle language"}>
            <Languages size={16} />
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-primary bg-card border border-card-border px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {lang === "es" ? "EN" : "ES"}
            </span>
          </button>
          <a href="https://github.com/alexisrojas14/developer-portfolio" target="_blank" rel="noopener noreferrer" className="group relative p-2 rounded-full text-muted hover:text-primary hover:bg-card/50 transition-colors" aria-label={lang === "es" ? "Dar estrella al repositorio en GitHub" : "Give a star to the repository on GitHub"}>
            <Star size={14} />
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-primary bg-card border border-card-border px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {lang === "es" ? "Estrella ⭐" : "Star ⭐"}
            </span>
          </a>
          <ThemeToggle lang={lang} />
        </div>
      </div>
    </nav>
  );
}
