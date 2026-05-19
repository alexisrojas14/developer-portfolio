// useClient: necesario para animaciones y hover en tarjetas de logros
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

// EducationItem: interfaz con rarity estilo videojuego (legendary, epic, rare)
interface EducationItem {
  id: string;
  type: "legendary" | "epic" | "rare";
  title: string;
  institution: string;
  date: string;
  verification: string | null;
  file_path: string;
}

interface EducationContent {
  section_title: string;
  subtitle: string;
  terminal_header: string;
  rarity: Record<string, string>;
  items: EducationItem[];
}

interface EducationProps {
  lang: "es" | "en";
}

// CONTENT: datos académicos en ES/EN con rarity tipo videojuego
const CONTENT: Record<string, EducationContent> = {
  es: {
    section_title: "Logros_Desbloqueados",
    subtitle: "Récord académico",
    terminal_header: "> inicializando_registro_academico... [OK]",
    rarity: {
      legendary: "Logro Legendario",
      epic: "Logro \u00c9pico",
      rare: "Logro Raro",
    },
    items: [
      {
        id: "edu_01",
        type: "legendary",
        title:
          "Tecnolog\u00eda en Desarrollo de Software y Aplicativos M\u00f3viles",
        institution: "Polit\u00e9cnico Internacional",
        date: "2023 - 05/2026",
        verification: null,
        file_path: "/certs/degree.pdf",
      },
    ],
  },
  en: {
    section_title: "Achievements_Unlocked",
    subtitle: "Academic Record",
    terminal_header: "> initializing_academic_record... [OK]",
    rarity: {
      legendary: "Legendary Achievement",
      epic: "Epic Achievement",
      rare: "Rare Achievement",
    },
    items: [
      {
        id: "edu_01",
        type: "legendary",
        title:
          "Technology in Software Development and Mobile Applications",
        institution: "Polit\u00e9cnico Internacional",
        date: "2023 - 05/2026",
        verification: null,
        file_path: "/certs/degree.pdf",
      },
    ],
  },
};

// RARITY_STYLES: estilos visuales según rareza (legendary=secondary, epic=primary, rare=code-green)
const RARITY_STYLES: Record<
  string,
  { border: string; text: string; shadow: string; color: string }
> = {
  legendary: {
    border: "border-secondary",
    text: "text-secondary",
    shadow: "shadow-[0_0_20px_var(--secondary)]",
    color: "var(--secondary)",
  },
  epic: {
    border: "border-primary",
    text: "text-primary",
    shadow: "shadow-[0_0_20px_var(--primary)]",
    color: "var(--primary)",
  },
  rare: {
    border: "border-code-green",
    text: "text-code-green",
    shadow: "shadow-[0_0_20px_rgba(126,231,135,0.5)]",
    color: "rgba(126,231,135,0.5)",
  },
};

// EducationCard: tarjeta con glow animado al hover, badge de rareza y enlace de verificación
function EducationCard({
  item,
  index,
  rarityLabel,
  lang,
}: {
  item: EducationItem;
  index: number;
  rarityLabel: string;
  lang: "es" | "en";
}) {
  const [hovered, setHovered] = useState(false);
  const styles = RARITY_STYLES[item.type] ?? RARITY_STYLES.rare;
  // NOTA: glowDuration varía según el índice para un efecto escalonado
  const glowDuration = useMemo(() => 2.5 + (index % 3) * 0.7, [index]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 12,
        delay: index * 0.15,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative bg-card border ${styles.border} rounded-lg p-6 overflow-hidden`}
      style={{ boxShadow: hovered ? styles.shadow : undefined }}
    >
      {/* Glow pulsante que se activa al hacer hover con opacidad variable */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={
          hovered
            ? { opacity: [0, 0.3, 0.1, 0.5, 0.2, 0] }
            : { opacity: 0 }
        }
        transition={{
          duration: glowDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ boxShadow: `0 0 60px ${styles.color}` }}
      />

      <div className="relative z-10">
        {/* Badge de rareza */}
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-mono rounded-full border ${styles.border} ${styles.text} bg-card`}
          >
            {rarityLabel}
          </span>
        </div>

        {/* Título del logro académico */}
        <h3 className="text-foreground text-lg font-bold mb-2">
          {item.title}
        </h3>
        <p className="text-muted text-sm font-mono mb-1">
          {item.institution}
        </p>
        <p className="text-muted text-xs mb-4">
          {item.date}
        </p>

        {/* Ruta del archivo de certificado */}
        <div className="text-muted font-mono text-xs mb-4">
          {item.file_path}
        </div>

        {/* Enlace de verificación que aparece al hover (si existe) */}
        <AnimatePresence>
          {hovered && item.verification && (
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              href={item.verification}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block px-4 py-2 text-sm font-mono rounded border ${styles.border} ${styles.text} hover:bg-primary/10 transition-colors`}
            >
              {lang === "es" ? "Ver Credencial" : "View Credential"}
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Education: sección con estilo de videojuego (logros, rareza, terminal header animado)
export default function Education({ lang }: EducationProps) {
  const content = CONTENT[lang];

  // scrollTo: helper para navegación suave entre secciones
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="education" className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
      {/* Grid overlay decorativo */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      <div className="relative z-10 max-w-6xl w-full">
        {/* Título animado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-xl md:text-2xl font-mono mb-4">
            {content.section_title}
          </h2>
          <h3 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            {content.subtitle}
          </h3>
        </motion.div>
        {/* Terminal header: texto animado caracter por caracter estilo boot */}
        <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-code-green font-mono text-sm mb-8"
      >
        {content.terminal_header.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { delay: i * 0.03 },
              },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.p>

      {/* Grid de tarjetas de logros académicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.items.map((item, index) => (
          <EducationCard
            key={item.id}
            item={item}
            index={index}
            lang={lang}
            rarityLabel={content.rarity[item.type]}
          />
        ))}
      </div>
      </div>
      {/* Botones BACK/NEXT */}
      <div className="mt-12 flex items-center justify-center gap-6">
        <motion.button
          onClick={() => scrollTo("projects")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          <span className="tracking-wider">{lang === "es" ? "ANTERIOR" : "BACK"}</span>
        </motion.button>
        <motion.button
          onClick={() => scrollTo("extra")}
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
