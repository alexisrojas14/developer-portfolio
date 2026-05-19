// useClient: necesario para hooks de scroll tracking y animaciones
"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaPython, FaReact, FaDocker } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

// ICON_MAP: mapea strings de stack a componentes de iconos para renderizado dinámico
const ICON_MAP: Record<string, ReactNode> = {
  FaPython: <FaPython />,
  FaReact: <FaReact />,
  FaDocker: <FaDocker />,
};

// Job: interfaz para cada experiencia laboral (empresa, rol, período, descripciones, stack)
interface Job {
  company: string;
  role: string;
  period: string;
  description: string[];
  stack: string[];
}

// CONTENT: datos de experiencia en ES/EN con descripciones detalladas y tecnologías usadas
const CONTENT: Record<"es" | "en", { title: string; subtitle: string; jobs: Job[] }> = {
  es: {
    title: "// TRAYECTORIA",
    subtitle: "Quest Log",
    jobs: [
      {
        company: "DigiSoc",
        role: "Desarrollador de Software & Soporte TI (Prácticas)",
        period: "[Nov 2025 - May 2026]",
        description: [
          "Desarrollo del portal GRC 'MAXI.AI' con React, Tailwind V4 y Python (Flask/Uvicorn). Integración de LLMs locales y Gemini con Qdrant.",
          "Despliegue en servidores Ubuntu con Docker Compose, Nginx como proxy inverso y gestión SSL/TLS.",
          "Migración corporativa a Google Workspace, gestión de accesos en GCP Active Directory, automatización de reportes con Jira y Sheets.",
        ],
        stack: ["FaPython", "FaReact", "FaDocker"],
      },
    ],
  },
  en: {
    title: "// EXPERIENCE",
    subtitle: "Quest Log",
    jobs: [
      {
        company: "DigiSoc",
        role: "Software Developer & IT Support (Internship)",
        period: "[Nov 2025 - May 2026]",
        description: [
          "Developed the GRC portal 'MAXI.AI' with React, Tailwind V4 and Python (Flask/Uvicorn). Integrated local LLMs and Gemini with Qdrant.",
          "Deployed on Ubuntu servers with Docker Compose, Nginx as reverse proxy and SSL/TLS management.",
          "Corporate migration to Google Workspace, access management in GCP Active Directory, automated reporting with Jira and Sheets.",
        ],
        stack: ["FaPython", "FaReact", "FaDocker"],
      },
    ],
  },
};

interface ExperienceProps {
  lang: "es" | "en";
}

// Experience: línea de tiempo con scroll progress para animar la barra vertical
export default function Experience({ lang }: ExperienceProps) {
  // sectionRef: referencia para trackear el progreso de scroll de la sección
  const sectionRef = useRef<HTMLDivElement>(null);
  // scrollYProgress: progreso de 0 a 1 según el scroll relativo a la sección
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // lineScaleY: transforma el progreso en escala Y (0 a 1) para animar la línea vertical
  const lineScaleY = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  const content = CONTENT[lang];

  // scrollTo: helper para navegación suave entre secciones
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full">
        {/* Título con entrada animada */}
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

        {/* Línea de tiempo: barra vertical que se llena con el scroll */}
        <div className="relative">
          {/* Línea decorativa animada con scaleY según scroll */}
          <motion.div
            className="absolute left-[1.625rem] top-0 w-0.5 bg-primary shadow-[0_0_10px_var(--primary)] origin-top"
            style={{ scaleY: lineScaleY }}
          />

          {content.jobs.map((job, jobIndex) => (
            <div key={jobIndex} className="relative pl-14 pb-16 last:pb-0">
              {/* Punto indicador en la línea de tiempo con glow pulsante en el primero */}
              <div className="absolute left-[1.125rem] top-2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                  className="w-[14px] h-[14px] rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                />
                {/* NOTA: anillo pulsante solo en el primer trabajo (más reciente) */}
                {jobIndex === 0 && (
                  <motion.div
                    className="absolute inset-0 w-[14px] h-[14px] rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </div>

              {/* Tarjeta de experiencia con entrada animada desde la derecha */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`bg-card border border-card-border rounded-lg overflow-hidden ${
                  jobIndex === 0 ? "shadow-[0_0_25px_var(--primary)]" : ""
                }`}
              >
                {/* Barra superior estilo ventana (rojo, amarillo, verde) */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-card-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>

                <div className="p-5">
                  {/* Encabezado: empresa y período */}
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-foreground font-bold font-sans text-lg">
                      {job.company}
                    </h4>
                    <span className="text-muted font-mono text-xs">
                      {job.period}
                    </span>
                  </div>

                  {/* Rol con color secundario */}
                  <p className="text-secondary font-mono text-sm mb-4">
                    {job.role}
                  </p>

                  {/* Descripciones con prefijo > estilo terminal */}
                  <ul className="space-y-2 mb-4">
                    {job.description.map((desc, descIndex) => (
                      <li key={descIndex} className="flex gap-2 text-sm text-muted font-sans">
                        <span className="text-primary font-mono shrink-0">&gt;</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Iconos del stack tecnológico usado */}
                  <div className="flex gap-3 text-primary text-lg">
                    {job.stack.map((iconKey, iconIndex) => (
                      <span key={iconIndex}>{ICON_MAP[iconKey]}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      {/* Grid overlay decorativo */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      {/* Botones BACK/NEXT */}
      <div className="mt-12 flex items-center justify-center gap-6">
        <motion.button
          onClick={() => scrollTo("tech")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          <span className="tracking-wider">{lang === "es" ? "ANTERIOR" : "BACK"}</span>
        </motion.button>
        <motion.button
          onClick={() => scrollTo("projects")}
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
