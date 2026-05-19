// useClient: necesario para el efecto 3D hover en las tarjetas
"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import es from "../public/locales/es/about.json";
import en from "../public/locales/en/about.json";

interface AboutMeProps {
  lang: "es" | "en";
}

// CardState: posición del spotlight y rotación 3D para cada tarjeta
interface CardState {
  spotX: number;
  spotY: number;
  rotX: number;
  rotY: number;
}

// AboutMe: sección tipo "bento grid" con tarjetas interactivas que tienen efecto 3D hover
export default function AboutMe({ lang }: AboutMeProps) {
  // Selecciona el contenido según el idioma actual
  const about = lang === "es" ? es : en;

  // scrollTo: helper para navegación suave entre secciones
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // cards: estado que almacena spotlight y rotación por índice de tarjeta
  const [cards, setCards] = useState<Record<number, CardState>>({});
  // cardRefs: refs para calcular posición del ratón relativa a cada tarjeta
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // handleMouseMove: calcula spotlight y rotación 3D según posición del ratón en la tarjeta
  // NOTA: normaliza coordenadas (0..1) y las convierte a rotación (-5..5 grados)
  const handleMouseMove = useCallback(
    (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRefs.current[index];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const nx = x * 2 - 1;
      const ny = y * 2 - 1;
      setCards((prev) => ({
        ...prev,
        [index]: { spotX: x * 100, spotY: y * 100, rotX: -ny * 5, rotY: nx * 5 },
      }));
    },
    []
  );

  // handleMouseLeave: resetea spotlight al centro (50,50) y rotación a 0
  const handleMouseLeave = useCallback(
    (index: number) => () =>
      setCards((prev) => ({
        ...prev,
        [index]: { spotX: 50, spotY: 50, rotX: 0, rotY: 0 },
      })),
    []
  );

  // bentoCards: define las 5 tarjetas del grid (bio, philosophy, location, interests, quote)
  const bentoCards = [
    {
      key: "bio",
      title: about.bio_card.title,
      content: (
        <p className="text-muted font-sans leading-relaxed">
          {about.bio_card.content}
        </p>
      ),
      // NOTA: ocupa 2 columnas x 2 filas en desktop para destacar la bio
      className: "md:col-span-2 md:row-span-2",
    },
    {
      key: "philosophy",
      title: about.philosophy_card.title,
      content: (
        <p className="text-muted font-sans leading-relaxed">
          {about.philosophy_card.content}
        </p>
      ),
      className: "md:col-span-1 md:row-span-1",
    },
    {
      key: "location",
      title: about.location_card.title,
      content: (
        <p className="text-muted font-sans">
          {about.location_card.content}
        </p>
      ),
      className: "md:col-span-1 md:row-span-1",
    },
    {
      key: "interests",
      title: about.interests_card.title,
      content: (
        <div className="flex flex-wrap gap-2">
          {about.interests_card.items.map((item: string, i: number) => (
            <span
              key={i}
              className="bg-card border border-card-border text-muted font-mono text-xs px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      ),
      className: "md:col-span-1 md:row-span-1",
    },
    {
      key: "quote",
      title: about.quote_card.title,
      content: (
        <p className="text-muted font-sans italic leading-relaxed">
          {about.quote_card.content}
        </p>
      ),
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <section id="about" className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
      {/* Título de la sección con entrada animada */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-primary font-mono text-xl md:text-2xl mb-4">
          {about.section_title}
        </h2>
        <h3 className="font-sans font-bold text-4xl md:text-5xl bg-gradient-to-r from-foreground via-secondary to-primary bg-clip-text text-transparent">
          {about.subtitle}
        </h3>
      </motion.div>

      {/* Grid de tarjetas bento con efecto 3D y spotlight al hacer hover */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {bentoCards.map((card, index) => {
          const state = cards[index];
          return (
            <motion.div
              key={card.key}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseMove={handleMouseMove(index)}
              onMouseLeave={handleMouseLeave(index)}
              className={`bg-card backdrop-blur-sm border border-card-border rounded-xl p-5 transition-all duration-300 cursor-default ${card.className} hover:border-secondary hover:shadow-[0_0_15px_var(--secondary)]`}
              style={{
                // NOTA: transform con perspective para el efecto 3D de inclinación
                transform: state
                  ? `perspective(600px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`
                  : "perspective(600px) rotateX(0deg) rotateY(0deg)",
                willChange: "transform",
              }}
            >
              {/* Spotlight: gradiente radial que sigue al ratón */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: state
                    ? `radial-gradient(circle at ${state.spotX}% ${state.spotY}%, rgba(188, 0, 255, 0.1), transparent 60%)`
                    : "transparent",
                }}
              />
              {/* Puntos de decoración estilo ventana de código (rojo, amarillo, verde) */}
              <div className="flex gap-1.5 mb-3 relative z-10">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <h3 className="text-primary font-mono text-sm mb-3 relative z-10">
                {card.title}
              </h3>
              <div className="relative z-10">{card.content}</div>
            </motion.div>
          );
        })}
      </div>
      {/* Grid overlay decorativo repetido en todas las secciones */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      {/* Botones de navegación entre secciones: BACK/NEXT */}
      <div className="mt-12 flex items-center justify-center gap-8">
        <motion.button
          onClick={() => scrollTo("hero")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          <span className="tracking-wider">{lang === "es" ? "ANTERIOR" : "BACK"}</span>
        </motion.button>
        <motion.button
          onClick={() => scrollTo("tech")}
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
