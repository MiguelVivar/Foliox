# Foliox — Fase 1 (Scaffold & Design Tokens) + Fase 2 (Átomos y Moléculas Base)

**Fecha:** 2026-07-13
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

El repositorio ya trae de una sesión previa: Next.js 16 (App Router) + Tailwind v4 con los tokens
OKLCH de `DESIGN.md` cableados en `src/app/app.css`, fuentes Geist Sans/Mono, un cliente Appwrite
básico en `src/lib/appwrite.ts` y una landing page de ejemplo. No existe todavía el árbol de
carpetas de Diseño Atómico ni ningún átomo/molécula real.

Este spec cubre exclusivamente **Fase 1** (dependencias + estructura de carpetas que faltan) y
**Fase 2** (los átomos y moléculas que el propio plan del usuario listó como entregable de esa
fase: Button, Badge, MonospaceLabel, DragHandle, DotGrid, BYOKInput, ThemeToggle). Todo lo demás
(Zustand store, Appwrite Auth/DB, AST, DnD, IA BYOK real, Octokit) queda fuera de alcance y se
aborda en fases posteriores con su propio spec.

## Fuera de alcance (explícitamente diferido)

- `zustand`, `octokit`/`@octokit/rest`, `@dnd-kit/*` — no se instalan todavía porque no tienen
  ningún consumidor hasta Fase 3/4/6 respectivamente.
- `store/`, `services/`, `types/` — no se crean carpetas vacías; se crean en la fase que
  efectivamente añada archivos ahí.
- Persistencia real de la API key en `localStorage` (Módulo 4 IA BYOK) — `BYOKInput` en esta fase
  es un componente controlado (`value`/`onChange`), sin lógica de persistencia.
- shadcn/ui CLI — decidido explícitamente que NO se usa; los átomos se construyen a mano contra
  los tokens de `DESIGN.md`.

## Dependencias a instalar (pnpm)

```
pnpm add clsx tailwind-merge lucide-react
```

## Cambios estructurales

- Mover `src/lib/appwrite.ts` → `src/config/appwrite.ts` (coincide con la arquitectura definida:
  `config/` aloja la configuración del SDK de Appwrite). Sin riesgo: ningún archivo lo importa
  todavía.
- Nuevo `src/lib/cn.ts`: utilidad `cn()` con `clsx` + `tailwind-merge`.
- Nuevo `src/hooks/useTheme.ts`.
- Nuevas carpetas `src/components/atoms/` y `src/components/molecules/`.

## Átomos (`src/components/atoms/`)

| Componente | Notas |
| --- | --- |
| `Button.tsx` | Variantes `primary` / `secondary` / `ghost`, tamaños `sm` / `md`. `rounded-md`, borde 1px, sin sombra. |
| `Badge.tsx` | `rounded-sm`, variante mono opcional, variantes `neutral` / `mauve`. |
| `MonospaceLabel.tsx` | Wrapper que fuerza `font-mono text-[var(--text-muted)]`. Usado para metadatos y el badge `[LOCAL STORAGE ONLY]`. |
| `DragHandle.tsx` | Glifo `::` en monospace, `opacity-0 group-hover:opacity-100`, `cursor-grab`. Puramente presentacional — el cableado real de DnD llega en Fase 4. |
| `DotGrid.tsx` | Reemplaza el hack CSS `.dot-grid::before` por un componente real `absolute inset-0` que se compone sin que el padre tenga que recordar una clase mágica. |

## Moléculas (`src/components/molecules/`)

| Componente | Notas |
| --- | --- |
| `ThemeToggle.tsx` + `useTheme.ts` | Toggle manual, persiste en `localStorage`, setea `data-theme` en `<html>`, cae a preferencia de sistema si no hay valor guardado. `app.css` gana selectores `[data-theme="dark"]` / `[data-theme="light"]` junto al bloque `prefers-color-scheme` existente. Script inline en `layout.tsx` que aplica `data-theme` antes de la hidratación para evitar parpadeo de tema incorrecto. |
| `BYOKInput.tsx` | Label + input `type="password"` + badge `MonospaceLabel` con el texto `[LOCAL STORAGE ONLY - ZERO DATA LOGGING]`. Componente controlado, sin persistencia todavía. |

## Verificación

No hay test runner instalado y todo el código de esta fase es presentacional salvo `useTheme`
(lógica simple: leer/escribir `localStorage`, aplicar atributo). En vez de instalar Vitest para un
solo hook, se verifica manualmente: `pnpm dev`, comprobar que el toggle cambia el tema y persiste
tras recargar, y que los átomos se ven según `DESIGN.md` (bordes 1px, sin gradientes, radios ≤6px).

`ponytail:` se difiere la instalación de un test runner hasta que Fase 3+ traiga lógica real
(compilador AST, store) que lo justifique.

## Criterios de aceptación

- [ ] `pnpm build` pasa sin errores de tipos.
- [ ] `src/config/appwrite.ts` existe y `src/lib/appwrite.ts` ya no.
- [ ] Los 5 átomos y 2 moléculas listados existen, tipados, sin `any`.
- [ ] El toggle de tema cambia `data-theme` en `<html>`, persiste en `localStorage` y no hay
      parpadeo visible al recargar.
- [ ] Ningún componente usa `bg-gradient-*`, `shadow-xl` ni `rounded-xl`/`rounded-full` (salvo
      avatares, que no aplican en esta fase).
