"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { FolderOpen, FileText } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface AboutSectionProps {
  lang: Language;
}

type FileKey = "manifesto" | "architecture" | "privacy" | "community";

export function AboutSection({ lang }: AboutSectionProps) {
  const t = translations[lang].about;
  const [activeFile, setActiveFile] = useState<FileKey>("manifesto");

  const files = {
    manifesto: {
      name: "manifesto.md",
      content: lang === "en" ? `
# The Foliox Manifesto

## 1. Software is art; portfolio is also.
Your profile shouldn't be a rigid, locked template. We believe in layout freedom, Bento grids, and absolute design flexibility.

## 2. Deterministic AST compilation.
We don't generate messy layout code. Every pixel is calculated and compiled directly from a structured TS AST to clean Kramdown Markdown.

## 3. Your data, your keys.
We advocate for BYOK (Bring Your Own Key) for LLM tools. Zero third-party databases tracking your profile content.
      ` : `
# El Manifiesto Foliox

## 1. El software es arte; el portafolio también.
Tu perfil no debería ser una plantilla rígida. Creemos en la libertad de layouts, Bento grids y adaptabilidad visual directa.

## 2. Compilación determinista sobre HTML.
No generamos código sucio. Cada pixel es calculado y compilado directamente de un AST estructurado en TS a Markdown limpio estándar.

## 3. Tu información, tus llaves.
Fomentamos el BYOK (Bring Your Own Key) para la IA. Cero base de datos propietaria registrando tus datos de perfil.
      `,
    },
    architecture: {
      name: "architecture.json",
      content: `
{
  "compiler": {
    "version": "1.0.0-beta",
    "parser": "TS-AST-Parser",
    "target": "GitHub-Flavored-Markdown",
    "formatters": ["Prettier", "Swiss-Align"]
  },
  "storage": {
    "provider": "Appwrite",
    "bucket": "assets-forge",
    "encryption": "AES-256-Local"
  }
}
      `,
    },
    privacy: {
      name: "security.txt",
      content: lang === "en" ? `
[SECURITY PRINCIPLE]
All API Keys (OpenAI, Gemini, DeepSeek) are stored solely inside your browser's window.localStorage.

No data is sent to Foliox servers.
Encryption: WebCrypto API (AES-GCM).
Network: Direct browser-to-LLM REST calls.
      ` : `
[PRINCIPIO DE SEGURIDAD]
Todas las API Keys (OpenAI, Gemini, DeepSeek) se almacenan únicamente dentro del window.localStorage de tu navegador.

Ningún dato es enviado a los servidores de Foliox.
Cifrado: WebCrypto API (AES-GCM).
Red: Llamadas REST directas del navegador al LLM.
      `,
    },
    community: {
      name: "community.md",
      content: lang === "en" ? `
[COMMUNITY & LICENSE]

Repository: github.com/MiguelVivar/Foliox
★ Stars: 1,420+
⑂ Forks: 184
⇄ Pull Requests: 42 Open

License: MIT (permissive)
✓ Commercial use permitted
✓ Modification permitted
✓ Distribution permitted
✓ Private use permitted

100% Open Source. No vendor lock-in — audit it, run it, self-host it forever.
      ` : `
[COMUNIDAD Y LICENCIA]

Repositorio: github.com/MiguelVivar/Foliox
★ Estrellas: 1,420+
⑂ Forks: 184
⇄ Pull Requests: 42 Abiertos

Licencia: MIT (permisiva)
✓ Uso comercial permitido
✓ Modificación permitida
✓ Distribución permitida
✓ Uso privado permitido

100% Código Abierto. Sin dependencia de proveedor — audítalo, ejecútalo, auto-alójalo para siempre.
      `,
    },
  };

  return (
    <section id="philosophy" className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Heading Copy */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <SectionHeader
            badge={t.sectionBadge}
            title={t.sectionTitle}
            description={t.sectionDesc}
            className="mb-8"
          />
          <div className="font-sans text-sm text-[var(--text-muted)] space-y-4">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
          </div>
        </div>

        {/* Right Column: Code/Manifesto Editor Mockup with Sidebar Selector */}
        <div className="lg:col-span-7 w-full">
          <div className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden flex flex-col md:flex-row h-[360px]">
            
            {/* Sidebar Folder list */}
            <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 flex flex-row md:flex-col gap-2 font-mono text-[10px] overflow-x-auto md:overflow-x-visible shrink-0 select-none">
              <div className="hidden md:flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[var(--text-muted)] pb-2 border-b border-[var(--border-subtle)] mb-1">
                <FolderOpen size={10} />
                <span>WORKSPACE</span>
              </div>
              
              {(Object.keys(files) as FileKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveFile(key)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm w-full text-left border ${
                    activeFile === key
                      ? "border-[var(--border-focus)] bg-[var(--bg-canvas)] text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <FileText size={10} className="shrink-0" />
                  <span>{files[key].name}</span>
                </button>
              ))}
            </div>

            {/* Main File Contents Editor */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 select-none">
                <span className="font-mono text-xs text-[var(--text-muted)]">{files[activeFile].name}</span>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-subtle)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-subtle)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-subtle)]" />
                </div>
              </div>

              {/* Text Area contents */}
              <div className="flex-1 p-5 font-mono text-xs text-[var(--text-primary)] leading-relaxed select-text overflow-y-auto bg-[var(--bg-canvas)] whitespace-pre-wrap">
                {files[activeFile].content.trim()}
              </div>

              <div className="border-t border-[var(--border-subtle)] px-4 py-1.5 text-[9px] text-[var(--text-muted)] flex justify-between bg-[var(--bg-surface)] select-none">
                <span>UTF-8 // Static Workspace</span>
                <span className="text-emerald-400">[READY]</span>
              </div>
            </div>

          </div>

          {activeFile === "community" && (
            <a
              href="https://github.com/MiguelVivar/Foliox"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] hover:border-[var(--border-focus)] transition-colors"
            >
              {lang === "en" ? "Explore Repository" : "Explorar Repositorio"} →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
