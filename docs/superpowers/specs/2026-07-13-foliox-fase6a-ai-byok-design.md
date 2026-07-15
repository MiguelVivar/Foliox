# Foliox — Fase 6a: IA BYOK (persistencia de key + /api/ai/generate)

**Fecha:** 2026-07-13
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

Fases 1-5 ya están mergeadas a `main` (parte de ellas construidas en paralelo en otra sesión:
Fase 4 lienzo Drag & Drop, Fase 5 compilador Markdown + panel lateral). `BYOKInput` (átomo/
molécula de Fase 2) existe pero sin persistencia real — quedó explícitamente diferido a esta
fase. La Fase 6 original ("IA BYOK & Octokit Integration") junta dos subsistemas independientes;
se divide en 6a (IA BYOK, este spec) y 6b (Octokit, spec futuro).

## Fuera de alcance

- Integración con Octokit / commit a GitHub — Fase 6b, spec separado.
- UI del panel de IA completo (tabs, botones "mejorar bio"/"optimizar CV"/"generar titular") —
  solo se construye la tarea "mejorar bio"; las otras 2 tareas del spec original reusan el mismo
  endpoint con otro prompt, se agregan después.
- Providers Gemini y DeepSeek — solo OpenAI + Anthropic en este spec (decidido: agregar los
  otros 2 es de bajo costo incremental una vez existe el patrón).
- Verificación end-to-end contra una API key real de OpenAI/Anthropic — requiere una key real
  cuyo costo paga el usuario final de Foliox, no esta sesión. Se verifica con mocks.

## `src/hooks/useApiKey.ts`

Mismo patrón que `useTheme.ts` (hook simple, no Zustand — un solo consumidor esperado).

- Estado: `provider: "openai" | "anthropic"` (default `"anthropic"`), `apiKey: string` (default
  `""`).
- Persistido en `localStorage`: claves `"foliox-ai-provider"` y `"foliox-ai-key"`.
- Acciones: `setProvider(provider)`, `setApiKey(key)` — ambas escriben a `localStorage` de
  inmediato.

## `src/app/api/ai/generate/route.ts`

Next.js Route Handler, método `POST`.

**Request body:** `{ provider: "openai" | "anthropic"; apiKey: string; bio: string }`.

**Validación:**
- `apiKey` ausente o vacío → 400, `{ error: "apiKey is required" }`.
- `bio` ausente o vacío → 400, `{ error: "bio is required" }`.
- `provider` fuera de `"openai" | "anthropic"` → 400, `{ error: "invalid provider" }`.

**Generación:** Vercel AI SDK (`generateText` de `ai`, `createOpenAI` de `@ai-sdk/openai`,
`createAnthropic` de `@ai-sdk/anthropic`). Modelo por provider:
- `openai` → `gpt-4o-mini`
- `anthropic` → `claude-sonnet-5`

System prompt: instrucciones de copywriting anti-slop para mejorar una bio profesional (directo,
sin relleno, sin jerga de marketing genérica).

**Respuesta:** `200 { improvedBio: string }` en éxito. En error del provider (key inválida, rate
limit, etc.) → `502 { error: "AI provider request failed" }` — **nunca** se incluye el mensaje
crudo del provider ni la `apiKey` en la respuesta ni en logs del servidor.

## Verificación

- `pnpm exec tsc --noEmit` en cada paso.
- `pnpm build` al final.
- Self-check sin framework (mismo patrón que Fase 3a,
  `node --experimental-strip-types`) que mockea `generateText` para probar: la validación de
  `apiKey`/`bio`/`provider` (los 3 casos 400), y que la selección de modelo por `provider` es
  correcta — sin llamar a ninguna API real.
- Verificación end-to-end con una key real es **opcional y a cargo del usuario** — no bloquea el
  cierre de esta fase.

## Criterios de aceptación

- [ ] `pnpm build` pasa sin errores de tipos.
- [ ] `src/hooks/useApiKey.ts` expone `provider`, `apiKey`, `setProvider`, `setApiKey`, tipado
      sin `any`, persistido en `localStorage`.
- [ ] `src/app/api/ai/generate/route.ts` valida `apiKey`/`bio`/`provider` y devuelve 400 en cada
      caso faltante/ inválido.
- [ ] El self-check corre y pasa, cubriendo los 3 casos de validación 400 y la selección de
      modelo por provider, sin llamar a una API real.
- [ ] Ningún log ni respuesta de error incluye la `apiKey` cruda.
