# DESIGN.md — Foliox Brand & UI/UX Architecture System

> **Document Version:** 1.0.0
> **Core Philosophy:** "Notion meets Canva for Developers" — Flat Swiss Design, Zero Gradients, High Precision Engineering.

---

## 1. Brand Identity & Design Principles

**Foliox** es un entorno de trabajo visual modular enfocado en la construcción de marca para desarrolladores (GitHub READMEs, portafolios web, currículums técnicos y biografías profesionales). La interfaz debe sentirse como un IDE de nueva generación: rápida, accesible y sin distracciones visuales.

### Tres Pilares Visuales

1. **Zero Gradients (Flat Purezo):** Prohibido el uso de degradados de color, sombras difuminadas pesadas (`box-shadow` complejos), luces neón artificiales o efectos 3D. La jerarquía se construye exclusivamente mediante contraste tipográfico, bordes sólidos exactos (`1px`) y bloques de color planos.
2. **Geometría Modular (Swiss & Bauhaus):** Todo elemento en la interfaz es un bloque rectangular con proporciones estrictas y espaciado matemático. El lienzo de trabajo refleja la naturaleza *Drag & Drop* del producto.
3. **Alto Contraste Funcional (OKLCH Native):** Uso nativo del espacio de color OKLCH en Tailwind CSS para garantizar accesibilidad WCAG AAA en modos claro y oscuro, asegurando que el contenido del usuario (código, arte ASCII, insignias SVG) sea el centro de atención.

---

## 2. Color System & Theme Tokens (OKLCH)

El sistema cromático se articula en torno a dos escalas principales: **Neutral** (estructura y legibilidad) y **Mauve** (identidad, contenedores e interacción).

### 2.1 Escalas Cromáticas Completas (Tailwind CSS v4 / Variables CSS)

```css
@theme {
  /* --- NEUTRAL SCALE (Pure Structural Grayscale) --- */
  --color-neutral-50:  oklch(98.5% 0 0);
  --color-neutral-100: oklch(96.0% 0 0);
  --color-neutral-200: oklch(90.0% 0 0);
  --color-neutral-300: oklch(80.0% 0 0);
  --color-neutral-400: oklch(65.0% 0 0);
  --color-neutral-500: oklch(50.0% 0 0);
  --color-neutral-600: oklch(38.0% 0 0);
  --color-neutral-700: oklch(30.0% 0 0);
  --color-neutral-800: oklch(24.0% 0 0);
  --color-neutral-900: oklch(20.5% 0 0); /* Core Dark Neutral Base */
  --color-neutral-950: oklch(15.0% 0 0);

  /* --- MAUVE SCALE (Brand Accent & Sophisticated Surfaces) --- */
  --color-mauve-50:  oklch(98.5% 0.005 322.12); /* Core Light Accent / Text */
  --color-mauve-100: oklch(95.0% 0.010 322.12);
  --color-mauve-200: oklch(90.0% 0.015 322.12);
  --color-mauve-300: oklch(82.0% 0.020 322.12);
  --color-mauve-400: oklch(70.0% 0.025 322.12);
  --color-mauve-500: oklch(55.0% 0.035 322.12);
  --color-mauve-600: oklch(45.0% 0.030 322.12);
  --color-mauve-700: oklch(35.0% 0.025 322.12);
  --color-mauve-800: oklch(27.0% 0.022 322.12);
  --color-mauve-900: oklch(21.2% 0.019 322.12); /* Core Dark Mauve Base */
  --color-mauve-950: oklch(16.0% 0.015 322.12);
}
```

### 2.2 Tokens Semánticos por Tema (Dark Mode vs. Light Mode)

| Token UI | Dark Mode (Default) | Light Mode | Aplicación en Componentes |
| --- | --- | --- | --- |
| `bg-canvas` | `neutral-900` | `neutral-50` | Fondo principal de toda la aplicación y zona de trabajo. |
| `bg-surface` | `mauve-900` | `neutral-100` | Tarjetas del editor (Bento Grid), barra de herramientas lateral. |
| `bg-surface-hover` | `mauve-800` | `mauve-200` | Estado hover y drag-active en bloques modulares. |
| `border-subtle` | `mauve-800` | `neutral-300` | Bordes divisorios de los bloques (`border border-subtle`). |
| `border-focus` | `mauve-400` | `mauve-600` | Anillo de selección al hacer clic en un bloque del editor. |
| `text-primary` | `mauve-50` | `neutral-900` | Títulos principales, logotipos e iconos de alta prioridad. |
| `text-muted` | `neutral-400` | `neutral-600` | Descripciones, placeholders y metadatos secundarios. |
| `bg-brand-cta` | `mauve-50` | `mauve-900` | Botones de acción principales (Ej: "Deploy to GitHub"). |
| `text-brand-cta` | `neutral-900` | `mauve-50` | Texto dentro del botón principal de acción. |

---

## 3. Typography System & Spacing

### 3.1 Dúo Tipográfico Estricto

- **UI & Reading (San-Serif):** Geist Sans o Inter. Utilizada para la barra de navegación, menús de configuración del LLM, modales y textos descriptivos en la UI.
  - Pesos permitidos: Regular (400), Medium (500), Semibold (600).
- **Code, AST & Badges (Monospace):** Geist Mono o JetBrains Mono. Uso estricto para previsualizaciones de Markdown, código embebido, contadores de métricas de GitHub, etiquetas de tecnologías y el generador de arte ASCII.

### 3.2 Tokens de Geometría y Bordes

Manteniendo la estética flat de bloques de código:

**Border Radius:**

- `rounded-none`: Para tablas interiores y divisores de terminal.
- `rounded-sm` (2px): Para insignias (badges), botones pequeños e inputs.
- `rounded-md` (4px a 6px): Para los contenedores del Bento Grid y modales principales. Prohibido el uso de bordes redondos excesivos (`rounded-xl` o `rounded-full` en contenedores de diseño).

**Borders & Outlines:**

- Todos los contenedores interactivos llevan un borde sólido de 1px sin sombra. Al hacer focus o drag, el borde cambia de color instantáneamente sin transiciones difusas.

---

## 4. UI/UX Component Specifications

### 4.1 El Lienzo Visual (Drag & Drop Workspace)

- **Grid de Fondo:** El área del editor debe mostrar un patrón de puntos sutiles (Dot Grid) en `text-muted` con opacidad del 15%, simulando una mesa de dibujo de arquitectura o un software CAD.
- **Bloques Modulares (Bento Cards):** Cada sección del README (Header, Tech Stack, GitHub Stats, ASCII Logo) se renderiza dentro de un contenedor con `bg-surface border border-subtle rounded-md p-4`.
- **Interacción de Arrastre (Pragmatic DnD / dnd-kit):**
  - **Drag Handle:** Un icono de seis puntos (`::`) en tipografía monospace, ubicado en la esquina superior izquierda de cada bloque, visible solo en hover.
  - **Ghost State:** Al arrastrar, el bloque original reduce su opacidad al 30%, y el bloque flotante proyecta un borde sólido `border-focus` sin sombra de elevación 3D.

### 4.2 Panel Lateral (Toolbar & AI BYOK Config)

- **Estructura:** Barra lateral fija a la derecha de `w-80`, dividida en tres pestañas claras: **Bloques** (catálogo para añadir al lienzo), **Estilo** (ajustes visuales y conversión ASCII) e **IA / BYOK**.
- **Configuración BYOK (Bring Your Own Key):**
  - Un input simple de tipo password para insertar la API Key (OpenAI, Gemini, Anthropic, DeepSeek).
  - Un selector de tono de redacción con opciones planas: "Technical & Concise", "Executive LinkedIn Bio", "Aggressive Developer Branding".
  - **Seguridad UI:** Un badge en Geist Mono que indique: `[LOCAL STORAGE ONLY - ZERO DATA LOGGING]`.

### 4.3 Previsualización en Tiempo Real & Exporter

- El usuario puede alternar la vista dividida (Split View): Editor Visual a la izquierda (60% del ancho) y salida nativa en Markdown bruto o previsualización de GitHub renderizada a la derecha (40%).
- **Botones de Exportación (Footer Flotante Plano):**
  - `[Copy Markdown]` — Copia el AST parseado al portapapeles.
  - `[Download .md]` — Descarga el archivo físicamente.
  - `[Commit to GitHub]` — Conecta por Octokit API y hace push al repositorio especial `username/username`.
  - `[Export CV as PDF]` — Imprime la vista de portafolio/CV limpia sin elementos de UI.

---

## 5. Accessibility & Performance Guidelines

- **Contraste Dinámico:** Ningún texto interactivo puede tener un ratio de contraste menor a 7:1 (WCAG AAA) contra su fondo en modo claro u oscuro. Los grises medios (`neutral-500`) están prohibidos para textos explicativos largos.
- **Navegación por Teclado:** Todo bloque del editor drag-and-drop debe poder reordenarse utilizando atajos de teclado (`Alt + Flecha Arriba/Abajo`), con un indicador de foco visual sólido y claro (`outline-2 outline-mauve-500`).
- **Optimización Gráfica:** Los generadores de infografías locales y arte ASCII deben procesarse mediante Web Workers o en un `<canvas>` fuera del hilo principal (Offscreen Canvas) para mantener los 60 FPS en la interfaz mientras se arrastran los bloques.
