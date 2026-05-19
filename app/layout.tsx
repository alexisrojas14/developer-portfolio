// Imports: metadatos SEO, fuentes Geist, ThemeProvider y estilos globales
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alexis Rojas - Portfolio",
  description: "Full Stack Developer | Python, Java & DevOps. Desarrollador de software con experiencia en React, Docker, GCP e integración de IA.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#050505" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("pageshow", function(e) {
                if (e.persisted) {
                  document.querySelectorAll("[data-animate]").forEach(function(el) {
                    el.style.animation = "none";
                    el.offsetHeight;
                    el.style.animation = "";
                  });
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
