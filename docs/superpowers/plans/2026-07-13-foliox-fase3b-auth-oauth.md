# Foliox — Fase 3b: useAuthStore + GitHub OAuth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `useAuthStore` (Zustand) que envuelve el `account` de Appwrite ya existente
para login/logout/restauración de sesión vía GitHub OAuth, sin persistirlo en `localStorage`.

**Architecture:** Un único store sin middleware `persist` — Appwrite ya gestiona la sesión con su
propia cookie. `login()` es una llamada síncrona que redirige el navegador a GitHub;
`checkSession()` restaura el usuario desde la cookie de sesión existente al montar la app.

**Tech Stack:** Zustand 5 (`create`, sin `persist`), Appwrite SDK 18 (`account.createOAuth2Session`,
`account.deleteSession`, `account.get`), `OAuthProvider` y `Models` re-exportados desde el
paquete `appwrite`.

## Global Constraints

- Gestor de paquetes: **pnpm** exclusivamente.
- TypeScript estricto: cero `any`.
- **Nunca** persistir la sesión en `localStorage` (regla de seguridad del proyecto) — este store
  no usa el middleware `persist`.
- **Verificado contra `node_modules/appwrite/types/services/account.d.ts`** antes de escribir
  este plan:
  - `createOAuth2Session(provider: OAuthProvider, success?: string, failure?: string, scopes?:
    string[]): void | string` — **síncrono**, hace `window.location.href = url` internamente.
    No lleva `await`.
  - `deleteSession(sessionId: string): Promise<{}>` — asíncrono.
  - `get<Preferences extends Models.Preferences = Models.DefaultPreferences>(): Promise<Models.User<Preferences>>`
    — asíncrono, lanza (401) cuando no hay sesión activa.
  - `Models` (type-only) y `OAuthProvider` (valor/enum) se importan ambos desde el paquete
    `"appwrite"` (confirmado en `node_modules/appwrite/types/index.d.ts`).
- El flujo real de OAuth (consentimiento de GitHub) no se puede automatizar esta sesión — la
  verificación final requiere que el usuario complete el login manualmente en su navegador.

---

### Task 1: `useAuthStore`

**Files:**
- Create: `src/store/useAuthStore.ts`
- Test: N/A esta task — cubierto por la Task 2 (verificación manual, ver Global Constraints)

**Interfaces:**
- Consumes: `account` desde `@/config/appwrite` (ya existente).
- Produces: `useAuthStore` exportado desde `@/store/useAuthStore`. Estado: `user:
  Models.User<Models.Preferences> | null` (inicial `null`), `isLoading: boolean` (inicial
  `true`, hasta que algo llame a `checkSession()`). Acciones: `login(): void`, `logout(): Promise<void>`,
  `checkSession(): Promise<void>`.

- [ ] **Step 1: Crear `src/store/useAuthStore.ts`**

```ts
"use client";

import { create } from "zustand";
import { OAuthProvider, type Models } from "appwrite";
import { account } from "@/config/appwrite";

type AuthState = {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
};

type AuthActions = {
  login: () => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isLoading: true,
  login: () => {
    account.createOAuth2Session(
      OAuthProvider.Github,
      window.location.origin,
      window.location.origin,
      ["repo"],
    );
  },
  logout: async () => {
    await account.deleteSession("current");
    set({ user: null });
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const user = await account.get();
      set({ user, isLoading: false });
    } catch {
      // account.get() throws (401) when there is no active session — this is the
      // expected state for a visitor who hasn't logged in yet, not an error to report.
      set({ user: null, isLoading: false });
    }
  },
}));
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/store/useAuthStore.ts
git commit -m "feat: add useAuthStore (GitHub OAuth via Appwrite, no localStorage persistence)"
```

---

### Task 2: Verificación final de Fase 3b

**Files:** ninguno permanente (montaje temporal en `src/app/page.tsx`, revertido al final).

**Interfaces:** N/A.

**Nota:** requiere que el usuario complete el login real con su cuenta de GitHub — no se puede
automatizar sin herramienta de navegador esta sesión.

- [ ] **Step 1: Build completo**

Run: `pnpm build`
Expected: build exitoso sin errores de tipos.

- [ ] **Step 2: Montar un botón de login temporalmente**

En `src/app/page.tsx`, añadir temporalmente (no se commitea) `"use client";` como primera línea
(si no está ya — la Fase 3a la dejó sin ella tras revertir), el import:

```tsx
import { useAuthStore } from "@/store/useAuthStore";
```

y, dentro del componente `Home`, un botón junto al CTA existente de "Deploy to GitHub":

```tsx
<button type="button" onClick={() => useAuthStore.getState().login()}>
  Login with GitHub (temp)
</button>
```

- [ ] **Step 3: Login real y confirmación del usuario**

Run: `pnpm dev`, abrir `http://localhost:3000`, click en "Login with GitHub (temp)", completar
el consentimiento de GitHub. Tras volver a `http://localhost:3000`, abrir la consola del
navegador y ejecutar:

```js
await useAuthStore.getState().checkSession();
useAuthStore.getState().user;
```

Expected: el usuario reporta que `user` queda poblado con un objeto que incluye su email/nombre
de GitHub (vía Appwrite). Si `login()` falla antes de llegar a GitHub, la causa más probable es
que el proveedor OAuth de GitHub no esté realmente habilitado en la consola de Appwrite pese a
la confirmación previa — en ese caso, detener y depurar la configuración de Appwrite antes de
continuar (fuera de este plan).

- [ ] **Step 4: Revertir el montaje temporal**

Run: `git checkout -- src/app/page.tsx`
Expected: `src/app/page.tsx` vuelve a su estado commiteado.

- [ ] **Step 5: Confirmar working tree limpio**

Run: `git status --short`
Expected: sin salida.
