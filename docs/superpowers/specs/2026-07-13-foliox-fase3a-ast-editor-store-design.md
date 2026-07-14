# Foliox — Fase 3a: AST + useEditorStore (Zustand)

**Fecha:** 2026-07-13
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

Fase 1 y Fase 2 (scaffold, tokens, átomos y moléculas base) ya están mergeadas a `main`
(PR #1). La Fase 3 original del roadmap ("Servicios Appwrite & AST State") mezclaba dos
subsistemas independientes: (a) el AST de bloques + el store de Zustand del editor, sin
dependencias externas, y (b) el store de auth + la integración OAuth de GitHub vía Appwrite, que
depende de configuración externa (proveedor GitHub OAuth habilitado en la consola de Appwrite,
GitHub OAuth App con su callback URL, `APPWRITE_API_KEY`) que no se puede verificar desde el
código.

Se decidió dividir la Fase 3 en dos specs. Este documento cubre únicamente **Fase 3a**: el AST y
el store del editor. La Fase 3b (auth store + OAuth) queda para un spec propio, posterior,
cuando se confirme que la configuración externa de Appwrite/GitHub está lista.

## Fuera de alcance

- `useAuthStore`, `services/appwrite.service.ts` (GitHub OAuth, CRUD de borradores en Appwrite
  Database) — Fase 3b, spec separado.
- UI de edición de bloques (`BentoCardBlock`, drag & drop real) — Fase 4.
- Compilador de Markdown que lea el AST — Fase 5.
- Vitest u otro test runner — se sigue difiriendo; la verificación de esta fase usa un
  self-check sin framework (ver sección Verificación).

## Dependencias a instalar

```bash
pnpm add zustand
```

## `src/types/ast.ts`

Unión discriminada por `kind`, con un `content` mínimo por tipo de bloque (los 5 tipos que
menciona `DESIGN.md`/el plan original). Cada bloque tiene `id: string` (generado por quien
construye el bloque, no por el store — ver más abajo) y `kind`.

| Tipo | `content` |
| --- | --- |
| `hero-bio` | `{ name: string; tagline: string; avatarUrl?: string }` |
| `tech-stack` | `{ technologies: string[] }` |
| `github-stats` | `{ username: string; showPrivate: boolean }` |
| `ascii-banner` | `{ text: string; font: string }` |
| `markdown-custom` | `{ markdown: string }` |

`Block` es la unión de los 5. **Decisión de diseño**: el store no genera IDs internamente.
`Omit<Block, "id">` colapsaría la unión discriminada a solo sus campos comunes (limitación
conocida de TypeScript con `Pick`/`Omit` sobre uniones), así que en vez de introducir un helper
de "distributive omit", quien construya un bloque (la UI de Fase 4) le asigna `id` con
`crypto.randomUUID()` antes de pasarlo a `addBlock`.

## `src/store/useEditorStore.ts`

**Estado:**

- `blocks: Block[]`
- `selectedBlockId: string | null`

**Acciones:**

- `addBlock(block: Block): void`
- `removeBlock(id: string): void` — si el bloque removido estaba seleccionado, limpia
  `selectedBlockId`.
- `updateBlock(id: string, updater: (block: Block) => Block): void` — recibe una función en vez
  de un `Partial<content>` para que el llamador narrowee el `kind` con seguridad de tipos en su
  propio call site, sin necesitar genéricos condicionales en el store.
- `reorderBlocks(fromIndex: number, toIndex: number): void` — mueve un bloque de una posición a
  otra (splice), preparando el terreno para el drag & drop de Fase 4.
- `selectBlock(id: string | null): void`

**Persistencia**: middleware `persist` de Zustand, clave `"foliox-editor-draft"` en
`localStorage`. Es una capa de borrador local, independiente y anterior al guardado remoto en
Appwrite Database que llegará en un spec de fase futura — no son mecanismos en conflicto, uno
es caché de trabajo en curso y el otro es guardado explícito del usuario.

## Verificación

Primera vez que el proyecto tiene lógica real no trivial (el splice de `reorderBlocks`, el
filtro de `removeBlock`). En vez de instalar Vitest (o `tsx`, que tampoco está instalado), se
añade `src/store/useEditorStore.selfcheck.ts`: un script que ejercita las 5 acciones con
`assert` de Node y se corre con `node --experimental-strip-types
src/store/useEditorStore.selfcheck.ts` — Node 22 (confirmado en este entorno: v22.20.0) ejecuta
TypeScript "erasable" nativamente con esa flag, sin transpilar y sin dependencias nuevas. El
script usa imports relativos (no el alias `@/*`, que solo resuelve Next.js/tsc vía bundler, no
la resolución de módulos nativa de Node).

`ponytail:` se sigue difiriendo Vitest; este self-check es el "ONE runnable check" que exige la
lógica no trivial, no un reemplazo permanente de una suite de tests real.

## Criterios de aceptación

- [ ] `pnpm build` pasa sin errores de tipos.
- [ ] `src/types/ast.ts` exporta los 5 tipos de bloque + el tipo `Block` union, sin `any`.
- [ ] `src/store/useEditorStore.ts` expone `blocks`, `selectedBlockId` y las 5 acciones
      listadas, tipado sin `any`.
- [ ] El self-check corre y pasa (`pnpm exec tsx src/store/useEditorStore.selfcheck.ts`),
      cubriendo `addBlock`, `removeBlock`, `updateBlock`, `reorderBlocks`, `selectBlock`.
- [ ] `localStorage["foliox-editor-draft"]` se puebla tras añadir un bloque (verificación manual
      en `pnpm dev`).
