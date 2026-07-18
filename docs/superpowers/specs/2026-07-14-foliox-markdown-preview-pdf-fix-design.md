# Foliox — Rendered Markdown Preview + PDF Export Fix

**Fecha:** 2026-07-14
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

Auditoría contra `DESIGN.md` §4.3 encontró dos gaps en `MarkdownPreview.tsx`:

1. El panel derecho solo muestra Markdown crudo en un `<pre>` — el spec pide poder alternar
   entre "Markdown bruto **o** previsualización de GitHub renderizada". No existe ninguna
   dependencia de renderizado de Markdown en el proyecto.
2. "Export as PDF" (`handlePrint`) llama `window.print()` sobre ese mismo `<pre>` crudo — imprime
   el texto fuente con `#`/`**` literal, no "la vista de portafolio/CV limpia" que pide el spec.

`src/lib/markdownSerializer.ts` ya emite HTML crudo embebido (`<div align="center"><img .../></div>`)
para los bloques `hero-bio` y `github-stats` — igual que cualquier README real de GitHub. El
bloque `markdown-custom` es texto libre del usuario. El CSS de impresión ya existente en
`app.css` (`@media print`, target `#foliox-print-target`) funciona correctamente — el problema es
únicamente qué contenido apunta a ese id.

## Decisiones de arquitectura

- **`react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-sanitize` + `github-markdown-css`.**
  `react-markdown` renderiza a elementos React reales (no `dangerouslySetInnerHTML`).
  `rehype-raw` es necesario porque el serializer ya emite HTML crudo real (no es over-engineering
  — así se ve un README de GitHub real). `rehype-sanitize` con un schema propio (allowlist —
  regla de seguridad del proyecto: "allowlisting tags, not denylisting") permite exactamente lo
  que el serializer genera (`div[align]`, `img[width,height,style,src,alt]`) y bloquea todo lo
  demás (`<script>`, atributos `on*`, URLs `javascript:`) — protege contra que el bloque libre
  `markdown-custom` sea un vector de auto-XSS.
- **Un componente nuevo, no tocar `markdownSerializer.ts`.** El serializer ya es correcto y
  probado (self-check existente) — el renderer es una capa de presentación separada que consume
  su output.
- **El mismo elemento renderizado sirve para preview en pantalla y para impresión.** No se
  duplica lógica: `id="foliox-print-target"` se mueve del `<pre>` crudo a la vista renderizada,
  que queda siempre montada en el DOM (oculta con una clase si el tab activo es "Raw"). El CSS de
  impresión existente ya fuerza `display: block` sobre ese id sin importar el estado de UI en
  pantalla, así que el PDF exportado siempre es la vista renderizada, sin importar qué tab tenía
  abierto el usuario al hacer click en "Export as PDF".
- **Sin dark mode en el preview renderizado ni en la impresión.** Se usa el CSS claro de
  `github-markdown-css` siempre — un CV impreso no debe depender del tema activo de la app
  (mismo criterio ya aplicado a la impresión). Se marca como simplificación deliberada, no como
  bug: agregar paridad de tema oscuro es trabajo aparte si se pide después.

## Fuera de alcance

- Cambios a `markdownSerializer.ts` — su output ya es correcto, solo se renderiza distinto.
- Dark mode en la vista "Preview" o en el PDF.
- Plantillas de impresión alternativas — una sola vista limpia derivada del Markdown renderizado.

## `src/components/editor/MarkdownRenderedView.tsx`

Componente puro. Props: `{ markdown: string; id?: string; className?: string }`.

- `<div id={id} className={cn("markdown-body", className)}>` envolviendo
  `<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}>{markdown}</ReactMarkdown>`.
- `schema`: `defaultSchema` de `hast-util-sanitize` (re-exportado por `rehype-sanitize`), extendido
  vía spread para agregar a `attributes`: `div: [...(defaultSchema.attributes?.div ?? []), "align"]`,
  `img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "style"]`.
- Importa `"github-markdown-css/github-markdown-light.css"` una sola vez, a nivel de módulo (no
  recargar por render).
- Si `markdown` está vacío, no se usa este componente — el caller (`MarkdownPreview.tsx`) ya
  maneja ese caso con su mensaje de estado vacío existente.

## `src/components/editor/MarkdownPreview.tsx` (modificación)

- Nuevo estado local `viewMode: "raw" | "preview"` (default `"preview"`).
- Dos botones pequeños tipo tab en el header, junto a `[MARKDOWN OUTPUT]`: "Raw" / "Preview" —
  mismo estilo visual que los botones de acción existentes pero con estado activo resaltado
  (`border-focus` cuando `viewMode` coincide).
- Cuerpo del panel:
  - Si `!markdown`: mensaje de estado vacío existente, sin cambios.
  - Si `markdown` y `viewMode === "raw"`: el `<pre>` existente, **sin** `id="foliox-print-target"`
    (se lo saca).
  - Siempre que `markdown` exista (independiente del `viewMode` visible): se monta
    `<MarkdownRenderedView markdown={markdown} id="foliox-print-target" className={viewMode === "preview" ? "" : "hidden"} />`
    — así el target de impresión existe siempre en el DOM, visible en pantalla solo si el tab
    activo es "Preview", pero disponible para `window.print()` sin importar cuál tab esté activo.
- `handlePrint` no cambia (`window.print()`) — el CSS de impresión decide qué se muestra.

## `src/app/app.css` (modificación del bloque `@media print` existente)

- Se quita `font-family: ui-monospace, "Geist Mono", monospace !important;` y
  `white-space: pre-wrap !important;` del selector `#foliox-print-target` — el contenido ya no es
  texto crudo, es HTML renderizado con su propia tipografía (la de `github-markdown-css`).
- Se mantiene `background: white !important; color: black !important;`, `position: fixed`,
  `inset: 0`, el padding y las reglas de `@page` tal como están.
- Se agrega `#foliox-print-target img { max-width: 100% !important; }` para que las imágenes
  embebidas (avatar, badges de stats) no se corten en el ancho de página impresa.

## Verificación

- `pnpm exec tsc --noEmit` en cada paso.
- `pnpm build` al final.
- Sin self-check con `node --experimental-strip-types` — el componente es JSX puro dependiente de
  DOM/React (renderizado de Markdown a elementos), no hay lógica de transformación de datos
  aislable sin un DOM real.
- Verificación manual (a cargo del usuario): abrir `/editor` con bloques que incluyan `hero-bio`
  (para probar el `<img>` embebido) y `markdown-custom` con algo como `<script>alert(1)</script>`
  pegado a propósito, confirmar que el tab "Preview" renderiza avatar/imágenes correctamente y que
  el script NO se ejecuta (sanitizado). Confirmar que "Export as PDF" produce un PDF con el
  contenido renderizado (no texto crudo con `#`/`**`).

## Criterios de aceptación

- [ ] `pnpm build` pasa sin errores de tipos.
- [ ] Toggle Raw/Preview funcional, default en "Preview".
- [ ] El preview renderizado muestra imágenes embebidas (HTML crudo del serializer) correctamente.
- [ ] Un `<script>` pegado en el bloque `markdown-custom` no se ejecuta en el preview renderizado.
- [ ] "Export as PDF" imprime el contenido renderizado, no el Markdown crudo, sin importar qué
      tab (Raw/Preview) estaba activo en pantalla.
- [ ] Ningún uso de `dangerouslySetInnerHTML` en el nuevo componente.
