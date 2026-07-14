# Foliox — Fase 3b: useAuthStore + GitHub OAuth (Appwrite)

**Fecha:** 2026-07-13
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

Fase 3a (AST + `useEditorStore`) ya está mergeada a `main` (PR #2). La Fase 3 original se dividió
en dos porque esta mitad depende de configuración externa que no vive en el repo: el proveedor
GitHub OAuth habilitado en la consola de Appwrite, la GitHub OAuth App con su callback URL, y
(potencialmente) `APPWRITE_API_KEY`. El usuario confirmó que esa configuración externa ya está
lista antes de aprobar este spec.

**Nota de riesgo aceptada:** no puedo verificar esa configuración externa desde el código ni
reproducir el flujo de consentimiento de GitHub en un navegador (sin herramienta de navegador
disponible esta sesión). Si la configuración de Appwrite/GitHub resulta estar incompleta, el
`login()` fallará en tiempo de ejecución y se necesitará depurar la consola de Appwrite
directamente, fuera de este spec.

## Fuera de alcance

- Ruta de callback dedicada (`/auth/callback`) — se usa `"/"` como `successUrl`/`failureUrl`.
- Persistencia del usuario en `localStorage` — prohibido por las reglas de seguridad del
  proyecto (sesiones nunca en `localStorage`); Appwrite ya gestiona la sesión vía su propia
  cookie.
- CRUD de borradores en Appwrite Database (Módulo 2 completo) — spec futuro.
- Integración con Octokit — Fase 6. Este spec solo pide el scope `repo` por adelantado para
  evitar una segunda pantalla de consentimiento más adelante.
- UI de login/logout permanente — se verifica con un montaje temporal + reversión, igual que
  Fase 3a.

## `src/store/useAuthStore.ts`

**Estado:**

- `user: Models.User<Models.Preferences> | null`
- `isLoading: boolean`

**Acciones:**

- `login(): void` — llama
  `account.createOAuth2Session(OAuthProvider.Github, window.location.origin,
  window.location.origin, ["repo"])`. **Verificado en
  `node_modules/appwrite/types/services/account.d.ts`**: este método de la SDK es síncrono
  (`void | string`) — hace `window.location.href = url` internamente y navega fuera de la app de
  inmediato, no retorna una Promise. Usa el mismo origin como `successUrl` y `failureUrl` (sin
  ruta de callback dedicada). El scope `"repo"` se pide desde ahora para que Octokit (Fase 6)
  pueda hacer push sin re-autenticar al usuario.
- `logout(): Promise<void>` — llama `account.deleteSession("current")` y limpia `user` a `null`.
- `checkSession(): Promise<void>` — llama `account.get()`. Si Appwrite responde con una sesión
  válida, puebla `user`. Si responde 401 (caso normal de visitante no autenticado, no un error
  real), deja `user: null` sin loggearlo como error — es el flujo esperado en cada carga de la
  app antes de que alguien inicie sesión.

**Sin `persist`**: a diferencia de `useEditorStore`, este store NO usa el middleware `persist` de
Zustand. Appwrite ya mantiene la sesión mediante su propia cookie; duplicarla en `localStorage`
violaría la regla de seguridad del proyecto (`react/security.md`: "Never store sessions in
localStorage") y podría desincronizarse del estado real de la sesión en el servidor.

## Verificación

- `pnpm exec tsc --noEmit` en cada paso, como en fases anteriores.
- `pnpm build` al final.
- El flujo de OAuth real (clickear a través del consentimiento de GitHub) no se puede automatizar
  esta sesión. La verificación final monta temporalmente un botón "Login with GitHub" en
  `page.tsx` (llamando a `useAuthStore.getState().login()`), y le pide al usuario que:
  1. Haga click y complete el login con su cuenta de GitHub.
  2. Confirme (por ejemplo abriendo la consola del navegador y llamando
     `useAuthStore.getState().checkSession()` seguido de leer `useAuthStore.getState().user`)
     que el usuario quedó poblado.
  Después se revierte el montaje temporal, igual que en Fase 3a.

## Criterios de aceptación

- [ ] `pnpm build` pasa sin errores de tipos.
- [ ] `src/store/useAuthStore.ts` expone `user`, `isLoading`, `login`, `logout`, `checkSession`,
      tipado sin `any`, sin middleware `persist`.
- [ ] `checkSession()` no lanza ni loggea como error el caso de "sin sesión" (401).
- [ ] El usuario confirma manualmente que, tras completar el login real con GitHub,
      `useAuthStore.getState().user` queda poblado.
