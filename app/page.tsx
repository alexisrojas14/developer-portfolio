"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SetLang from "@/components/SetLang";
import Navbar from "@/components/Navbar";
import ScrollIndicator from "@/components/ScrollIndicator";
import Hero from "@/components/Hero";

const AboutMe = dynamic(() => import("@/components/AboutMe"), { ssr: true });
const TechStack = dynamic(() => import("@/components/TechStack"), { ssr: true });
const Experience = dynamic(() => import("@/components/Experience"), { ssr: true });
const Education = dynamic(() => import("@/components/Education"), { ssr: true });
const Extra = dynamic(() => import("@/components/Extra"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects"), { ssr: true });

export default function Home() {
  const [lang, setLang] = useState<"es" | "en">("es");

  return (
    <>
      <SetLang lang={lang} />
      <main>
      <Navbar lang={lang} onLangChange={setLang} />
      <ScrollIndicator />
      <Hero lang={lang} onLangChange={setLang} />
      <AboutMe lang={lang} />
      <TechStack lang={lang} />
      <Experience lang={lang} />
      <Projects lang={lang} />
      <Education lang={lang} />
      <Extra lang={lang} />
      <Contact lang={lang} />
      </main>
    </>
  );
}
