import React from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Terminal, FileCode, FolderOpen } from "lucide-react";

export function AboutSection() {
  return (
    <section id="philosophy" className="mx-auto max-w-7xl px-6 py-24 border-b border-[var(--border-subtle)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Heading Copy */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <SectionHeader
            badge="02 // THE MANIFESTO"
            title="Why we built Foliox"
            description="La paradoja del desarrollador: construimos sistemas de alta disponibilidad y arquitecturas elegantes, pero presentamos nuestro trabajo en perfiles genéricos o plantillas de MS Word."
            className="mb-8"
          />
          <div className="font-sans text-sm text-[var(--text-muted)] space-y-4">
            <p>
              Foliox nace para cerrar esa brecha. Queríamos la maleabilidad visual de herramientas de diseño modernas como Canva, combinada con la estructura y robustez semántica que los ingenieros valoramos en nuestro código.
            </p>
            <p>
              Queremos que tu perfil técnico se sienta tan pulido como tus repositorios. Y lo logramos permitiéndote diseñar visualmente mientras compilamos directamente a sintaxis compatible con GitHub en tiempo real.
            </p>
          </div>
        </div>

        {/* Right Column: Code/Manifesto Editor Mockup */}
        <div className="lg:col-span-7 w-full">
          <div className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden shadow-none">
            {/* IDE Title / Tab Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2">
              <div className="flex items-center gap-2">
                <FolderOpen size={12} className="text-[var(--text-muted)]" />
                <span className="font-mono text-xs text-[var(--text-muted)]">src/docs/manifesto.md</span>
              </div>
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-subtle)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-subtle)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-subtle)]" />
              </div>
            </div>

            {/* Editor Body */}
            <div className="p-6 font-mono text-xs text-[var(--text-primary)] leading-relaxed select-text space-y-4 max-h-[400px] overflow-y-auto bg-[var(--bg-canvas)]">
              <div>
                <span className="text-purple-400"># El Manifiesto Foliox</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">## 1. El software es arte; el portafolio también.</span>
                <p className="pl-4 mt-1 text-[var(--text-muted)]">
                  Tu perfil no debería ser un formulario rígido. Creemos en la libertad de layouts, rejillas Bento y adaptabilidad visual directa.
                </p>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">## 2. Compilación determinista sobre HTML inyectado.</span>
                <p className="pl-4 mt-1 text-[var(--text-muted)]">
                  No generamos código sucio. La landing de Foliox compila código nativo AST en TypeScript a Markdown estándar compatible con el motor Kramdown de GitHub.
                </p>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">## 3. Tu información, tus llaves.</span>
                <p className="pl-4 mt-1 text-[var(--text-muted)]">
                  Fomentamos el BYOK (Bring Your Own Key) para la IA. Si quieres generar copywriting para tu currículum, usa tus propios tokens de API. Sin intermediarios que revendan tu telemetría o almacenen tus contraseñas.
                </p>
              </div>
              <div className="border-t border-[var(--border-subtle)] pt-4 text-[10px] text-[var(--text-muted)] flex justify-between">
                <span>Lines: 42  Words: 284</span>
                <span className="text-emerald-400">[EOF - SUCCESS]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
