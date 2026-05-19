// useClient: necesario para expand/collapse y hover en las tarjetas de hobbies
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaHeadphones, FaDumbbell, FaFutbol } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

// CONTENT: datos de hobbies en ES/EN (gaming, music, hardware) con títulos tipo archivo
const CONTENT = {
  es: {
    section_title: "// misiones_secundarias.sh",
    music: {
      title: "01_music_player.md",
      description: "La música es mi compañera de código. Ritmos vibrantes que me mantienen enfocado y fluyendo en cada proyecto.",
      stats: ["Ahora suena: Ritmos vibrantes"],
      expanded: "Género favorito: Electrónica y más",
    },
    gym: {
      title: "02_gym_routine.py",
      description: "El gym es mi escape. Mantenerme activo y en forma me da la disciplina y energía que aplico en cada proyecto.",
      stats: ["Frecuencia: 5 días/semana", "Disciplina: Alta"],
      expanded: "Rutina: Push/Pull/Legs",
    },
    futbol: {
      title: "03_futbol_match.sh",
      description: "Apasionado del fútbol, tanto para jugar como para seguir los mejores partidos. El trabajo en equipo en la cancha se refleja en el código.",
      stats: ["Posición: Mediocampista", "Equipo: Real Madrid", "Ídolo: CR7"],
      expanded: "Partido favorito: Real Madrid vs Bayern",
    },
  },
  en: {
    section_title: "// side_quests.sh",
    music: {
      title: "01_music_player.md",
      description: "Music is my coding companion. Energetic beats that keep me focused and flowing on every project.",
      stats: ["Now playing: Energetic beats"],
      expanded: "Favorite genre: Electronic & more",
    },
    gym: {
      title: "02_gym_routine.py",
      description: "The gym is my escape. Staying active and fit gives me the discipline and energy I apply to every project.",
      stats: ["Frequency: 5 days/week", "Discipline: High"],
      expanded: "Routine: Push/Pull/Legs",
    },
    futbol: {
      title: "03_futbol_match.sh",
      description: "Passionate about soccer, both playing and following the biggest matches. Teamwork on the field reflects in my code.",
      stats: ["Position: Midfielder", "Team: Real Madrid", "Idol: CR7"],
      expanded: "Favorite match: Real Madrid vs Bayern",
    },
  },
};

interface ExtraProps {
  lang: "es" | "en";
}

// Extra: sección de hobbies personales con estilo de archivos de sistema y efectos interactivos
export default function Extra({ lang }: ExtraProps) {
  const c = CONTENT[lang];

  // scrollTo: helper para navegación suave entre secciones
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // isHovered: controla la animación del equalizer de música
  const [isHovered, setIsHovered] = useState(false);
  // expanded: estado para mostrar detalles adicionales al hacer click
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // toggleExpand: expande/colapsa detalles de cada hobby al hacer click
  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // bars: índices para las barras del equalizer de música
  const bars = [0, 1, 2, 3, 4];

  return (
    <section id="extra" className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
      {/* Título con entrada animada */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-primary text-xl md:text-2xl font-mono">
          {c.section_title}
        </h2>
      </motion.div>
      {/* Grid de 3 tarjetas de hobbies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Music: tarjeta con equalizer animado al hover */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-card border border-card-border rounded-lg p-6 hover:border-secondary transition-all duration-300"
        >
          <FaHeadphones className="text-primary text-3xl mb-4" />
          <h3
            className="text-primary font-mono text-sm mb-2 cursor-pointer select-none transition-colors duration-300"
            onClick={() => toggleExpand("music")}
          >
            {c.music.title}
          </h3>
          <p className="text-muted text-sm mb-4">{c.music.description}</p>
          {/* Equalizer: barras que se animan con la clase animate-equalizer al hacer hover */}
          <div className="flex items-end gap-1 h-6">
            {bars.map((i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full bg-primary ${isHovered ? "animate-equalizer" : ""}`}
                style={{
                  height: isHovered ? undefined : "4px",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          {/* Detalle expandible con canción actual */}
          {expanded.music && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <p className="text-code-green font-mono text-xs">
                {c.music.expanded}
              </p>
            </motion.div>
          )}
        </motion.div>
        {/* Gym: tarjeta con rutina y disciplina */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-card-border rounded-lg p-6 hover:border-secondary transition-all duration-300"
        >
          <FaDumbbell className="text-primary text-3xl mb-4" />
          <h3
            className="text-primary font-mono text-sm mb-2 cursor-pointer select-none transition-colors duration-300"
            onClick={() => toggleExpand("gym")}
          >
            {c.gym.title}
          </h3>
          <p className="text-muted text-sm mb-4">{c.gym.description}</p>
          {/* Stats de gym */}
          <div className="text-code-green font-mono text-xs space-y-1">
            {c.gym.stats.map((stat: string, i: number) => (
              <p key={i}>{stat}</p>
            ))}
          </div>
          {/* Detalle expandible */}
          {expanded.gym && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <p className="text-code-green font-mono text-xs">
                {c.gym.expanded}
              </p>
            </motion.div>
          )}
        </motion.div>
        {/* F\u00fatbol: tarjeta con pasi\u00f3n deportiva */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-card-border rounded-lg p-6 hover:border-secondary transition-all duration-300"
        >
          <FaFutbol className="text-primary text-3xl mb-4" />
          <h3
            className="text-primary font-mono text-sm mb-2 cursor-pointer select-none transition-colors duration-300"
            onClick={() => toggleExpand("futbol")}
          >
            {c.futbol.title}
          </h3>
          <p className="text-muted text-sm mb-4">{c.futbol.description}</p>
          {/* Stats de f\u00fatbol */}
          <div className="text-code-green font-mono text-xs space-y-1">
            {c.futbol.stats.map((stat: string, i: number) => (
              <p key={i}>{stat}</p>
            ))}
          </div>
          {/* Detalle expandible */}
          {expanded.futbol && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <p className="text-code-green font-mono text-xs">
                {c.futbol.expanded}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Grid overlay decorativo */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      {/* Botones BACK/NEXT */}
      <div className="mt-12 flex items-center justify-center gap-6">
        <motion.button
          onClick={() => scrollTo("education")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          <span className="tracking-wider">{lang === "es" ? "ANTERIOR" : "BACK"}</span>
        </motion.button>
        <motion.button
          onClick={() => scrollTo("contact")}
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
