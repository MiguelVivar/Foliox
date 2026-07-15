"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Monitor, Moon, Sun, Globe, Terminal, Sparkles, X } from "lucide-react";
import { Language } from "@/lib/translations";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export function CommandPalette({ isOpen, onClose, lang, setLang }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    {
      id: "toggle-theme",
      name: lang === "en" ? "Toggle Color Theme" : "Alternar Tema de Color",
      shortcut: "T",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: "lang-es",
      name: lang === "en" ? "Set language to Spanish" : "Establecer idioma a Español",
      shortcut: "E",
      icon: Globe,
      action: () => {
        setLang("es");
        onClose();
      },
    },
    {
      id: "lang-en",
      name: lang === "en" ? "Set language to English" : "Establecer idioma a Inglés",
      shortcut: "A",
      icon: Globe,
      action: () => {
        setLang("en");
        onClose();
      },
    },
    {
      id: "open-editor",
      name: lang === "en" ? "Launch Visual Editor Workspace" : "Iniciar Espacio de Trabajo del Editor",
      shortcut: "↵",
      icon: Terminal,
      action: () => {
        router.push("/editor");
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[var(--bg-canvas)]/70 backdrop-blur-sm">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 pointer-events-auto" onClick={onClose} />

      {/* Main dialog box */}
      <div className="relative w-full max-w-lg rounded-md border border-[var(--border-focus)] bg-[var(--bg-surface)] flex flex-col font-mono text-xs shadow-none">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search size={16} className="text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? "Type a command or search..." : "Escribe un comando o busca..."}
            className="flex-1 bg-transparent text-[var(--text-primary)] outline-none placeholder-[var(--text-muted)]"
          />
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 border border-transparent rounded hover:border-[var(--border-subtle)]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Command list */}
        <div className="max-h-64 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-sm hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] hover:border-[var(--border-subtle)] border border-transparent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} className="text-[var(--text-muted)]" />
                    <span>{cmd.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] border border-[var(--border-subtle)] px-1.5 py-0.5 rounded-sm bg-[var(--bg-canvas)]">
                    {cmd.shortcut}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-[var(--text-muted)]">
              {lang === "en" ? "No commands found" : "No se encontraron comandos"}
            </div>
          )}
        </div>

        {/* Command palette status footer */}
        <div className="flex justify-between items-center px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-muted)] text-[9px]">
          <span>ESC to close</span>
          <span>FOLIOX COMMAND WIDGET</span>
        </div>
      </div>
    </div>
  );
}
