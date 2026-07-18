# Foliox — Rediseño Landing Page (Retro CRT/ASCII)

**Fecha:** 2026-07-18
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

La landing actual (`LandingTemplate.tsx` + `organisms/landing/*`) usa una estética "flat-swiss"
(negro/mauve neutro, Geist Mono/Sans) que el usuario considera genérica/de plantilla. El contenido
en sí (Hero con demo standard/minimal, TechTicker, 4 Bento Features, About/manifiesto con explorador
de archivos, Open Source, Pricing de 2 planes, Footer, Command Palette Cmd+K) está bien pensado y se
mantiene — el pedido es de identidad visual + una fusión estructural puntual, no una reescritura de
producto.

Elegido por el usuario tras comparar mockups: dirección **Retro CRT/ASCII** (opción "C" sobre 4
alternativas — Terminal Noir, Swiss Dev Editorial, Retro CRT/ASCII, Neo-brutalista), con variante
clara **"papel térmico/dot-matrix"** (opción "E" sobre 2 alternativas de modo claro).

Foliox es un editor de perfiles/README de GitHub (bloques: hero bio, tech stack, ASCII banner,
GitHub stats, markdown), con export a PDF y commit directo a GitHub vía OAuth — el motivo ASCII/CRT
conecta directo con una feature real del producto (`AsciiBannerForm`/`AsciiBannerBlockView`,
y la card "ASCII Art Engine" en `BentoFeatures`), no es decoración arbitraria.

## Decisiones de arquitectura

- **El tema retro se scopea solo a la landing, no es un cambio global de tokens.** Los tokens
  semánticos actuales (`--bg-canvas`, `--bg-surface`, `--border-subtle`, `--border-focus`,
  `--text-primary`, `--text-muted`, `--bg-brand-cta`, `--text-brand-cta`, definidos en `app.css`)
  los consume también el editor, login, profile, settings. Redefinir esos valores en `:root`
  cambiaría toda la app, y el pedido es solo la landing. Se agrega un bloque CSS scopeado bajo una
  clase wrapper (`.landing-retro`) que sobreescribe esas mismas variables solo dentro de ese
  subárbol del DOM — todos los componentes de landing ya las consumen vía `var(--token)`, así que
  no hace falta tocar su JSX/lógica, solo envolver `LandingTemplate` con la clase.
- **Mismo mecanismo de dark/light ya existente.** El toggle manual (`data-theme="dark|light"` desde
  `ThemeToggle`) y el fallback `prefers-color-scheme` siguen funcionando igual — dentro de
  `.landing-retro` se definen las mismas 4 combinaciones (root/dark/light impl. actuales) pero con
  los valores CRT verde-fósforo (oscuro) / papel térmico (claro) en vez de mauve/neutral.
- **Reutilizar el motor ASCII existente, no crear uno nuevo.** `BentoFeatures.tsx` ya genera arte
  ASCII simple (`getAsciiArt()` con densidad low/mid/high). Ese mismo patrón (strings ASCII
  estáticos, sin librería) se reutiliza como motivo decorativo en Navbar/Hero/Footer — nada de
  paquetes nuevos (`figlet`, etc.) para esto.
- **Scanlines vía CSS puro, extendiendo `DotGrid.tsx` existente (no un componente nuevo).**
  `repeating-linear-gradient` agregado al mismo atom — sin canvas, sin WebGL, sin dependencia
  nueva. Debe respetar `prefers-reduced-motion` si se anima cualquier parpadeo (cursor, glow
  pulsante).
- **Glow limitado a headlines/acentos, nunca a texto de párrafo largo.** Restricción de
  accesibilidad: `text-shadow` con glow reduce legibilidad en bloques largos (manifiesto, About).
  Se aplica solo a `h1`/`h2` y a badges/labels cortos.
- **Fusión de About + Open Source en una sola sección "Philosophy".** Hoy son dos secciones
  (`AboutSection.tsx` con explorador de archivos `manifesto.md`/`architecture.json`/`security.txt`,
  y `OpenSourceSection.tsx` con stats de repo + licencia MIT en 2 `FlatBentoCard`) que repiten el
  mismo tema (transparencia/filosofía del proyecto). Se fusionan reutilizando el patrón de
  explorador de archivos ya existente en `AboutSection`: se agrega una pestaña más
  (`community.md`) cuyo contenido es el resumen de stars/forks/PRs + condiciones de licencia MIT
  que hoy vive en `OpenSourceSection`. `OpenSourceSection.tsx` se elimina, `Navbar` pierde el link
  `#open-source` (queda `Features | Philosophy | Pricing`), y el ancla `#philosophy` cubre todo.
- **Copy sin cambios de tono.** Confirmado por el usuario: la estética cambia, el texto se
  mantiene profesional/claro tal como está en `translations.ts`. Solo se agregan las claves de
  texto necesarias para el contenido fusionado de `community.md` (hoy hardcodeado bilingüe dentro
  de `OpenSourceSection.tsx` en vez de vivir en `translations.ts` como el resto de secciones — se
  aprovecha la fusión para moverlo a `translations.ts` y mantener consistencia con el patrón del
  resto del archivo).

## Fuera de alcance

- Cualquier cambio a los tokens/tema del editor, login, profile o settings — siguen con el tema
  mauve/neutral actual sin modificar.
- Cambios de tono/voz en el copy (se mantiene profesional, no "hacker voice").
- Agregar secciones nuevas (testimonios, showcase de perfiles reales) — no fue pedido.
- Simplificar/recortar las 4 Bento Features — se mantienen las 4 tal cual, solo re-temáticas.
- Cualquier librería nueva de ASCII art, shaders CRT, o efectos WebGL.

## Paleta y tokens (dentro de `.landing-retro`)

Dark (default):

- `--bg-canvas`: `#0a0b0d` (casi negro)
- `--bg-surface`: `#101317`
- `--bg-surface-hover`: `#171b20`
- `--border-subtle`: `#1c1f24`
- `--border-focus`: `#2a2e35` con acento `--accent-phosphor` en hover/focus real
- `--text-primary`: `#f2f0ea`
- `--text-muted`: `#8b9089`
- `--accent-phosphor` (nuevo token): `#6ee7a7`
- `--bg-brand-cta`: `--accent-phosphor`, `--text-brand-cta`: `#061109`
- `--glow-color` (nuevo token): `rgba(110,231,167,0.35)`

Light ("papel térmico"):

- `--bg-canvas`: `#f2ede1`
- `--bg-surface`: `#ece5d5`
- `--bg-surface-hover`: `#e3dbc7`
- `--border-subtle`: `#c9c0aa` (líneas discontinuas donde aplique, no todos los bordes)
- `--border-focus`: `#1f3a24`
- `--text-primary`: `#1f3a24`
- `--text-muted`: `#5a6b57`
- `--accent-phosphor`: `#1f3a24` (mismo rol, tono tinta oscura en vez de verde neón)
- `--bg-brand-cta`: `#1f3a24`, `--text-brand-cta`: `#f2ede1`
- `--glow-color`: `transparent` (sin glow en modo claro — no aplica al concepto "papel")

Ambos modos reutilizan `--font-sans`/`--font-mono` (Geist) ya definidos — sin cambio tipográfico.

## Archivos afectados

- **`src/app/app.css`** — nuevo bloque `.landing-retro` (+ sus variantes `[data-theme="dark|light"]`
  anidadas y `@media (prefers-color-scheme: light)`) con los tokens de arriba; utilidad
  `.crt-scanlines` (repeating-linear-gradient) y `.crt-glow` (text-shadow condicionado, respeta
  `prefers-reduced-motion` para cualquier parpadeo).
- **`src/components/templates/LandingTemplate.tsx`** — agrega `className="landing-retro"` al root
  div; sin cambios de lógica/estado.
- **`src/components/atoms/DotGrid.tsx`** — extiende el patrón actual para incluir scanlines
  horizontales sutiles además del dot-grid, controlado por los nuevos tokens.
- **`src/components/organisms/landing/Navbar.tsx`** — reskin; quita el link/ancla `#open-source`.
- **`src/components/organisms/landing/HeroSection.tsx`** — reskin; agrega un pequeño motivo ASCII
  junto al badge/tag existente. Sin cambios a la demo standard/minimal.
- **`src/components/organisms/landing/TechTicker.tsx`** — reskin del marquee, misma lista/lógica.
- **`src/components/organisms/landing/BentoFeatures.tsx`** — reskin de las 4 cards existentes
  (AST Compiler, BYOK Privacy, Deploy Pipeline, ASCII Engine); sin cambios de estado/lógica.
- **`src/components/organisms/landing/AboutSection.tsx`** — se renombra conceptualmente a la
  sección "Philosophy" fusionada: agrega pestaña `community.md` (stats GitHub + licencia MIT,
  contenido movido desde `OpenSourceSection`), reskin del explorador de archivos existente.
- **`src/components/organisms/landing/OpenSourceSection.tsx`** — eliminado (contenido absorbido por
  `AboutSection.tsx`).
- **`src/components/organisms/landing/PricingSection.tsx`** — reskin, mismos 2 planes/lógica de
  toggle mensual/lifetime.
- **`src/components/organisms/landing/Footer.tsx`** — reskin.
- **`src/components/molecules/CommandPalette.tsx`** — reskin, misma funcionalidad Ctrl/Cmd+K.
- **`src/components/atoms/FlatBentoCard.tsx`, `SectionHeader.tsx`, `Button.tsx`** — solo si
  hardcodean colores fuera de los tokens semánticos (a verificar en implementación); si ya
  consumen `var(--token)`, no requieren cambios.
- **`src/lib/translations.ts`** — agrega claves `about.community*` (título, stats, licencia) en
  `en`/`es` con el contenido hoy hardcodeado en `OpenSourceSection.tsx`; quita el uso del ancla
  `openSource` del navbar si ya no aplica.

## Verificación

Cambio puramente visual + una fusión de contenido estático (sin lógica de negocio nueva). Se
verifica:

- `pnpm build` / `tsc --noEmit` sin errores tras el reskin.
- Recorrido manual en navegador de la landing en ambos temas (dark/light, vía `ThemeToggle` y vía
  `prefers-color-scheme`) y ambos idiomas (`es`/`en`).
- Interacciones existentes siguen funcionando: toggle standard/minimal del Hero, botón "Compile"
  del AST simulator, key input + estado BYOK, simulación de deploy, selector de densidad ASCII,
  las 4 pestañas del explorador de archivos (incluida la nueva `community.md`), toggle mensual/
  lifetime de Pricing, Command Palette (Ctrl/Cmd+K), menú móvil del Navbar.
- Confirmar visualmente que `/editor`, `/login`, `/profile`, `/settings` **no** cambiaron de tema
  (el scope de `.landing-retro` no debe filtrarse fuera de la landing).
