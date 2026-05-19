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
  SiNginx, SiPostgresql, SiMysql
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
  level: number;
}

// TABS: define las pestañas con iconos y nombres tipo archivo (config, .py, .tsx, .sh)
const TABS: { id: TabId; label: Record<"es" | "en", string>; icon: ReactNode }[] = [
  { id: "all", label: { es: "todos.config", en: "all.config" }, icon: <Settings className="w-4 h-4" /> },
  { id: "backend", label: { es: "backend.py", en: "backend.py" }, icon: <FaPython className="w-4 h-4" /> },
  { id: "frontend", label: { es: "frontend.tsx", en: "frontend.tsx" }, icon: <FaReact className="w-4 h-4" /> },
  { id: "devops", label: { es: "devops.sh", en: "devops.sh" }, icon: <Terminal className="w-4 h-4" /> },
];

// TECH_ITEMS: lista completa de tecnologías con categoría y nivel de habilidad (0-100)
// NOTA: los datos están hardcodeados; podrían moverse a un archivo JSON/API para escalar
const TECH_ITEMS: TechItem[] = [
  { id: "python", name_es: "Python", name_en: "Python", category: "backend", icon: <FaPython />, level: 90 },
  { id: "java", name_es: "Java", name_en: "Java", category: "backend", icon: <FaJava />, level: 85 },
  { id: "springboot", name_es: "Spring Boot", name_en: "Spring Boot", category: "backend", icon: <SiSpringboot />, level: 80 },
  { id: "flask", name_es: "Flask", name_en: "Flask", category: "backend", icon: <SiFlask />, level: 75 },
  { id: "react", name_es: "React", name_en: "React", category: "frontend", icon: <FaReact />, level: 85 },
  { id: "tailwind", name_es: "Tailwind CSS", name_en: "Tailwind CSS", category: "frontend", icon: <SiTailwindcss />, level: 80 },
  { id: "html", name_es: "HTML", name_en: "HTML", category: "frontend", icon: <FaHtml5 />, level: 90 },
  { id: "javascript", name_es: "JavaScript", name_en: "JavaScript", category: "frontend", icon: <SiJavascript />, level: 75 },
  { id: "docker", name_es: "Docker", name_en: "Docker", category: "devops", icon: <FaDocker />, level: 80 },
  { id: "ubuntu", name_es: "Ubuntu", name_en: "Ubuntu", category: "devops", icon: <FaLinux />, level: 75 },
  { id: "nginx", name_es: "Nginx", name_en: "Nginx", category: "devops", icon: <SiNginx />, level: 70 },
  { id: "postgresql", name_es: "PostgreSQL", name_en: "PostgreSQL", category: "devops", icon: <SiPostgresql />, level: 75 },
  { id: "mysql", name_es: "MySQL", name_en: "MySQL", category: "devops", icon: <SiMysql />, level: 70 },
  { id: "git", name_es: "Git", name_en: "Git", category: "devops", icon: <FaGitAlt />, level: 85 },
  { id: "gcp", name_es: "GCP", name_en: "GCP", category: "devops", icon: <FaGoogle />, level: 65 },
  // TODO: Qdrant usa VscVscode como fallback; debería tener su propio icono
  { id: "qdrant", name_es: "Qdrant", name_en: "Qdrant", category: "devops", icon: <VscVscode />, level: 60 },
  { id: "llm", name_es: "LLMs (Gemini, Locales)", name_en: "LLMs (Gemini, Local)", category: "backend", icon: <GiBrain />, level: 70 },
  { id: "workspace", name_es: "Google Workspace", name_en: "Google Workspace", category: "devops", icon: <FaGoogle />, level: 65 },
  { id: "jira", name_es: "Jira", name_en: "Jira", category: "devops", icon: <SiJirasoftware />, level: 60 },
];

// SECTION_CONTENT: textos de título según idioma
const SECTION_CONTENT: Record<"es" | "en", { title: string; subtitle: string }> = {
  es: { title: "// TECH STACK", subtitle: "Inventario" },
  en: { title: "// TECH STACK", subtitle: "Inventory" },
};

interface TechStackProps {
  lang: "es" | "en";
}

// TechStack: sección con pestañas de filtro y grid de tecnologías con barra de progreso animada
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
                {/* Barra de progreso animada que se llena al entrar en viewport */}
                <div className="w-full h-1.5 bg-card-border/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tech.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-secondary rounded-full"
                  />
                </div>
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
