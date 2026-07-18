"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { ChevronDown } from "lucide-react";
import { Language } from "@/lib/translations";

interface FAQSectionProps {
  lang: Language;
}

interface FAQItem {
  q: { en: string; es: string };
  a: { en: string; es: string };
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: {
      en: "Is Foliox really free to use?",
      es: "¿Es Foliox realmente gratis?",
    },
    a: {
      en: "Yes. The entire visual editor, AST compiler, local AI (BYOK), and Markdown exporter run 100% inside your browser with no account required. The Pro plan adds cloud sync and one-click GitHub deploy.",
      es: "Sí. Todo el editor visual, el compilador AST, la IA local (BYOK) y el exportador de Markdown funcionan 100% dentro de tu navegador sin necesidad de cuenta. El plan Pro agrega sincronización en la nube y despliegue a GitHub con un clic.",
    },
  },
  {
    q: {
      en: "How does the AI work? Does Foliox store my API keys?",
      es: "¿Cómo funciona la IA? ¿Foliox almacena mis claves API?",
    },
    a: {
      en: "Never. Your API keys (OpenAI, Gemini, Claude, DeepSeek) are stored only in your browser's localStorage, encrypted via the WebCrypto API. Foliox makes direct REST calls from your browser to the LLM provider — no proxy server involved.",
      es: "Jamás. Tus claves API (OpenAI, Gemini, Claude, DeepSeek) se almacenan únicamente en el localStorage de tu navegador, cifradas con la WebCrypto API. Foliox realiza llamadas REST directas desde tu navegador al proveedor del LLM, sin ningún servidor proxy.",
    },
  },
  {
    q: {
      en: "What is an AST and why does it matter for README generation?",
      es: "¿Qué es un AST y por qué es relevante para generar READMEs?",
    },
    a: {
      en: "An Abstract Syntax Tree (AST) is a structured, deterministic representation of your profile blocks (Header, Skills, Stats, ASCII Art). Instead of generating HTML or string templates that can break, Foliox compiles the AST directly to clean GitHub-Flavored Markdown — guaranteed to render correctly everywhere.",
      es: "Un Árbol de Sintaxis Abstracta (AST) es una representación estructurada y determinista de los bloques de tu perfil (Header, Skills, Stats, Arte ASCII). En lugar de generar HTML o plantillas de texto que pueden romperse, Foliox compila el AST directamente a Markdown GitHub-Flavored limpio, garantizando que se renderice correctamente en todos lados.",
    },
  },
  {
    q: {
      en: "Can I use Foliox for my portfolio site, not just GitHub profile?",
      es: "¿Puedo usar Foliox para mi sitio de portafolio, no solo el perfil de GitHub?",
    },
    a: {
      en: "Absolutely. The Pro plan includes a PDF export optimized for ATS recruitment systems, a JSON Resume output, and a hosted portfolio page. The free tier exports a full Markdown file compatible with any static site generator (Astro, Hugo, Jekyll).",
      es: "Por supuesto. El plan Pro incluye exportación PDF optimizada para sistemas ATS de reclutamiento, salida JSON Resume y una página de portafolio alojada. El nivel gratuito exporta un archivo Markdown completo compatible con cualquier generador de sitios estáticos (Astro, Hugo, Jekyll).",
    },
  },
  {
    q: {
      en: "Is Foliox open source? Can I self-host it?",
      es: "¿Foliox es de código abierto? ¿Puedo auto-alojarlo?",
    },
    a: {
      en: "Yes. Foliox is MIT-licensed. You can fork, audit, modify, and self-host the entire application at zero cost. No vendor lock-in — ever.",
      es: "Sí. Foliox tiene licencia MIT. Puedes hacer fork, auditar, modificar y auto-alojar toda la aplicación sin costo alguno. Sin dependencia de proveedor, nunca.",
    },
  },
  {
    q: {
      en: "How does the one-click GitHub deploy work?",
      es: "¿Cómo funciona el despliegue a GitHub con un clic?",
    },
    a: {
      en: "Foliox uses GitHub OAuth via Appwrite and the Octokit REST API to push the compiled Markdown directly to your special `username/username` repository — the one that shows up as your GitHub profile README. It does an atomic commit, so your profile is always in sync.",
      es: "Foliox usa OAuth de GitHub a través de Appwrite y la API REST de Octokit para subir el Markdown compilado directamente a tu repositorio especial `usuario/usuario`, el que aparece como tu README de perfil de GitHub. Realiza un commit atómico para que tu perfil esté siempre sincronizado.",
    },
  },
];

function FAQItem({ item, lang }: { item: FAQItem; lang: Language }) {
  const [open, setOpen] = useState(false);
  const q = lang === "en" ? item.q.en : item.q.es;
  const a = lang === "en" ? item.a.en : item.a.es;

  return (
    <div
      className={`border border-[var(--border-subtle)] rounded-sm bg-[var(--bg-surface)] transition-colors ${
        open ? "border-[var(--border-focus)]" : "hover:border-[var(--border-focus)]"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-mono text-sm text-[var(--text-primary)] leading-snug">{q}</span>
        <ChevronDown
          size={16}
          className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 font-sans text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-4 fade-in-up">
          {a}
        </div>
      )}
    </div>
  );
}

export function FAQSection({ lang }: FAQSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)]">
      <SectionHeader
        badge={lang === "en" ? "04 // COMMON QUESTIONS" : "04 // PREGUNTAS FRECUENTES"}
        title={lang === "en" ? "Frequently asked questions." : "Preguntas frecuentes."}
        description={
          lang === "en"
            ? "Everything you need to know before getting started with Foliox."
            : "Todo lo que necesitas saber antes de comenzar con Foliox."
        }
        className="mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
        {FAQ_ITEMS.map((item, i) => (
          <FAQItem key={i} item={item} lang={lang} />
        ))}
      </div>

      {/* CTA nudge */}
      <div className="mt-12 flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
        <span className="text-[var(--accent-phosphor)]">//</span>
        <span>
          {lang === "en"
            ? "Still have questions?"
            : "¿Aún tienes preguntas?"}{" "}
          <a
            href="https://github.com/MiguelVivar/Foliox/discussions"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-primary)] hover:underline underline-offset-4"
          >
            {lang === "en" ? "Open a GitHub Discussion →" : "Abre una GitHub Discussion →"}
          </a>
        </span>
      </div>
    </section>
  );
}
