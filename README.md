# 👨‍💻 Alexis Rojas — Developer Portfolio

Portafolio profesional con estética híbrida **Editor de Código × Gamer**. Construido con Next.js 16, Tailwind CSS v4 y Framer Motion.

## 🚀 Stack

| Tecnología | Uso |
|-----------|-----|
| **Next.js 16** (App Router) | Framework React con renderizado estático |
| **Tailwind CSS v4** | Estilos utilitarios con JIT |
| **Framer Motion** | Animaciones lazy en secciones secundarias |
| **Lucide React** | Iconos tree-shakeables |
| **next-themes** | Modo claro/oscuro |
| **EmailJS** | Formulario de contacto client-side |

## 📁 Estructura del Proyecto

```
├── app/
│   ├── globals.css        # Variables CSS, animaciones, Tailwind
│   ├── layout.tsx         # Root layout: fuentes Geist, ThemeProvider, bfcache
│   └── page.tsx           # Orquestador: imports estáticos + dinámicos
├── components/
│   ├── Hero.tsx           # Sección principal (estático, sin Framer Motion)
│   ├── Navbar.tsx         # Navegación flotante hide/show
│   ├── ScrollIndicator.tsx# Barra de progreso de scroll
│   ├── AboutMe.tsx        # Bento Grid biográfico (lazy)
│   ├── TechStack.tsx      # Tabs de tecnologías (lazy)
│   ├── Experience.tsx     # Timeline laboral (lazy)
│   ├── Projects.tsx       # Galería 3D con lightbox (lazy)
│   ├── Education.tsx      # Logros educativos (lazy)
│   ├── Extra.tsx          # Hobbies (lazy + sin SSR)
│   ├── Contact.tsx        # Formulario EmailJS (lazy + sin SSR)
│   ├── SetLang.tsx        # Actualiza <html lang>
│   ├── ThemeProvider.tsx  # Wrapper next-themes
│   └── ThemeToggle.tsx    # Botón cambio de tema
├── hooks/
│   └── useScrollDirection.ts
├── lib/
│   └── emailjs.ts         # Config EmailJS desde env vars
├── public/
│   ├── assets/projects/   # Screenshots de proyectos
│   └── locales/           # i18n (hero.json, about.json)
└── scripts/
    └── extract_pdf.js     # Utilidad para extraer texto del CV
```

## 🏗️ Orden de Secciones

1. **Hero** — Avatar, typewriter, badge disponibilidad, redes, CV
2. **About Me** — Bento Grid con bio, filosofía, ubicación, intereses
3. **Tech Stack** — Filtros tipo pestañas de editor (backend.py, frontend.tsx, devops.sh)
4. **Experience** — Timeline vertical estilo Git Graph
5. **Projects** — Carrusel 3D con lightbox, filtros por tecnología
6. **Education** — Grid de logros con rarezas (Legendario, Épico, Raro)
7. **Extra** — Hobbies, música, hardware
8. **Contact** — Formulario estilo script (`contact_script.py`)

## ⚡ Optimizaciones de Performance

| Optimización | Impacto |
|-------------|---------|
| **Imports dinámicos** con `next/dynamic` | Lazy loading de secciones below-the-fold |
| **`ssr: false`** en Extra y Contact | ~200 KB menos en ruta crítica |
| **`optimizePackageImports`** para `react-icons/*`, `framer-motion`, `lucide-react` | Elimina barrel exports, ~600 KB menos |
| **Hero sin Framer Motion** | LCP rápido, animaciones CSS nativas |
| **Typewriter con `requestAnimationFrame` + `useRef`** | 0 re-renders de React por caracter |
| **Event listeners `{ passive: true }`** | No bloquean scrolling |
| **`display: "swap"` en fuentes Geist** | Evita FOIT (texto invisible) |
| **bfcache handler** (`pageshow` + `persisted`) | Restauración instantánea desde caché |
| **Imagen avatar con `priority`** | Precarga LCP |
| **Imagen huérfana 1.7 MB eliminada** | -1.7 MB network payload |
| **`animejs` eliminado** (no se usaba) | ~200 KB menos de dependencia |

## 🎨 Identidad Visual

- **Fondo:** `#050505` (dark) / `#ced6e0` (light)
- **Acento primario:** Cyan `#00f2ff` (efecto neón)
- **Acento secundario:** Purple `#bc00ff`
- **Tipografía:** Geist Sans (títulos) + Geist Mono (código)

## 🔧 Comandos

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servir build
npm run lint     # ESLint
```

## 🚀 Deploy en Vercel

### 1. Preparar repositorio

```bash
git add .
git commit -m "feat: portfolio completo con optimizaciones de performance"
git push origin main
```

### 2. Conectar con Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar repositorio `alexisrojas14/developer-portfolio`
3. Framework: **Next.js** (detectado automáticamente)
4. Variables de entorno requeridas (`.env.local`):
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
5. Deploy → Vercel build automático

### 3. Post-deploy

- Dominio personalizado (opcional) en Vercel Dashboard → Domains
- EmailJS: configurar templates con los IDs usados en las vars de entorno
