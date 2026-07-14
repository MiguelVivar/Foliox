# Foliox — Fase 1 (Scaffold & Tokens) + Fase 2 (Átomos y Moléculas Base) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar la Fase 1 (dependencias + carpetas atómicas que faltan) y la Fase 2 (los 5
átomos y 2 moléculas base) de Foliox, dejando el proyecto listo para que la Fase 3 (store de
Zustand + servicios Appwrite) construya sobre una base tipada y sin degradados.

**Architecture:** Componentes de presentación puros bajo `src/components/{atoms,molecules}/`,
sin estado de negocio ni llamadas a servicios. Toda variante visual se resuelve con clases de
Tailwind v4 contra los tokens semánticos ya definidos en `src/app/app.css` (`--bg-surface`,
`--border-subtle`, etc.), nunca con valores hardcodeados. `cn()` (clsx + tailwind-merge) es la
única forma de componer clases condicionales.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5 (strict), Tailwind CSS v4,
`clsx`, `tailwind-merge`, `lucide-react`.

## Global Constraints

- Gestor de paquetes: **pnpm** exclusivamente (nunca `npm`/`yarn`).
- Zero Gradients: prohibido `bg-gradient-*`, `shadow-xl` o cualquier `box-shadow` difuminado.
- Radios: `rounded-sm` (badges/inputs pequeños) o `rounded-md` (contenedores/botones). Nunca
  `rounded-xl` ni `rounded-full` (salvo avatares, fuera de alcance aquí).
- Bordes: 1px sólido (`border` de Tailwind = 1px), cambio de color en focus/hover instantáneo,
  sin `transition-*` en color de borde ni sombra.
- TypeScript estricto: cero `any`. Props de componentes exportados como `type Props = {}` con
  destructuring en la firma de la función.
- Todos los estilos de color usan las variables semánticas de `app.css` (`var(--bg-surface)`,
  `var(--text-primary)`, etc.), nunca clases de color crudas de Tailwind (`bg-gray-800`, etc.).
- **Sin test runner esta fase**: el spec (`docs/superpowers/specs/2026-07-13-foliox-fase1-fase2-design.md`)
  decidió explícitamente diferir Vitest/Jest hasta que haya lógica real que lo justifique. Cada
  tarea se verifica con `pnpm exec tsc --noEmit` (chequeo de tipos) y, cuando aplica, con
  inspección manual en `pnpm dev`. Esto reemplaza el ciclo RED/GREEN de TDD para esta fase — no es
  un paso omitido, es la decisión ya aprobada en el spec.
- Alias de imports: `@/*` → `./src/*` (ya configurado en `tsconfig.json`).

---

### Task 1: Dependencias base + utilidad `cn()`

**Files:**
- Modify: `package.json` (vía `pnpm add`)
- Create: `src/lib/cn.ts`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: nada.
- Produces: `cn(...inputs: ClassValue[]): string` exportado desde `@/lib/cn`, usado por todas las
  tareas siguientes que definan componentes con className condicional.

- [ ] **Step 1: Instalar dependencias**

Run: `pnpm add clsx tailwind-merge lucide-react`
Expected: `package.json` gana `clsx`, `tailwind-merge` y `lucide-react` en `dependencies`, y
`pnpm-lock.yaml` se actualiza sin errores.

- [ ] **Step 2: Crear `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/cn.ts
git commit -m "chore: add clsx, tailwind-merge, lucide-react and cn() utility"
```

---

### Task 2: Mover el cliente de Appwrite a `src/config/`

**Files:**
- Create: `src/config/appwrite.ts`
- Delete: `src/lib/appwrite.ts`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: nada.
- Produces: `client`, `account`, `databases` exportados desde `@/config/appwrite` (antes vivían
  en `@/lib/appwrite` — ningún archivo del repo los importa todavía, así que no hay nada más que
  actualizar).

- [ ] **Step 1: Crear `src/config/appwrite.ts` con el mismo contenido que `src/lib/appwrite.ts`**

```ts
import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
```

- [ ] **Step 2: Borrar el archivo viejo**

Run: `rm src/lib/appwrite.ts` (o `Remove-Item src/lib/appwrite.ts` en PowerShell)
Expected: `src/lib/appwrite.ts` ya no existe; `src/lib/` queda solo con `cn.ts` (de la Task 1).

- [ ] **Step 3: Confirmar que nada más lo importaba**

Run: `grep -rn "lib/appwrite" src` (o `Select-String -Path src -Pattern "lib/appwrite" -Recurse`)
Expected: sin resultados.

- [ ] **Step 4: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 5: Commit**

```bash
git add src/config/appwrite.ts src/lib/appwrite.ts
git commit -m "refactor: move Appwrite client from lib/ to config/ per atomic architecture"
```

---

### Task 3: Átomo `DotGrid`

**Files:**
- Create: `src/components/atoms/DotGrid.tsx`
- Modify: `src/app/app.css:61-71` (bloque `.dot-grid::before`)
- Modify: `src/app/page.tsx:21` (uso de la clase `dot-grid`)
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: nada (no usa `cn()`, clases estáticas).
- Produces: `DotGrid` (componente sin props) exportado desde `@/components/atoms/DotGrid`. El
  contenedor padre debe tener `position: relative` (o `className="relative"`) para que el patrón
  de puntos se recorte correctamente.

- [ ] **Step 1: Reescribir el bloque CSS en `src/app/app.css`**

Reemplazar (líneas 61-71):

```css
/* Dot Grid workspace background (DESIGN.md 4.1) */
.dot-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--text-muted) 1px, transparent 1px);
  background-size: 1.5rem 1.5rem;
  opacity: 0.15;
  mask-image: radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%);
  z-index: -1;
}
```

Por:

```css
/* Dot Grid workspace background (DESIGN.md 4.1) — aplicado directo por el componente DotGrid */
.dot-grid {
  background-image: radial-gradient(var(--text-muted) 1px, transparent 1px);
  background-size: 1.5rem 1.5rem;
  opacity: 0.15;
  mask-image: radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%);
}
```

- [ ] **Step 2: Crear `src/components/atoms/DotGrid.tsx`**

```tsx
export function DotGrid() {
  return (
    <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 -z-10" />
  );
}
```

- [ ] **Step 3: Actualizar `src/app/page.tsx` para usar el componente**

En `src/app/page.tsx:21`, cambiar:

```tsx
    <main className="dot-grid relative flex min-h-screen flex-col items-center justify-center gap-16 px-6 py-24">
```

Por:

```tsx
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-16 px-6 py-24">
      <DotGrid />
```

Y añadir el import junto a los demás imports del archivo:

```tsx
import { DotGrid } from "@/components/atoms/DotGrid";
```

- [ ] **Step 4: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 5: Verificación manual visual**

Run: `pnpm dev`, abrir `http://localhost:3000`.
Expected: el patrón de puntos sigue visible detrás del contenido de la landing, idéntico al
comportamiento anterior (sin cambios visuales, solo de implementación).

- [ ] **Step 6: Commit**

```bash
git add src/app/app.css src/app/page.tsx src/components/atoms/DotGrid.tsx
git commit -m "refactor: extract DotGrid atom, replace .dot-grid::before CSS hack"
```

---

### Task 4: Átomo `Button`

**Files:**
- Create: `src/components/atoms/Button.tsx`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: `cn` desde `@/lib/cn` (Task 1).
- Produces: `Button` y `type ButtonProps` exportados desde `@/components/atoms/Button`. Props:
  `variant?: "primary" | "secondary" | "ghost"` (default `"primary"`), `size?: "sm" | "md"`
  (default `"md"`), más todos los atributos nativos de `<button>`.

- [ ] **Step 1: Crear `src/components/atoms/Button.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--bg-brand-cta)] text-[var(--text-brand-cta)]",
  secondary:
    "border-[var(--border-subtle)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
  ghost:
    "border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md border font-medium focus-visible:border-[var(--border-focus)] focus-visible:outline-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Button.tsx
git commit -m "feat: add Button atom (primary/secondary/ghost variants)"
```

---

### Task 5: Átomo `Badge`

**Files:**
- Create: `src/components/atoms/Badge.tsx`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: `cn` desde `@/lib/cn` (Task 1).
- Produces: `Badge` y `type BadgeProps` exportados desde `@/components/atoms/Badge`. Props:
  `variant?: "neutral" | "mauve"` (default `"neutral"`), `mono?: boolean` (default `false`), más
  todos los atributos nativos de `<span>`.

- [ ] **Step 1: Crear `src/components/atoms/Badge.tsx`**

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "mauve";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  mono?: boolean;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-[var(--border-subtle)] text-[var(--text-muted)]",
  mauve: "border-[var(--border-focus)] text-[var(--text-primary)]",
};

export function Badge({
  variant = "neutral",
  mono = false,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs",
        mono && "font-mono",
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Badge.tsx
git commit -m "feat: add Badge atom (neutral/mauve variants, mono option)"
```

---

### Task 6: Átomo `MonospaceLabel`

**Files:**
- Create: `src/components/atoms/MonospaceLabel.tsx`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: `cn` desde `@/lib/cn` (Task 1).
- Produces: `MonospaceLabel` y `type MonospaceLabelProps` exportados desde
  `@/components/atoms/MonospaceLabel`. Sin props propias más allá de los atributos nativos de
  `<span>`. Usado por la Task 10 (`BYOKInput`).

- [ ] **Step 1: Crear `src/components/atoms/MonospaceLabel.tsx`**

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type MonospaceLabelProps = HTMLAttributes<HTMLSpanElement>;

export function MonospaceLabel({ className, ...rest }: MonospaceLabelProps) {
  return (
    <span
      className={cn("font-mono text-xs text-[var(--text-muted)]", className)}
      {...rest}
    />
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/MonospaceLabel.tsx
git commit -m "feat: add MonospaceLabel atom"
```

---

### Task 7: Átomo `DragHandle`

**Files:**
- Create: `src/components/atoms/DragHandle.tsx`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: `cn` desde `@/lib/cn` (Task 1).
- Produces: `DragHandle` y `type DragHandleProps` exportados desde
  `@/components/atoms/DragHandle`. Puramente presentacional: renderiza el glifo `::` visible en
  hover del contenedor padre (el padre debe tener la clase `group` de Tailwind). El cableado real
  de arrastre (listeners de `@dnd-kit`) se añade en Fase 4 y no es parte de esta tarea.

- [ ] **Step 1: Crear `src/components/atoms/DragHandle.tsx`**

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type DragHandleProps = HTMLAttributes<HTMLSpanElement>;

export function DragHandle({ className, ...rest }: DragHandleProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "cursor-grab select-none font-mono text-sm text-[var(--text-muted)] opacity-0 group-hover:opacity-100",
        className,
      )}
      {...rest}
    >
      ::
    </span>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/DragHandle.tsx
git commit -m "feat: add DragHandle atom (presentational only, DnD wiring in phase 4)"
```

---

### Task 8: Hook `useTheme` + tokens `data-theme` + script anti-flash

**Files:**
- Create: `src/hooks/useTheme.ts`
- Modify: `src/app/app.css` (añadir bloques `[data-theme="light"]` / `[data-theme="dark"]`)
- Modify: `src/app/layout.tsx` (script inline pre-hidratación + `suppressHydrationWarning`)
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: nada nuevo (usa `localStorage`, `window.matchMedia`, `document.documentElement`
  directamente).
- Produces: `useTheme(): { theme: "light" | "dark"; toggleTheme: () => void }` exportado desde
  `@/hooks/useTheme`, usado por la Task 9 (`ThemeToggle`). Clave de `localStorage`:
  `"foliox-theme"`, valores `"light" | "dark"`.

- [ ] **Step 1: Crear `src/hooks/useTheme.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "foliox-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
```

- [ ] **Step 2: Añadir bloques `data-theme` en `src/app/app.css`**

Añadir al final del archivo (después del bloque `.dot-grid` modificado en la Task 3):

```css
/* Manual theme override via ThemeToggle (takes precedence over prefers-color-scheme
   because attribute selectors have higher specificity than a bare :root). */
:root[data-theme="dark"] {
  --bg-canvas: var(--color-neutral-900);
  --bg-surface: var(--color-mauve-900);
  --bg-surface-hover: var(--color-mauve-800);
  --border-subtle: var(--color-mauve-800);
  --border-focus: var(--color-mauve-400);
  --text-primary: var(--color-mauve-50);
  --text-muted: var(--color-neutral-400);
  --bg-brand-cta: var(--color-mauve-50);
  --text-brand-cta: var(--color-neutral-900);
}

:root[data-theme="light"] {
  --bg-canvas: var(--color-neutral-50);
  --bg-surface: var(--color-neutral-100);
  --bg-surface-hover: var(--color-mauve-200);
  --border-subtle: var(--color-neutral-300);
  --border-focus: var(--color-mauve-600);
  --text-primary: var(--color-neutral-900);
  --text-muted: var(--color-neutral-600);
  --bg-brand-cta: var(--color-mauve-900);
  --text-brand-cta: var(--color-mauve-50);
}
```

- [ ] **Step 3: Añadir script anti-flash en `src/app/layout.tsx`**

Añadir esta constante arriba del componente `RootLayout` (después de los imports existentes):

```tsx
// Static inline literal — no user input is interpolated, so this is not an XSS vector.
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("foliox-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();`;
```

Y modificar el `return` de `RootLayout` para incluir un `<head>` con el script y
`suppressHydrationWarning` en `<html>` (el atributo `data-theme` lo escribe este script antes de
que React hidrate, así que sin `suppressHydrationWarning` React reportaría un mismatch falso):

```tsx
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--bg-canvas)] font-sans text-[var(--text-primary)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
```

- [ ] **Step 4: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 5: Verificación manual**

Run: `pnpm dev`, abrir `http://localhost:3000`, y en DevTools → Application → Local Storage
ejecutar `localStorage.setItem("foliox-theme", "light")` seguido de recargar la página.
Expected: la página carga directamente en tema claro, sin parpadeo de tema oscuro antes del
cambio (confirma que el script anti-flash corre antes del primer paint).

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useTheme.ts src/app/app.css src/app/layout.tsx
git commit -m "feat: add useTheme hook, data-theme CSS tokens, anti-flash init script"
```

---

### Task 9: Molécula `ThemeToggle`

**Files:**
- Create: `src/components/molecules/ThemeToggle.tsx`
- Modify: `src/app/page.tsx` (montar el toggle para poder verificarlo visualmente)
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: `useTheme` desde `@/hooks/useTheme` (Task 8), `cn` desde `@/lib/cn` (Task 1),
  iconos `Moon`/`Sun` de `lucide-react` (Task 1).
- Produces: `ThemeToggle` exportado desde `@/components/molecules/ThemeToggle`. Props:
  `className?: string`.

- [ ] **Step 1: Crear `src/components/molecules/ThemeToggle.tsx`**

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] focus-visible:border-[var(--border-focus)] focus-visible:outline-none",
        className,
      )}
    >
      <Icon size={16} />
    </button>
  );
}
```

- [ ] **Step 2: Montar el toggle en `src/app/page.tsx` para verificación visual**

En `src/app/page.tsx`, añadir el import:

```tsx
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
```

Y colocar `<ThemeToggle className="absolute right-6 top-6" />` como primer hijo dentro de
`<main>` (junto a `<DotGrid />` de la Task 3).

- [ ] **Step 3: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 4: Verificación manual**

Run: `pnpm dev`, abrir `http://localhost:3000`, hacer click en el botón de tema arriba a la
derecha.
Expected: el ícono alterna entre sol/luna, los colores de fondo/texto de toda la página cambian
instantáneamente entre el set claro y oscuro de `DESIGN.md`, y el valor persiste al recargar.

- [ ] **Step 5: Commit**

```bash
git add src/components/molecules/ThemeToggle.tsx src/app/page.tsx
git commit -m "feat: add ThemeToggle molecule, mount on landing page"
```

---

### Task 10: Molécula `BYOKInput`

**Files:**
- Create: `src/components/molecules/BYOKInput.tsx`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: `MonospaceLabel` desde `@/components/atoms/MonospaceLabel` (Task 6), `cn` desde
  `@/lib/cn` (Task 1).
- Produces: `BYOKInput` y `type BYOKInputProps` exportados desde
  `@/components/molecules/BYOKInput`. Props: `value: string`, `onChange: (value: string) => void`,
  `label?: string` (default `"API Key"`), `className?: string`. Componente controlado — **sin**
  lectura/escritura de `localStorage` (eso es Fase 6, Módulo 4 IA BYOK).

- [ ] **Step 1: Crear `src/components/molecules/BYOKInput.tsx`**

```tsx
"use client";

import type { ChangeEvent } from "react";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";
import { cn } from "@/lib/cn";

export type BYOKInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
};

export function BYOKInput({ value, onChange, label = "API Key", className }: BYOKInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor="byok-api-key" className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <input
        id="byok-api-key"
        type="password"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
      />
      <MonospaceLabel>[LOCAL STORAGE ONLY - ZERO DATA LOGGING]</MonospaceLabel>
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/BYOKInput.tsx
git commit -m "feat: add BYOKInput molecule (controlled, no persistence yet)"
```

---

### Task 11: Verificación final de Fase 1 + Fase 2

**Files:** ninguno (solo verificación, sin cambios de código).

**Interfaces:** N/A.

- [ ] **Step 1: Build completo**

Run: `pnpm build`
Expected: build exitoso sin errores de tipos ni de lint.

- [ ] **Step 2: Repasar checklist de criterios de aceptación del spec**

Contra `docs/superpowers/specs/2026-07-13-foliox-fase1-fase2-design.md`:
- `pnpm build` pasa ✅ (Step 1)
- `src/config/appwrite.ts` existe y `src/lib/appwrite.ts` no (Task 2)
- Los 5 átomos (`DotGrid`, `Button`, `Badge`, `MonospaceLabel`, `DragHandle`) y 2 moléculas
  (`ThemeToggle`, `BYOKInput`) existen, tipados, sin `any`
- El toggle de tema cambia `data-theme`, persiste en `localStorage`, sin parpadeo (Task 8/9)
- Ningún componente usa `bg-gradient-*`, `shadow-xl`, `rounded-xl` o `rounded-full`

Run: `grep -rn "gradient\|shadow-xl\|rounded-xl\|rounded-full" src/components`
Expected: sin resultados.

- [ ] **Step 3: Confirmar working tree limpio**

Run: `git status`
Expected: `nothing to commit, working tree clean` (todos los commits de las Tasks 1-10 ya se
hicieron; si aparece algo pendiente, revisar qué Task lo dejó sin commitear).
