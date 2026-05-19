"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Download } from "lucide-react";
import es from "../public/locales/es/hero.json";
import en from "../public/locales/en/hero.json";

interface HeroProps {
  lang: "es" | "en";
  onLangChange?: (lang: "es" | "en") => void;
}

export default function Hero({ lang }: HeroProps) {
  const hero = lang === "es" ? es : en;
  const avatarRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      avatarRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fullText = hero.greeting;
    const el = typeRef.current;
    if (!el) return;

    let animationId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    const doType = () => {
      let charIndex = 0;
      el.textContent = "";
      let lastTime = 0;

      const type = (timestamp: number) => {
        if (timestamp - lastTime >= 60) {
          el.textContent = fullText.slice(0, charIndex);
          charIndex++;
          lastTime = timestamp;
        }
        if (charIndex <= fullText.length) {
          animationId = requestAnimationFrame(type);
        }
      };

      animationId = requestAnimationFrame(type);
    };

    doType();
    timeoutId = setTimeout(doType, 8000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);
    };
  }, [hero.greeting]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden bg-gradient-to-br from-background via-card to-background animate-fade-in-up"
    >
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>

      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "var(--blob-primary)" }} />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "var(--blob-secondary)" }} />

      <div
        ref={avatarRef}
        className="bg-gradient-to-r from-primary to-secondary p-[3px] rounded-full mb-8 w-[156px] h-[156px] animate-glow-pulse"
        style={{ transition: "transform 0.1s ease-out" }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-background">
          <Image src="/FotoCristianR.png" alt="" width={150} height={150} priority className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="animate-fade-in-up-1 font-mono text-code-green text-lg md:text-2xl lg:text-3xl h-8 md:h-10 lg:h-12 mb-4 text-center">
        <span ref={typeRef} /><span className="animate-pulse">|</span>
      </div>

      <h1 className="animate-fade-in-up font-sans font-extrabold text-4xl md:text-6xl text-center mb-6">
        <span className="text-foreground">{hero.name_prefix} </span>
        <span className="bg-gradient-to-r from-foreground via-secondary to-primary bg-clip-text text-transparent">{hero.name}</span>
      </h1>

      <div className="animate-fade-in-up-3 bg-card/80 backdrop-blur-sm border border-code-green text-code-green rounded-full px-5 py-2 font-sans text-sm mb-8 flex items-center shadow-[0_0_15px_rgba(126,231,135,0.15)]">
        <span className="w-2 h-2 rounded-full bg-code-green animate-pulse mr-2 flex-shrink-0 shadow-[0_0_6px_#7ee787]" />
        {hero.status}
      </div>

      <p className="animate-fade-in-up-4 text-muted font-sans max-w-2xl text-center text-base md:text-lg mb-8 leading-relaxed">
        {hero.role}
      </p>

      <div className="animate-fade-in-up-5 flex items-center gap-6">
        <a href="https://www.linkedin.com/in/alexis-rojas-b72319303" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-primary transition-all duration-300 hover:drop-shadow-[0_0_8px_var(--primary)] hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="https://github.com/alexisrojas14" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-primary transition-all duration-300 hover:drop-shadow-[0_0_8px_var(--primary)] hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>
        <a href="/HV_Alexis_Rojas_Mayo2026.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 text-primary text-xs font-mono hover:bg-primary/10 hover:border-primary hover:drop-shadow-[0_0_8px_var(--primary)] transition-all duration-300">
          <Download size={16} />
          <span className="tracking-wider">{hero.cv_label}</span>
        </a>
      </div>

      <button
        onClick={() => scrollTo("about")}
        className="animate-fade-in-up-6 absolute bottom-10 flex flex-col items-center gap-1 cursor-pointer group"
      >
        <span className="text-xs font-mono text-primary tracking-widest animate-pulse group-hover:drop-shadow-[0_0_8px_var(--primary)] transition-all duration-300">
          {hero.press_start}
        </span>
        <ChevronDown size={24} className="text-primary animate-bounce group-hover:drop-shadow-[0_0_8px_var(--primary)] transition-all duration-300" />
      </button>
    </section>
  );
}
