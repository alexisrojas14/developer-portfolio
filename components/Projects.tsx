// useClient: necesario para filtros, hover 3D y animaciones de galería
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import {
  FaJava,
  FaPython,
  FaReact,
  FaDocker,
  FaTh,
  FaExternalLinkAlt,
  FaGithub,
  FaFlask,
} from "react-icons/fa";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProjectLinks {
  demo: string | null;
  github: string | null;
}

// Project: interfaz para cada proyecto del portafolio
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech_stack: string[];
  image?: string;
  images?: string[];
  year?: string;
  links: ProjectLinks;
  featured?: boolean;
  label?: { es: string; en: string };
}

interface ProjectsProps {
  lang: "es" | "en";
}

// FilterKey: tipos de filtro por tecnología (All, Java, Python, React, Docker, AI)
type FilterKey = "All" | "Java" | "Python" | "React" | "Docker" | "AI";

// FILTERS: botones de filtro con iconos representativos de cada tecnología
const FILTERS: { key: FilterKey; icon: React.ReactNode }[] = [
  { key: "All", icon: <FaTh /> },
  { key: "Java", icon: <FaJava /> },
  { key: "Python", icon: <FaPython /> },
  { key: "React", icon: <FaReact /> },
  { key: "Docker", icon: <FaDocker /> },
  { key: "AI", icon: <FaFlask /> },
];

// CONTENT: galería de proyectos en ES/EN con descripciones y enlaces
const CONTENT: Record<
  string,
  { section_title: string; subtitle: string; projects: Project[] }
> = {
  es: {
    section_title: "Galería_de_Proyectos",
    subtitle: "Misiones completadas",
    projects: [
      {
        id: "maxi_ia",
        title: "MAXI.AI",
        subtitle: "Portal GRC con Inteligencia Artificial",
        description:
          "Portal GRC implementado desde cero con arquitectura de microservicios. Integraci\u00f3n de LLMs locales y Gemini 3.1 Flash Lite con bases de datos vectoriales Qdrant para consultas documentales inteligentes. Despliegue con Docker Compose en servidores Ubuntu.",
        tech_stack: ["React", "Python", "Docker", "AI", "Flask", "Qdrant"],
        image: "/assets/projects/maxi-ia/shot-1.jpg",
        images: [
          "/assets/projects/maxi-ia/shot-1.jpg",
          "/assets/projects/maxi-ia/shot-2.jpg",
          "/assets/projects/maxi-ia/shot-3.jpg",
          "/assets/projects/maxi-ia/shot-4.jpg",
          "/assets/projects/maxi-ia/shot-5.jpg",
        ],
        year: "2026",
        links: { demo: null, github: null },
        featured: true,
        label: { es: "Corporativo", en: "Corporate" },
      },
      {
        id: "lexis_manage",
        title: "Lexis Manage",
        subtitle: "Sistema de Gesti\u00f3n para Gimnasios",
        description:
          "Sistema de gesti\u00f3n de usuarios, membres\u00edas y pagos desarrollado con Java + MySQL, desplegado en servidor Ubuntu (VM).",
        tech_stack: ["Java", "MySQL", "Ubuntu", "Spring Boot"],
        image: "/assets/projects/lexis.manage/shot-1.jpg",
        images: [
          "/assets/projects/lexis.manage/shot-1.jpg",
          "/assets/projects/lexis.manage/shot-2.jpg",
          "/assets/projects/lexis.manage/shot-3.jpg",
          "/assets/projects/lexis.manage/shot-4.jpg",
          "/assets/projects/lexis.manage/shot-5.jpg",
          "/assets/projects/lexis.manage/shot-6.jpg",
        ],
        year: "2024",
        links: {
          demo: null,
          github: "https://github.com/alexisrojas14/LexisManage",
        },
        label: { es: "Acad\u00e9mico", en: "Academic" },
      },
      {
        id: "master_chef",
        title: "Master Chef Colombia APP",
        subtitle: "Aplicaci\u00f3n inspirada en el programa de TV",
        description:
          "Aplicaci\u00f3n desarrollada en Java utilizando principios de POO (herencia, polimorfismo, abstracci\u00f3n, encapsulamiento).",
        tech_stack: ["Java", "POO"],
        image: "/assets/projects/master-chef/shot-1.jpg",
        images: ["/assets/projects/master-chef/shot-1.jpg"],
        year: "2023",
        links: { demo: null, github: "https://github.com/alexisrojas14/Master-Chef-Colombia-APP" },
        label: { es: "Acad\u00e9mico", en: "Academic" },
      },
    ],
  },
  en: {
    section_title: "Project_Gallery",
    subtitle: "Completed Missions",
    projects: [
      {
        id: "maxi_ia",
        title: "MAXI.AI",
        subtitle: "GRC Portal with Artificial Intelligence",
        description:
          "GRC portal built from scratch with microservices architecture. Integration of local LLMs and Gemini 3.1 Flash Lite with Qdrant vector databases for intelligent document queries. Deployed with Docker Compose on Ubuntu servers.",
        tech_stack: ["React", "Python", "Docker", "AI", "Flask", "Qdrant"],
        image: "/assets/projects/maxi-ia/shot-1.jpg",
        images: [
          "/assets/projects/maxi-ia/shot-1.jpg",
          "/assets/projects/maxi-ia/shot-2.jpg",
          "/assets/projects/maxi-ia/shot-3.jpg",
          "/assets/projects/maxi-ia/shot-4.jpg",
          "/assets/projects/maxi-ia/shot-5.jpg",
        ],
        year: "2026",
        links: { demo: null, github: null },
        featured: true,
        label: { es: "Corporativo", en: "Corporate" },
      },
      {
        id: "lexis_manage",
        title: "Lexis Manage",
        subtitle: "Gym Management System",
        description:
          "User, membership, and payment management system built with Java + MySQL, deployed on Ubuntu server (VM).",
        tech_stack: ["Java", "MySQL", "Ubuntu", "Spring Boot"],
        image: "/assets/projects/lexis.manage/shot-1.jpg",
        images: [
          "/assets/projects/lexis.manage/shot-1.jpg",
          "/assets/projects/lexis.manage/shot-2.jpg",
          "/assets/projects/lexis.manage/shot-3.jpg",
          "/assets/projects/lexis.manage/shot-4.jpg",
          "/assets/projects/lexis.manage/shot-5.jpg",
          "/assets/projects/lexis.manage/shot-6.jpg",
        ],
        year: "2024",
        links: {
          demo: null,
          github: "https://github.com/alexisrojas14/LexisManage",
        },
        label: { es: "Acad\u00e9mico", en: "Academic" },
      },
      {
        id: "master_chef",
        title: "Master Chef Colombia APP",
        subtitle: "App inspired by the TV show",
        description:
          "Java application built using OOP principles (inheritance, polymorphism, abstraction, encapsulation).",
        tech_stack: ["Java", "OOP"],
        image: "/assets/projects/master-chef/shot-1.jpg",
        images: ["/assets/projects/master-chef/shot-1.jpg"],
        year: "2023",
        links: { demo: null, github: "https://github.com/alexisrojas14/Master-Chef-Colombia-APP" },
        label: { es: "Acad\u00e9mico", en: "Academic" },
      },
    ],
  },
};

// ProjectCard: tarjeta individual con efecto tilt 3D, hover glow, y enlaces animados
function ProjectCard({
  project,
  lang,
}: {
  project: Project;
  lang: "es" | "en";
}) {
  const [hovered, setHovered] = useState(false);
  // imgIndex: índice de la imagen actual en la galería
  const [imgIndex, setImgIndex] = useState(0);
  // lightboxOpen: controla si el modal de imagen ampliada está abierto
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // expanded: controla si la descripción está expandida
  const [expanded, setExpanded] = useState(false);
  // rotateX/Y: ángulos de inclinación 3D según movimiento del ratón
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // images: lista de imágenes del proyecto (usa images[] o cae a image)
  const images = project.images || (project.image ? [project.image] : []);

  // Cerrar lightbox con Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft")
        setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === "ArrowRight")
        setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, images.length]);

  // Auto-slideshow: cambia la imagen cada 2s en el card, pausa al hacer hover
  useEffect(() => {
    if (images.length <= 1 || hovered || lightboxOpen) return;
    const interval = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length, hovered, lightboxOpen]);

  // handleMouseMove: calcula rotación 3D basada en la posición del ratón respecto al centro de la tarjeta
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const maxDeg = 10;
    setRotateX((-mouseY / (rect.height / 2)) * maxDeg);
    setRotateY((mouseX / (rect.width / 2)) * maxDeg);
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setRotateX(0);
    setRotateY(0);
  }, []);

  // prevImage / nextImage: navegación entre imágenes de la galería
  const prevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    },
    [images.length],
  );

  const nextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    },
    [images.length],
  );

  // goToImage: salta a un índice específico
  const goToImage = useCallback(
    (i: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIndex(i);
    },
    [],
  );

  return (
    <>
      {/* NOTA: preserve-3d + perspective para el efecto de inclinación 3D */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          rotateX,
          rotateY,
          willChange: "transform",
        }}
        className={`relative min-w-[320px] max-w-[400px] bg-card rounded-lg overflow-hidden snap-center shrink-0 ${
          project.featured
            ? "border-2 border-yellow-500/50"
            : "border border-card-border"
        }`}
        // Glow neón que se activa al hacer hover (con tinte dorado si es featured)
        animate={{
          boxShadow: hovered
            ? project.featured
              ? "0 0 40px rgba(234, 179, 8, 0.4), 0 0 80px rgba(234, 179, 8, 0.15)"
              : "0 0 40px var(--primary), 0 0 80px rgba(0, 242, 255, 0.15)"
            : "0 0 0px transparent",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className="relative overflow-hidden h-48 cursor-pointer"
          onClick={() => images.length > 0 && setLightboxOpen(true)}
        >
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: hovered ? 1.1 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[imgIndex]}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label={lang === "es" ? "Imagen anterior" : "Previous image"}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground opacity-0 hover:opacity-100 transition-opacity duration-200 hover:bg-background/80 z-20"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label={lang === "es" ? "Imagen siguiente" : "Next image"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground opacity-0 hover:opacity-100 transition-opacity duration-200 hover:bg-background/80 z-20"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={goToImage(i)}
                      aria-label={lang === "es" ? `Ir a imagen ${i + 1}` : `Go to image ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                        i === imgIndex
                          ? "bg-primary w-3"
                          : "bg-foreground/40 hover:bg-foreground/60 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1 }}
              className="w-full h-full bg-gradient-to-br from-primary to-secondary"
            />
          )}
        </div>

        {project.label && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-mono bg-background/80 backdrop-blur-sm text-primary border border-primary/30 rounded-full z-10">
            {project.label[lang]}
          </span>
        )}

        {project.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-yellow-500/20 backdrop-blur-sm text-yellow-400 border border-yellow-500/30 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {lang === "es" ? "Destacado" : "Featured"}
            </span>
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-foreground text-xl font-bold mb-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <p className="text-primary text-sm font-mono">{project.subtitle}</p>
            {project.year && (
              <span className="px-2 py-0.5 text-[10px] font-mono text-muted bg-muted/10 border border-muted/20 rounded-full">
                {project.year}
              </span>
            )}
          </div>
          <p className={`text-muted text-sm leading-relaxed mb-1 ${expanded ? "" : "line-clamp-2"}`}>
            {project.description}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="text-[11px] font-mono text-primary/60 hover:text-primary transition-colors mb-4 cursor-pointer self-start"
          >
            {expanded
              ? (lang === "es" ? "[-] ver menos" : "[-] show less")
              : (lang === "es" ? "[+] ver m\u00e1s" : "[+] show more")}
          </button>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              className="absolute bottom-4 right-4 flex gap-2"
            >
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === "es" ? `Ver demo de ${project.title}` : `View demo of ${project.title}`}
                  className="p-3 rounded-full bg-card border border-card-border text-primary hover:shadow-[0_0_15px_var(--primary)] transition-shadow"
                >
                  <FaExternalLinkAlt />
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === "es" ? `C\u00f3digo fuente en GitHub de ${project.title}` : `Source code on GitHub for ${project.title}`}
                  className="p-3 rounded-full bg-card border border-card-border text-primary hover:shadow-[0_0_15px_var(--primary)] transition-shadow"
                >
                  <FaGithub />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      {lightboxOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <motion.div
            key={imgIndex}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-w-[88vw] max-h-[82vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[imgIndex]}
              alt=""
              fill
              className="object-contain rounded-lg shadow-2xl"
              sizes="88vw"
            />
          </motion.div>
          <button
            onClick={() => setLightboxOpen(false)}
            className="fixed top-5 right-5 p-3 rounded-full bg-background/20 backdrop-blur-md text-white hover:bg-white/30 transition-all z-[9999]"
            aria-label={lang === "es" ? "Cerrar" : "Close"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                aria-label={lang === "es" ? "Imagen anterior" : "Previous image"}
                className="fixed left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 backdrop-blur-md text-white hover:bg-white/30 transition-all z-[9999]"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                aria-label={lang === "es" ? "Imagen siguiente" : "Next image"}
                className="fixed right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 backdrop-blur-md text-white hover:bg-white/30 transition-all z-[9999]"
              >
                <ChevronRight size={28} />
              </button>
              <span className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 text-sm font-mono bg-background/20 backdrop-blur-md text-white/80 rounded-full z-[9999]">
                {imgIndex + 1} / {images.length}
              </span>
            </>
          )}
        </motion.div>,
        document.body
      )}
    </>
  );
}

// Projects: componente principal con sistema de filtros y grid de tarjetas
export default function Projects({ lang }: ProjectsProps) {
  const c = CONTENT[lang];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [filterTech, setFilterTech] = useState<FilterKey>("All");
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<string | null>(null);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableLabels = [...new Set(c.projects.filter(p => p.label).map(p => p.label![lang]))];
  const availableYears = [...new Set(c.projects.filter(p => p.year).map(p => p.year!))].sort().reverse();

  const allFilters: FilterKey[] = ["All", "Java", "Python", "React", "Docker", "AI"];

  const filteredProjects = c.projects.filter((p) => {
    if (filterTech !== "All" && !p.tech_stack.includes(filterTech)) return false;
    if (filterLabel && p.label?.[lang] !== filterLabel) return false;
    if (filterYear && p.year !== filterYear) return false;
    if (filterFeatured && !p.featured) return false;
    return true;
  });

  return (
    <section
      id="projects"
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-primary text-xl md:text-2xl font-mono mb-4">
            {c.section_title}
          </h2>
          <h3 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            {c.subtitle}
          </h3>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {allFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterTech(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                filterTech === f
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "bg-card text-muted border-card-border hover:text-foreground"
              }`}
            >
              {FILTERS.find((x) => x.key === f)?.icon}
              {f === "All" ? (lang === "es" ? "Todo" : "All") : f}
            </button>
          ))}
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className={`relative px-3 py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
              showAdvanced
                ? "bg-secondary/20 text-secondary border-secondary/40"
                : "bg-card text-muted border-card-border hover:text-foreground"
            }`}
          >
            {lang === "es" ? "Avanzados" : "Advanced"}
          </button>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6 bg-card border border-card-border rounded-lg p-4 max-w-2xl mx-auto"
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-[10px] font-mono text-muted mb-1.5">
                  {lang === "es" ? "Tipo" : "Type"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availableLabels.map((l) => (
                    <button
                      key={l}
                      onClick={() => setFilterLabel(filterLabel === l ? null : l)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border cursor-pointer ${
                        filterLabel === l
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-card text-muted border-card-border"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted mb-1.5">
                  A&ntilde;o
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availableYears.map((y) => (
                    <button
                      key={y}
                      onClick={() => setFilterYear(filterYear === y ? null : y)}
                      className={`px-2 py-1 text-[10px] font-mono rounded border cursor-pointer ${
                        filterYear === y
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-card text-muted border-card-border"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted mb-1.5">
                  {lang === "es" ? "Destacados" : "Featured"}
                </p>
                <button
                  onClick={() => setFilterFeatured((v) => !v)}
                  className={`px-2 py-1 text-[10px] font-mono rounded border cursor-pointer ${
                    filterFeatured
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-card text-muted border-card-border"
                  }`}
                >
                  {filterFeatured ? "ON" : "OFF"}
                </button>
              </div>
              {(filterLabel || filterYear || filterFeatured) && (
                <button
                  onClick={() => { setFilterLabel(null); setFilterYear(null); setFilterFeatured(false); }}
                  className="px-2 py-1 text-[10px] font-mono text-red-500 hover:text-red-400"
                >
                  {lang === "es" ? "Limpiar" : "Clear"}
                </button>
              )}
            </div>
          </motion.div>
        )}

        <LayoutGroup>
          <div className="-mx-4 md:mx-0">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 pb-4">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ProjectCard project={project} lang={lang} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      </div>

      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>
      {/* Botones BACK/NEXT con traducción */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <motion.button
          onClick={() => scrollTo("experience")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <ChevronUp
            size={16}
            className="group-hover:-translate-y-0.5 transition-transform duration-300"
          />
          <span className="tracking-wider">{lang === "es" ? "ANTERIOR" : "BACK"}</span>
        </motion.button>
        <motion.button
          onClick={() => scrollTo("education")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-primary transition-colors duration-300 group"
        >
          <span className="tracking-wider">{lang === "es" ? "SIGUIENTE" : "NEXT"}</span>
          <ChevronDown
            size={16}
            className="group-hover:translate-y-0.5 transition-transform duration-300"
          />
        </motion.button>
      </div>
    </section>
  );
}
