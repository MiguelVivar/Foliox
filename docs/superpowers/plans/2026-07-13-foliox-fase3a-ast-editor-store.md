# Foliox — Fase 3a: AST + useEditorStore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modelar el AST de bloques de Foliox y construir el store de Zustand (`useEditorStore`)
que lo gestiona, persistido en `localStorage`, sin tocar todavía UI de edición ni Appwrite.

**Architecture:** `src/types/ast.ts` define una unión discriminada por `kind` (sin lógica).
`src/store/useEditorStore.ts` es el único punto de mutación del array de bloques — estado +
acciones + middleware `persist` de Zustand. Sin test runner: la lógica se verifica con un
self-check ejecutado vía la ejecución nativa de TypeScript de Node 22
(`--experimental-strip-types`), y el build de Next.js confirma que los tipos y el bundle son
correctos.

**Tech Stack:** TypeScript 5 (strict), Zustand 5 (`create` + `persist` middleware), Node 22
(`--experimental-strip-types` para el self-check, sin `tsx` ni Vitest).

## Global Constraints

- Gestor de paquetes: **pnpm** exclusivamente.
- TypeScript estricto: cero `any`.
- Alias de imports `@/*` → `./src/*` funciona en Next.js/tsc, **no** en la ejecución nativa de
  Node — el self-check usa imports relativos con extensión `.ts` explícita (Node ESM lo exige).
- Sin test runner nuevo esta fase (decisión del spec
  `docs/superpowers/specs/2026-07-13-foliox-fase3a-ast-editor-store-design.md`): verificación vía
  self-check con `assert` de Node, no Vitest/Jest.
- El store no genera `id` de bloques — quien construye un `Block` le asigna
  `crypto.randomUUID()` antes de llamar a `addBlock`. Ningún helper de "distributive omit".
- Validar límites en `reorderBlocks`: los índices vienen de interacción externa (drag & drop en
  Fase 4), así que se tratan como no confiables.
- **Verificado durante la escritura de este plan** (no asumido): `node -e "console.log(typeof
  localStorage)"` imprime `undefined` en Node v22.20.0 — el self-check debe stubear
  `localStorage` antes de importar el store. También verificado: `tsc --noEmit` rechaza imports
  con extensión `.ts` explícita salvo que `allowImportingTsExtensions` esté habilitado en
  `tsconfig.json` (compatible con el `noEmit: true` ya existente) — Task 4 lo agrega.

---

### Task 1: Instalar `zustand`

**Files:**
- Modify: `package.json` (vía `pnpm add`)
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: nada.
- Produces: paquete `zustand` disponible para las Tasks 3-4 (`import { create } from "zustand"`,
  `import { persist } from "zustand/middleware"`).

- [ ] **Step 1: Instalar la dependencia**

Run: `pnpm add zustand`
Expected: `package.json` gana `zustand` en `dependencies`, `pnpm-lock.yaml` se actualiza sin
errores.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add zustand"
```

---

### Task 2: Tipos del AST (`src/types/ast.ts`)

**Files:**
- Create: `src/types/ast.ts`
- Test: N/A — verificación manual (ver Global Constraints)

**Interfaces:**
- Consumes: nada.
- Produces: `Block` (unión de `HeroBioBlock | TechStackBlock | GithubStatsBlock |
  AsciiBannerBlock | MarkdownCustomBlock`) exportado desde `@/types/ast`, usado por la Task 3
  (`useEditorStore`) y la Task 4 (self-check).

- [ ] **Step 1: Crear `src/types/ast.ts`**

```ts
export type BlockKind =
  | "hero-bio"
  | "tech-stack"
  | "github-stats"
  | "ascii-banner"
  | "markdown-custom";

export type HeroBioBlock = {
  id: string;
  kind: "hero-bio";
  content: {
    name: string;
    tagline: string;
    avatarUrl?: string;
  };
};

export type TechStackBlock = {
  id: string;
  kind: "tech-stack";
  content: {
    technologies: string[];
  };
};

export type GithubStatsBlock = {
  id: string;
  kind: "github-stats";
  content: {
    username: string;
    showPrivate: boolean;
  };
};

export type AsciiBannerBlock = {
  id: string;
  kind: "ascii-banner";
  content: {
    text: string;
    font: string;
  };
};

export type MarkdownCustomBlock = {
  id: string;
  kind: "markdown-custom";
  content: {
    markdown: string;
  };
};

export type Block =
  | HeroBioBlock
  | TechStackBlock
  | GithubStatsBlock
  | AsciiBannerBlock
  | MarkdownCustomBlock;
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/types/ast.ts
git commit -m "feat: add AST block types (hero-bio, tech-stack, github-stats, ascii-banner, markdown-custom)"
```

---

### Task 3: `useEditorStore` (Zustand + persist)

**Files:**
- Create: `src/store/useEditorStore.ts`
- Test: N/A esta task — cubierto por la Task 4 (self-check)

**Interfaces:**
- Consumes: `Block` desde `@/types/ast` (Task 2).
- Produces: `useEditorStore` exportado desde `@/store/useEditorStore`. Estado: `blocks: Block[]`,
  `selectedBlockId: string | null`. Acciones: `addBlock(block: Block): void`,
  `removeBlock(id: string): void`, `updateBlock(id: string, updater: (block: Block) => Block):
  void`, `reorderBlocks(fromIndex: number, toIndex: number): void`,
  `selectBlock(id: string | null): void`. Persistido en `localStorage` bajo la clave
  `"foliox-editor-draft"`.

- [ ] **Step 1: Crear `src/store/useEditorStore.ts`**

```ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block } from "@/types/ast";

type EditorState = {
  blocks: Block[];
  selectedBlockId: string | null;
};

type EditorActions = {
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updater: (block: Block) => Block) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  selectBlock: (id: string | null) => void;
};

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set) => ({
      blocks: [],
      selectedBlockId: null,
      addBlock: (block) =>
        set((state) => ({ blocks: [...state.blocks, block] })),
      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
          selectedBlockId:
            state.selectedBlockId === id ? null : state.selectedBlockId,
        })),
      updateBlock: (id, updater) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? updater(block) : block,
          ),
        })),
      reorderBlocks: (fromIndex, toIndex) =>
        set((state) => {
          const isValidRange =
            fromIndex >= 0 &&
            fromIndex < state.blocks.length &&
            toIndex >= 0 &&
            toIndex < state.blocks.length;
          if (!isValidRange) return state;

          const next = [...state.blocks];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { blocks: next };
        }),
      selectBlock: (id) => set({ selectedBlockId: id }),
    }),
    { name: "foliox-editor-draft" },
  ),
);
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/store/useEditorStore.ts
git commit -m "feat: add useEditorStore (Zustand, persisted to localStorage)"
```

---

### Task 4: Self-check de `useEditorStore`

**Files:**
- Modify: `tsconfig.json` (añadir `allowImportingTsExtensions`)
- Create: `src/store/useEditorStore.selfcheck.ts`
- Test: este archivo ES la verificación (ver Global Constraints — sin Vitest esta fase)

**Interfaces:**
- Consumes: `useEditorStore` desde `../store/useEditorStore.ts` (import relativo con extensión
  explícita, Task 3), `MarkdownCustomBlock` desde `../types/ast.ts` (Task 2).
- Produces: nada consumido por otras tasks — es un script ejecutable standalone.

**Nota:** `localStorage` no existe como global en Node (verificado: `node -e "console.log(typeof
localStorage)"` imprime `undefined` en Node v22.20.0). El middleware `persist` de Zustand lo
necesita al crear el store, así que el self-check stubea un `localStorage` en memoria ANTES de
importar el store — usando `import()` dinámico (no un `import` estático, que se hoistea y
correría antes del stub). El stub es local a este script, no toca el código de producción.

**Nota 2:** ejecutar el self-check con Node requiere extensión `.ts` explícita en los imports
relativos (resolución de módulos de Node, no de bundler). Por defecto `tsc` rechaza esa sintaxis
(`error TS5097`) salvo que `allowImportingTsExtensions` esté habilitado — verificado con una
prueba aislada durante la escritura de este plan. Es compatible con el `noEmit: true` que el
proyecto ya tiene.

- [ ] **Step 1: Habilitar `allowImportingTsExtensions` en `tsconfig.json`**

En `tsconfig.json`, dentro de `compilerOptions`, después de `"paths"`:

```json
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    "allowImportingTsExtensions": true
```

- [ ] **Step 2: Crear `src/store/useEditorStore.selfcheck.ts`**

```ts
import assert from "node:assert/strict";

// Minimal in-memory stub so zustand's persist middleware has a localStorage
// to call outside a browser. Scoped to this script only — dynamic import()
// below defers loading the store until after this stub is installed (a
// static top-level import would be hoisted and run before this line).
const memoryStorage = new Map<string, string>();
(globalThis as { localStorage?: Storage }).localStorage = {
  getItem: (key: string) => memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memoryStorage.set(key, value);
  },
  removeItem: (key: string) => {
    memoryStorage.delete(key);
  },
  clear: () => {
    memoryStorage.clear();
  },
  key: () => null,
  length: 0,
} as Storage;

const { useEditorStore } = await import("../store/useEditorStore.ts");

function makeBlock(id: string): import("../types/ast.ts").MarkdownCustomBlock {
  return { id, kind: "markdown-custom", content: { markdown: `block ${id}` } };
}

// addBlock
useEditorStore.getState().addBlock(makeBlock("a"));
useEditorStore.getState().addBlock(makeBlock("b"));
useEditorStore.getState().addBlock(makeBlock("c"));
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  ["a", "b", "c"],
  "addBlock should append blocks in order",
);

// selectBlock
useEditorStore.getState().selectBlock("b");
assert.equal(
  useEditorStore.getState().selectedBlockId,
  "b",
  "selectBlock should set selectedBlockId",
);

// updateBlock
useEditorStore.getState().updateBlock("b", (block) => ({
  ...block,
  content: { ...block.content, markdown: "updated" } as typeof block.content,
}));
const updated = useEditorStore.getState().blocks.find((block) => block.id === "b");
assert.equal(
  (updated as import("../types/ast.ts").MarkdownCustomBlock).content.markdown,
  "updated",
  "updateBlock should apply the updater to the matching block",
);

// reorderBlocks: move "a" (index 0) to index 2 -> expect b, c, a
useEditorStore.getState().reorderBlocks(0, 2);
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  ["b", "c", "a"],
  "reorderBlocks should move the block to the target index",
);

// reorderBlocks with out-of-range index is a no-op
const beforeInvalidReorder = useEditorStore.getState().blocks.map((block) => block.id);
useEditorStore.getState().reorderBlocks(0, 99);
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  beforeInvalidReorder,
  "reorderBlocks should ignore out-of-range indices",
);

// removeBlock clears selectedBlockId when the selected block is removed
useEditorStore.getState().removeBlock("b");
assert.deepEqual(
  useEditorStore.getState().blocks.map((block) => block.id),
  ["c", "a"],
  "removeBlock should remove the matching block",
);
assert.equal(
  useEditorStore.getState().selectedBlockId,
  null,
  "removeBlock should clear selectedBlockId when the removed block was selected",
);

console.log("useEditorStore selfcheck: all assertions passed");
```

- [ ] **Step 3: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0). Si aparece `error TS5097`, confirmar que el Step 1 se aplicó
y que no hay un `.tsbuildinfo` obsoleto (`rm -f tsconfig.tsbuildinfo` y reintentar).

- [ ] **Step 4: Ejecutar el self-check**

Run: `node --experimental-strip-types src/store/useEditorStore.selfcheck.ts`
Expected: imprime `useEditorStore selfcheck: all assertions passed` y termina con exit code 0.
Si cualquier `assert` falla, el proceso termina con un `AssertionError` describiendo qué
comparación falló — no continuar al Step 5 hasta que pase limpio.

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json src/store/useEditorStore.selfcheck.ts
git commit -m "test: add useEditorStore selfcheck (no framework, Node native TS)"
```

---

### Task 5: Verificación final de Fase 3a

**Files:** ninguno (solo verificación, sin cambios de código permanentes).

**Interfaces:** N/A.

**Nota:** el spec original pedía confirmar `localStorage["foliox-editor-draft"]` en `pnpm dev`,
pero ningún componente monta `useEditorStore` todavía (la UI del editor es Fase 4), así que no
hay forma de disparar `addBlock` desde el navegador sin importar el store en algún lado. Este
task monta el store temporalmente en `src/app/page.tsx`, verifica `localStorage` en el navegador,
y revierte el cambio — Fase 4 hará el montaje real y permanente.

- [ ] **Step 1: Build completo**

Run: `pnpm build`
Expected: build exitoso sin errores de tipos.

- [ ] **Step 2: Montar el store temporalmente para verificar la persistencia en el navegador**

En `src/app/page.tsx`, añadir temporalmente (no se commitea) `"use client";` como primera línea
del archivo, el import:

```tsx
import { useEditorStore } from "@/store/useEditorStore";
```

junto a los demás imports, y dentro del componente `Home`, antes del `return`:

```tsx
  useEditorStore.getState().addBlock({
    id: crypto.randomUUID(),
    kind: "markdown-custom",
    content: { markdown: "manual verification block" },
  });
```

- [ ] **Step 3: Verificar en el navegador**

Run: `pnpm dev`, abrir `http://localhost:3000`, abrir DevTools → Application → Local Storage, y
ejecutar en la consola: `localStorage.getItem("foliox-editor-draft")`.
Expected: devuelve un JSON con `state.blocks` conteniendo el bloque `"manual verification
block"`.

- [ ] **Step 4: Revertir el montaje temporal**

Run: `git checkout -- src/app/page.tsx`
Expected: `src/app/page.tsx` vuelve a su estado commiteado (sin la importación ni la llamada de
prueba).

- [ ] **Step 5: Confirmar working tree limpio**

Run: `git status --short`
Expected: sin salida (todos los commits de las Tasks 1-4 ya se hicieron, y el Step 4 revirtió el
montaje temporal).
