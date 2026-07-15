# Foliox — Fase 6a: IA BYOK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persistir provider + API key del usuario en `localStorage` (`useApiKey`) y exponer
`POST /api/ai/generate` que usa esa key (BYOK, nunca en el servidor) para mejorar una bio vía
Vercel AI SDK (OpenAI o Anthropic).

**Architecture:** Hook simple sin Zustand (mismo patrón que `useTheme`) para el estado de
provider/key. Route Handler de Next.js sin capa adicional — valida el body, resuelve el modelo
por provider, llama `generateText`, y nunca reenvía el mensaje crudo del provider ni la key.
Validación y selección de modelo se exponen como funciones puras separadas del handler `POST`
para que el self-check las ejercite sin mockear el SDK ni llamar a una API real.

**Tech Stack:** Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic` — nuevas dependencias).

## Global Constraints

- Gestor de paquetes: **pnpm** exclusivamente.
- TypeScript estricto: cero `any`.
- La `apiKey` del usuario **nunca** se persiste ni se loguea en el servidor — viaja del cliente
  al Route Handler en cada request y se descarta tras usarse.
- Sin verificación end-to-end contra una API key real (fuera de alcance del spec, ver
  `docs/superpowers/specs/2026-07-13-foliox-fase6a-ai-byok-design.md`).

---

### Task 1: `src/hooks/useApiKey.ts`

**Files:**
- Create: `src/hooks/useApiKey.ts`

**Interfaces:**
- Produces: `useApiKey()` → `{ provider: AiProvider; apiKey: string; setProvider: (p: AiProvider) => void; setApiKey: (k: string) => void }`.
  Exporta también el tipo `AiProvider = "openai" | "anthropic"` (reutilizado por la route).

- [ ] **Step 1: Crear `src/hooks/useApiKey.ts`**

Mismo patrón que `src/hooks/useTheme.ts`: `useState` con inicializador lazy que lee
`localStorage`, más un `setX` que escribe a `localStorage` de inmediato y actualiza el estado.
Claves: `"foliox-ai-provider"` (default `"anthropic"`), `"foliox-ai-key"` (default `""`).

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useApiKey.ts
git commit -m "feat: add useApiKey hook (provider + key persisted in localStorage)"
```

---

### Task 2: `POST /api/ai/generate`

**Files:**
- Create: `src/app/api/ai/generate/route.ts`
- Modify: `package.json` (agrega `ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`)

**Interfaces:**
- Consumes: `AiProvider` desde `@/hooks/useApiKey`.
- Produces: `POST` (Next.js Route Handler), más dos funciones puras exportadas para el
  self-check: `resolveModelId(provider: AiProvider): string` y
  `validateGenerateRequest(body: unknown): { provider: AiProvider; apiKey: string; bio: string } | { error: string }`.

- [ ] **Step 1: Instalar dependencias**

Run: `pnpm add ai @ai-sdk/openai @ai-sdk/anthropic`

- [ ] **Step 2: Crear `src/app/api/ai/generate/route.ts`**

- `validateGenerateRequest`: valida `apiKey` (no vacío), `bio` (no vacío), `provider` (∈
  `"openai" | "anthropic"`) — devuelve `{ error }` en el primer caso que falle, en ese orden.
- `resolveModelId`: `"openai"` → `"gpt-4o-mini"`, `"anthropic"` → `"claude-sonnet-5"`.
- `POST`: parsea el JSON del `Request`, llama `validateGenerateRequest`; si hay `error`, responde
  400 `{ error }`. Si no, arma el provider (`createOpenAI`/`createAnthropic` con la `apiKey` del
  request), llama `generateText` con el modelo de `resolveModelId` y un system prompt de
  copywriting anti-slop para mejorar bios. En éxito responde 200 `{ improvedBio: text }`. En
  catch, responde 502 `{ error: "AI provider request failed" }` — el error crudo del provider
  solo se pasa a `console.error` sin la `apiKey` ni el mensaje del provider (usar
  `error instanceof Error ? error.constructor.name : "unknown"` si se loguea algo).

- [ ] **Step 3: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/app/api/ai/generate/route.ts
git commit -m "feat: add POST /api/ai/generate (BYOK, OpenAI + Anthropic via Vercel AI SDK)"
```

---

### Task 3: Self-check + verificación final

**Files:**
- Create: `src/app/api/ai/generate/route.selfcheck.ts`

**Interfaces:** N/A — script standalone, no se importa desde la app.

- [ ] **Step 1: Crear el self-check**

Mismo patrón que `src/store/useEditorStore.selfcheck.ts` (`node --experimental-strip-types`,
`node:assert/strict`, sin framework). Importa `resolveModelId` y `validateGenerateRequest` desde
`./route.ts` y afirma:
- `validateGenerateRequest` con `apiKey` faltante/vacío → `{ error: "apiKey is required" }`.
- `validateGenerateRequest` con `bio` faltante/vacío (y `apiKey` presente) → `{ error: "bio is required" }`.
- `validateGenerateRequest` con `provider` inválido (y `apiKey`/`bio` presentes) → `{ error: "invalid provider" }`.
- `validateGenerateRequest` con los 3 campos válidos → devuelve el objeto sin `error`.
- `resolveModelId("openai")` → `"gpt-4o-mini"`; `resolveModelId("anthropic")` → `"claude-sonnet-5"`.

- [ ] **Step 2: Correr el self-check**

Run: `node --experimental-strip-types src/app/api/ai/generate/route.selfcheck.ts`
Expected: imprime confirmación, exit code 0.

- [ ] **Step 3: Build completo**

Run: `pnpm build`
Expected: build exitoso sin errores de tipos.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai/generate/route.selfcheck.ts
git commit -m "test: add self-check for /api/ai/generate validation and model selection"
```
