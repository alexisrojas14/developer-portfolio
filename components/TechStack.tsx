// useClient: necesario para tabs interactivas y animaciones con AnimatePresence
"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import {
  FaPython, FaReact, FaJava, FaDocker, FaLinux,
  FaGitAlt, FaGoogle, FaHtml5
} from "react-icons/fa";
import {
  SiSpringboot, SiFlask, SiTailwindcss, SiJavascript,
  SiNginx, SiPostgresql, SiMysql, SiAngular, SiNestjs,
  SiMongodb, SiTypescript, SiNextdotjs, SiFramer
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { SiGooglecloud, SiJirasoftware } from "react-icons/si";
import { GiBrain } from "react-icons/gi";

// TabId: define las categorías de filtro (todas, backend, frontend, devops)
type TabId = "all" | "backend" | "frontend" | "devops";

// TechItem: interfaz para cada tecnología con nombre, categoría, icono y nivel de habilidad
interface TechItem {
  id: string;
  name_es: string;
  name_en: string;
  category: Exclude<TabId, "all">;
  icon: ReactNode;
}

// TABS: define las pestañas con iconos y nombres tipo archivo (config, .py, .tsx, .sh)
const TABS: { id: TabId; label: Record<"es" | "en", string>; icon: ReactNode }[] = [
  { id: "all", label: { es: "todos.config", en: "all.config" }, icon: <Settings className="w-4 h-4" /> },
  { id: "backend", label: { es: "backend.py", en: "backend.py" }, icon: <FaPython className="w-4 h-4" /> },
  { id: "frontend", label: { es: "frontend.tsx", en: "frontend.tsx" }, icon: <FaReact className="w-4 h-4" /> },
  { id: "devops", label: { es: "devops.sh", en: "devops.sh" }, icon: <Terminal className="w-4 h-4" /> },
];

// TECH_ITEMS: lista completa de tecnologías organizadas por categoría
// NOTA: los datos están hardcodeados; podrían moverse a un archivo JSON/API para escalar
const TECH_ITEMS: TechItem[] = [
  // Backend
  { id: "python", name_es: "Python", name_en: "Python", category: "backend", icon: <FaPython /> },
  { id: "java", name_es: "Java", name_en: "Java", category: "backend", icon: <FaJava /> },
  { id: "springboot", name_es: "Spring Boot", name_en: "Spring Boot", category: "backend", icon: <SiSpringboot /> },
  { id: "flask", name_es: "Flask", name_en: "Flask", category: "backend", icon: <SiFlask /> },
  { id: "nestjs", name_es: "NestJS", name_en: "NestJS", category: "backend", icon: <SiNestjs /> },
  { id: "llm", name_es: "LLMs (Gemini, Locales)", name_en: "LLMs (Gemini, Local)", category: "backend", icon: <GiBrain /> },
  // Frontend
  { id: "react", name_es: "React", name_en: "React", category: "frontend", icon: <FaReact /> },
  { id: "nextjs", name_es: "Next.js", name_en: "Next.js", category: "frontend", icon: <SiNextdotjs /> },
  { id: "angular", name_es: "Angular", name_en: "Angular", category: "frontend", icon: <SiAngular /> },
  { id: "typescript", name_es: "TypeScript", name_en: "TypeScript", category: "frontend", icon: <SiTypescript /> },
  { id: "tailwind", name_es: "Tailwind CSS", name_en: "Tailwind CSS", category: "frontend", icon: <SiTailwindcss /> },
  { id: "html", name_es: "HTML", name_en: "HTML", category: "frontend", icon: <FaHtml5 /> },
  { id: "javascript", name_es: "JavaScript", name_en: "JavaScript", category: "frontend", icon: <SiJavascript /> },
  { id: "framer", name_es: "Framer Motion", name_en: "Framer Motion", category: "frontend", icon: <SiFramer /> },
  // DevOps
  { id: "docker", name_es: "Docker", name_en: "Docker", category: "devops", icon: <FaDocker /> },
  { id: "ubuntu", name_es: "Ubuntu", name_en: "Ubuntu", category: "devops", icon: <FaLinux /> },
  { id: "nginx", name_es: "Nginx", name_en: "Nginx", category: "devops", icon: <SiNginx /> },
  { id: "mongodb", name_es: "MongoDB", name_en: "MongoDB", category: "devops", icon: <SiMongodb /> },
  { id: "postgresql", name_es: "PostgreSQL", name_en: "PostgreSQL", category: "devops", icon: <SiPostgresql /> },
  { id: "mysql", name_es: "MySQL", name_en: "MySQL", category: "devops", icon: <SiMysql /> },
  { id: "git", name_es: "Git", name_en: "Git", category: "devops", icon: <FaGitAlt /> },
  { id: "gcp", name_es: "GCP", name_en: "GCP", category: "devops", icon: <FaGoogle /> },
  // TODO: Qdrant usa VscVscode como fallback; debería tener su propio icono
  { id: "qdrant", name_es: "Qdrant", name_en: "Qdrant", category: "devops", icon: <VscVscode /> },
  { id: "workspace", name_es: "Google Workspace", name_en: "Google Workspace", category: "devops", icon: <FaGoogle /> },
  { id: "jira", name_es: "Jira", name_en: "Jira", category: "devops", icon: <SiJirasoftware /> },
];

// SECTION_CONTENT: textos de título según idioma
const SECTION_CONTENT: Record<"es" | "en", { title: string; subtitle: string }> = {
  es: { title: "// TECH STACK", subtitle: "Inventario" },
  en: { title: "// TECH STACK", subtitle: "Inventory" },
};

interface TechStackProps {
  lang: "es" | "en";
}

// TechStack: sección con pestañas de filtro y grid de tecnologías
export default function TechStack({ lang }: TechStackProps) {
  // scrollTo: helper para navegación suave entre secciones
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // activeTab: pestaña activa del filtro, por defecto muestra todas
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const content = SECTION_CONTENT[lang];

  // filteredTechs: filtra tecnologías según la categoría seleccionada
  const filteredTechs = activeTab === "all"
    ? TECH_ITEMS
    : TECH_ITEMS.filter((t) => t.category === activeTab);

  return (
    <section id="tech" className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
      <div className="relative z-10 max-w-6xl w-full">
        {/* Título animado al hacer scroll */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-xl md:text-2xl font-mono mb-4">
            {content.title}
          </h2>
          <h3 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            {content.subtitle}
          </h3>
        </motion.div>

        {/* Pestañas de filtro con estilo de archivos de código */}
        <div className="flex flex-wrap items-center border-b border-card-border mb-8 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-mono transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-background text-foreground border-b-2 border-primary"
                    : "bg-card text-muted hover:text-foreground"
                }`}
              >
                <span className="text-primary shrink-0">{tab.icon}</span>
                <span>{tab.label[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de tecnologías con animación de entrada/salida al filtrar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTechs.map((tech) => (
              <motion.div
                key={tech.id}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-card-border rounded-lg p-4 flex flex-col items-center gap-3 hover:border-primary/30 transition-colors"
              >
                <span className="text-3xl text-primary">{tech.icon}</span>
                <span className="text-sm font-mono text-foreground text-center">
                  {lang === "es" ? tech.name_es : tech.name_en}
                </span>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* Grid overlay decorativo */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      {/* Botones BACK/NEXT — visibles siempre al fondo */}
      <div className="relative z-10 max-w-6xl w-full flex items-center justify-center gap-6">
        <motion.button
          onClick={() => scrollTo("about")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          <span className="tracking-wider">{lang === "es" ? "ANTERIOR" : "BACK"}</span>
        </motion.button>
        <motion.button
          onClick={() => scrollTo("experience")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <span className="tracking-wider">{lang === "es" ? "SIGUIENTE" : "NEXT"}</span>
          <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform duration-300" />
        </motion.button>
      </div>
    </section>
  );
}
