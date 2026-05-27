// useClient: necesario para filtros, hover 3D y animaciones de galería
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaJava,
  FaPython,
  FaReact,
  FaDocker,
  FaTh,
  FaGithub,
  FaFlask,
} from "react-icons/fa";
import { SiNextdotjs, SiAngular, SiTypescript } from "react-icons/si";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProjectLinks {
  demo: string | null;
  github: string | null;
  githubBackend?: string | null;
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

// FilterKey: tipos de filtro por tecnología
type FilterKey = "All" | "Java" | "Python" | "React" | "Next.js" | "Angular" | "TypeScript" | "Docker" | "AI";

// FILTERS: botones de filtro con iconos representativos de cada tecnología
const FILTERS: { key: FilterKey; icon: React.ReactNode }[] = [
  { key: "All", icon: <FaTh /> },
  { key: "Java", icon: <FaJava /> },
  { key: "Python", icon: <FaPython /> },
  { key: "React", icon: <FaReact /> },
  { key: "Next.js", icon: <SiNextdotjs /> },
  { key: "Angular", icon: <SiAngular /> },
  { key: "TypeScript", icon: <SiTypescript /> },
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
      {
        id: "nudgeme",
        title: "NudgeMe",
        subtitle: "Asistente de Productividad con IA",
        description:
          "Asistente de productividad personal con inteligencia artificial, desarrollado en colaboraci\u00f3n con @camilomont. Organiza tareas diarias, semanales y mensuales adapt\u00e1ndose a niveles de energ\u00eda y momentos productivos del usuario con Claude API.",
        tech_stack: ["Angular", "NestJS", "MongoDB", "TypeScript", "TailwindCSS", "AI"],
        image: "/assets/projects/nudgeme/shot-1.png",
        images: [
          "/assets/projects/nudgeme/shot-1.png",
          "/assets/projects/nudgeme/shot-2.png",
          "/assets/projects/nudgeme/shot-3.png",
          "/assets/projects/nudgeme/shot-4.png",
          "/assets/projects/nudgeme/shot-5.png",
        ],
        year: "2026",
        links: {
          demo: null,
          github: "https://github.com/camilomont/nudgeme-frontend",
          githubBackend: "https://github.com/camilomont/nudgeme-backend",
        },
        featured: false,
        label: { es: "En desarrollo", en: "In Development" },
      },
      {
        id: "developer_portfolio",
        title: "Developer Portfolio",
        subtitle: "Portafolio Profesional Interactivo",
        description:
          "Portafolio personal desarrollado con Next.js 16, App Router y Tailwind CSS v4. Incluye galer\u00eda de proyectos con carrusel infinito, efecto tilt 3D, lightbox de im\u00e1genes, filtros din\u00e1micos, tema claro/oscuro, animaciones con Framer Motion y soporte multi-idioma.",
        tech_stack: ["Next.js", "TypeScript", "TailwindCSS", "React", "Framer Motion"],
        image: "/assets/projects/developer-portfolio/shot-1.jpg",
        images: [
          "/assets/projects/developer-portfolio/shot-1.jpg",
          "/assets/projects/developer-portfolio/shot-2.jpg",
          "/assets/projects/developer-portfolio/shot-3.jpg",
          "/assets/projects/developer-portfolio/shot-4.jpg",
          "/assets/projects/developer-portfolio/shot-5.jpg",
          "/assets/projects/developer-portfolio/shot-6.jpg",
        ],
        year: "2026",
        links: {
          demo: null,
          github: "https://github.com/alexisrojas14/developer-portfolio",
        },
        featured: true,
        label: { es: "Personal", en: "Personal" },
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
      {
        id: "nudgeme",
        title: "NudgeMe",
        subtitle: "AI Productivity Assistant",
        description:
          "AI-powered personal productivity assistant, developed in collaboration with @camilomont. Organizes daily, weekly, and monthly tasks adapting to energy levels and productive moments using Claude API.",
        tech_stack: ["Angular", "NestJS", "MongoDB", "TypeScript", "TailwindCSS", "AI"],
        image: "/assets/projects/nudgeme/shot-1.png",
        images: [
          "/assets/projects/nudgeme/shot-1.png",
          "/assets/projects/nudgeme/shot-2.png",
          "/assets/projects/nudgeme/shot-3.png",
          "/assets/projects/nudgeme/shot-4.png",
          "/assets/projects/nudgeme/shot-5.png",
        ],
        year: "2026",
        links: {
          demo: null,
          github: "https://github.com/camilomont/nudgeme-frontend",
          githubBackend: "https://github.com/camilomont/nudgeme-backend",
        },
        featured: false,
        label: { es: "En desarrollo", en: "In Development" },
      },
      {
        id: "developer_portfolio",
        title: "Developer Portfolio",
        subtitle: "Interactive Professional Portfolio",
        description:
          "Personal portfolio built with Next.js 16, App Router, and Tailwind CSS v4. Features include an infinite carousel project gallery, 3D tilt effect, image lightbox, dynamic filters, dark/light theme, Framer Motion animations, and multi-language support.",
        tech_stack: ["Next.js", "TypeScript", "TailwindCSS", "React", "Framer Motion"],
        image: "/assets/projects/developer-portfolio/shot-1.jpg",
        images: [
          "/assets/projects/developer-portfolio/shot-1.jpg",
          "/assets/projects/developer-portfolio/shot-2.jpg",
          "/assets/projects/developer-portfolio/shot-3.jpg",
          "/assets/projects/developer-portfolio/shot-4.jpg",
          "/assets/projects/developer-portfolio/shot-5.jpg",
          "/assets/projects/developer-portfolio/shot-6.jpg",
        ],
        year: "2026",
        links: {
          demo: null,
          github: "https://github.com/alexisrojas14/developer-portfolio",
        },
        featured: true,
        label: { es: "Personal", en: "Personal" },
      },
    ],
  },
};

// ProjectCard: tarjeta estilo Xbox 360 game tile con temática código
function ProjectCard({
  project,
  lang,
}: {
  project: Project;
  lang: "es" | "en";
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const images = project.images || (project.image ? [project.image] : []);

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

  useEffect(() => {
    if (images.length <= 1 || lightboxOpen) return;
    const interval = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length, lightboxOpen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const maxDeg = 6;
    setRotateX((-mouseY / (rect.height / 2)) * maxDeg);
    setRotateY((mouseX / (rect.width / 2)) * maxDeg);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

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

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => images.length > 0 && setLightboxOpen(true)}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          rotateX,
          rotateY,
        }}
        className={`relative bg-card border rounded-lg overflow-hidden w-full cursor-pointer group ${
          project.featured
            ? "border-yellow-500/40"
            : "border-card-border hover:border-primary/30"
        }`}
        whileHover={{
          boxShadow: project.featured
            ? "0 8px 32px rgba(234, 179, 8, 0.25)"
            : "0 8px 32px rgba(0, 242, 255, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Cover art */}
        <div className="relative h-64 overflow-hidden">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[imgIndex]}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/60 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/60 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent z-10" />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                  className={`h-1 rounded-full transition-all ${
                    i === imgIndex ? "bg-primary w-2.5" : "bg-foreground/30 hover:bg-foreground/50 w-1"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-foreground font-bold text-base leading-tight">
              {project.title}
            </h3>
            {project.year && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-mono text-muted bg-muted/10 border border-muted/20 rounded">
                {project.year}
              </span>
            )}
          </div>
          <p className="text-primary text-xs font-mono mb-2">{project.subtitle}</p>

          <div className="flex items-center gap-1.5 mb-2">
            {project.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {lang === "es" ? "Destacado" : "Featured"}
              </span>
            )}
            {project.label && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 rounded">
                {project.label[lang]}
              </span>
            )}
          </div>

          <div className={expanded ? "mb-2" : ""}>
            <p className={`text-muted text-xs leading-relaxed ${expanded ? "" : "line-clamp-1"}`}>
              {project.description}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              className="text-[10px] font-mono text-primary/60 hover:text-primary transition-colors mt-0.5 cursor-pointer"
            >
              {expanded
                ? (lang === "es" ? "[-] colapsar" : "[-] collapse")
                : (lang === "es" ? "[+] m\u00e1s info" : "[+] more info")}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hover links con tooltip estilo navbar */}
        {(project.links.github || project.links.githubBackend) && (
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            {project.links.github && (
              <div className="relative group/link">
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-card-border text-muted hover:text-primary hover:border-primary/50 transition-all block"
                >
                  <FaGithub size={14} />
                </a>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-primary bg-card border border-card-border px-2 py-0.5 rounded opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {project.links.githubBackend ? "Frontend" : "GitHub"}
                </span>
              </div>
            )}
            {project.links.githubBackend && (
              <div className="relative group/link">
                <a
                  href={project.links.githubBackend}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-card-border text-muted hover:text-primary hover:border-primary/50 transition-all block"
                >
                  <FaGithub size={14} />
                </a>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-primary bg-card border border-card-border px-2 py-0.5 rounded opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Backend
                </span>
              </div>
            )}
          </div>
        )}
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
              unoptimized
              className="object-contain rounded-lg shadow-2xl"
              sizes="88vw"
            />
          </motion.div>
          <button
            onClick={() => setLightboxOpen(false)}
            className="fixed top-5 right-5 p-3 rounded-full bg-background/20 backdrop-blur-md text-white hover:bg-white/30 transition-all z-[9999]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                className="fixed left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 backdrop-blur-md text-white hover:bg-white/30 transition-all z-[9999]"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(e); }}
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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [filterTech, setFilterTech] = useState<FilterKey>("All");
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<string | null>(null);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableLabels = [...new Set(c.projects.filter(p => p.label).map(p => p.label![lang]))];
  const availableYears = [...new Set(c.projects.filter(p => p.year).map(p => p.year!))].sort().reverse();

  const allFilters: FilterKey[] = ["All", "Java", "Python", "React", "Next.js", "Angular", "TypeScript", "Docker", "AI"];

  const isFiltered = filterTech !== "All" || filterLabel !== null || filterYear !== null || filterFeatured;

  const filteredProjects = c.projects.filter((p) => {
    if (filterTech !== "All" && !p.tech_stack.includes(filterTech)) return false;
    if (filterLabel && p.label?.[lang] !== filterLabel) return false;
    if (filterYear && p.year !== filterYear) return false;
    if (filterFeatured && !p.featured) return false;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.id === "developer_portfolio") return 1;
    if (b.id === "developer_portfolio") return -1;
    const yearA = a.year ? parseInt(a.year) : 0;
    const yearB = b.year ? parseInt(b.year) : 0;
    if (yearB !== yearA) return yearB - yearA;
    return c.projects.indexOf(a) - c.projects.indexOf(b);
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const total = sortedProjects.length;
  const goToPrev = useCallback(() => {
    setSelectedIdx((prev) => (prev - 1 + total) % total);
  }, [total]);
  const goToNext = useCallback(() => {
    setSelectedIdx((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPrev, goToNext]);

  return (
    <section
      id="projects"
      className="relative w-full flex flex-col items-center justify-center px-4 md:px-8 py-14 bg-gradient-to-b from-background via-card/50 to-background"
    >
      <div className="relative z-10 w-full">
        {/* Header + filters - constrained width */}
        <div className="max-w-6xl mx-auto">
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

          {/* Xbox 360 Blade-style filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1 mb-4">
            {allFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilterTech(f)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-mono transition-all cursor-pointer ${
                  filterTech === f
                    ? "bg-card text-primary border-b-2 border-primary shadow-[0_0_12px_rgba(0,242,255,0.15)]"
                    : "bg-transparent text-muted border-b-2 border-transparent hover:text-foreground hover:border-muted/30"
                }`}
              >
                <span className={filterTech === f ? "text-primary" : "text-muted"}>
                  {FILTERS.find((x) => x.key === f)?.icon}
                </span>
                {f === "All" ? (lang === "es" ? "Todo" : "All") : f}
              </button>
            ))}
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={`px-2.5 py-1.5 text-[10px] font-mono transition-all cursor-pointer border-b-2 ${
                showAdvanced
                  ? "bg-card text-secondary border-secondary text-primary shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                  : "bg-transparent text-muted border-transparent hover:text-foreground hover:border-muted/30"
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
        </div>

        {/* Xbox 360 Cover Flow Carousel */}
        <div className="relative" style={{ perspective: '1200px' }}>
          <button
            onClick={goToPrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-background/60 backdrop-blur-sm text-muted hover:text-primary border border-card-border/30 hover:border-primary/40 transition-all hover:shadow-[0_0_15px_var(--primary)]"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-background/60 backdrop-blur-sm text-muted hover:text-primary border border-card-border/30 hover:border-primary/40 transition-all hover:shadow-[0_0_15px_var(--primary)]"
          >
            <ChevronRight size={26} />
          </button>
          <div className="grid place-items-center h-[600px] max-w-[1600px] mx-auto px-4" style={{ perspective: '1200px' }}>
            <AnimatePresence>
              {sortedProjects.map((project, i) => {
                const diff = (i - selectedIdx + total) % total;
                let offset = diff;
                if (offset > Math.floor(total / 2)) offset -= total;
                if (Math.abs(offset) > 2) return null;

                const absOff = Math.abs(offset);
                const isFront = absOff <= 1;

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      gridRow: 1,
                      gridColumn: 1,
                      x: offset * 375,
                      scale: absOff === 0 ? 1 : absOff === 1 ? 0.93 : 0.72,
                      rotateY: isFront ? 0 : offset < 0 ? 14 : -14,
                      opacity: isFront ? 1 : 0.5,
                      zIndex: absOff === 0 ? 10 : absOff === 1 ? 8 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="cursor-pointer w-[350px]"
                    style={{ transformStyle: "preserve-3d" }}
                    whileHover={{
                      y: -4,
                      scale: absOff === 0 ? 1.04 : absOff === 1 ? 0.96 : 0.75,
                      filter: "brightness(1.12)",
                    }}
                    onClick={() => {
                      if (offset < 0) goToPrev();
                      else if (offset > 0) goToNext();
                    }}
                  >
                    <ProjectCard project={project} lang={lang} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
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
