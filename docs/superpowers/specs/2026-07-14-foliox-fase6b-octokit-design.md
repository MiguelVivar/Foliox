# Foliox — Fase 6b: Integración Octokit (Commit to GitHub)

**Fecha:** 2026-07-14
**Estado:** Aprobado por el usuario, pendiente de implementación

## Contexto

La Fase 6 original ("IA BYOK & Octokit Integration") se dividió en 6a (IA BYOK, mergeada en PR
#6) y 6b (este spec). `useAuthStore` (Fase 3b) ya autentica con GitHub vía Appwrite OAuth
pidiendo el scope `repo`, pero hoy solo expone `user` — no expone ningún token. Appwrite guarda
el token de acceso del proveedor (`providerAccessToken`) en la sesión, accesible desde el
cliente vía `account.getSession("current")`. `serializeBlocks` (Fase 5,
`src/lib/markdownSerializer.ts`) ya produce el Markdown a commitear. `MarkdownPreview.tsx`
(Fase 5) ya tiene un footer con botones "Copy Markdown" y "Download .md" — este spec agrega un
tercer botón "Commit to GitHub" ahí mismo, según `DESIGN.md` sección 4.3.

**Objetivo:** un botón que serializa el lienzo actual a Markdown y lo pushea como `README.md` al
repositorio especial de perfil `{login}/{login}` en GitHub, creando el repo si no existe.

## Decisiones de arquitectura

- **Octokit corre en el cliente, no en el servidor.** El `providerAccessToken` ya es visible en
  el navegador porque Appwrite se lo entrega ahí por diseño — a diferencia de las API keys de
  IA en la Fase 6a (secretos de terceros que el usuario nunca quiere que toquen el servidor de
  Foliox), acá no hay ganancia de seguridad en proxyear a través de un Route Handler, solo
  latencia extra. Se descartó ese approach.
- **El username de GitHub se obtiene de Octokit (`users.getAuthenticated().login`), no de
  Appwrite.** No se asume que el `Models.User` de Appwrite tenga el login de GitHub guardado.
- **Si `{login}/{login}` no existe, se crea automáticamente** (público, vía
  `repos.createForAuthenticatedUser`) — flujo de un solo clic sin pedirle al usuario que cree el
  repo a mano primero.
- **Si el repo ya tiene un `README.md`, se sobrescribe directo** (sin diff/confirmación
  intermedia) — el historial de commits de GitHub ya sirve de respaldo/deshacer.
- **Si no hay sesión de GitHub activa, el click dispara el login OAuth** (`useAuthStore.getState().login()`)
  en vez de deshabilitar el botón — un solo flujo, el usuario reintenta el commit al volver.

## Fuera de alcance

- Selector de rama — siempre pushea a la rama por defecto del repo.
- Editar el mensaje de commit desde la UI — mensaje fijo `"Update README via Foliox"`.
- Refresh automático de un `providerAccessToken` expirado (`account.updateSession`) — si el
  token expiró, Octokit devuelve 401, se muestra el error, y el usuario debe volver a loguearse.
- `[Export CV as PDF]` — otro botón del mismo footer en `DESIGN.md`, fase separada.
- Verificación end-to-end contra una cuenta de GitHub real — opcional y a cargo del usuario, se
  verifica con un cliente Octokit fake (self-check).

## `src/lib/githubCommit.ts`

Lógica pura, sin React. Recibe un cliente Octokit ya construido (inyección de dependencia) para
que el self-check pueda pasar un fake sin mockear módulos ni llamar a la API real — mismo patrón
que `validateGenerateRequest`/`resolveModelId` de la Fase 6a.

- `encodeUtf8Base64(text: string): string` — helper local (sin librería nueva) para codificar el
  Markdown en base64 de forma segura para UTF-8 antes de mandarlo al Contents API de GitHub.
- `commitReadmeToProfile(octokit: Octokit, markdown: string): Promise<{ repoUrl: string }>`:
  1. `octokit.rest.users.getAuthenticated()` → `login`.
  2. `octokit.rest.repos.get({ owner: login, repo: login })`. Si 404 →
     `octokit.rest.repos.createForAuthenticatedUser({ name: login, private: false })`.
  3. `octokit.rest.repos.getContent({ owner: login, repo: login, path: "README.md" })` para
     capturar el `sha` actual. Si 404, no hay `sha` (creación nueva del archivo, no es un error).
  4. `octokit.rest.repos.createOrUpdateFileContents({ owner: login, repo: login, path:
     "README.md", message: "Update README via Foliox", content: encodeUtf8Base64(markdown), sha
     })` (`sha` omitido si el archivo no existía).
  5. Devuelve `{ repoUrl: "https://github.com/{login}/{login}" }`.
  - Cualquier error de Octokit (401 token expirado/inválido, 403 scope insuficiente, etc.) se
    deja propagar sin capturar — lo captura el hook (`useGithubCommit`), no esta función.

## `src/hooks/useGithubCommit.ts`

Mismo patrón que `useApiKey`/`useAuthStore` (hook simple, sin Zustand — un solo consumidor
esperado).

- Estado: `status: "idle" | "committing" | "success" | "error"` (inicial `"idle"`),
  `errorMessage: string | null`, `repoUrl: string | null`.
- Acción: `commit(markdown: string): Promise<void>`:
  1. `set({ status: "committing" })`.
  2. `account.getSession("current")` → `providerAccessToken`. Si falla (sin sesión activa), la
     UI ya evita llamar a `commit` en ese caso (ver sección de UI) — no se duplica esa validación
     acá.
  3. Construye `new Octokit({ auth: providerAccessToken })`.
  4. Llama `commitReadmeToProfile(octokit, markdown)`.
  5. Éxito → `set({ status: "success", repoUrl })`. Error → `set({ status: "error", errorMessage:
     error instanceof Error ? error.message : "Commit failed" })`.
  - Los mensajes de error de Octokit no contienen el token — son seguros de mostrar al usuario
    (a diferencia del error crudo de un proveedor de IA en la Fase 6a, que sí se ocultaba).

## `src/components/editor/MarkdownPreview.tsx` (modificación)

Se agrega un tercer botón junto a "Copy Markdown" / "Download .md", mismo estilo (`iconBtn`),
ícono `Github` de `lucide-react`. Usa `useAuthStore` (sesión) y `useGithubCommit` (commit).

- **Sin sesión** (`useAuthStore().user === null`): click → `useAuthStore.getState().login()`.
- **Con sesión, `status === "idle"`**: texto "Commit to GitHub".
- **`status === "committing"`**: botón `disabled`, texto "Committing...".
- **`status === "success"`**: texto transitorio "Committed!" con check verde (2s, igual que
  "Copied!"), más un link a `repoUrl` (abre en nueva pestaña) visible durante esos 2s. Vuelve a
  `"idle"` después.
- **`status === "error"`**: texto transitorio "Failed" en rojo, `title` con `errorMessage` (3s),
  luego vuelve a `"idle"`.
- Botón `disabled` si `blocks.length === 0` (nada que commitear).

## Verificación

- `pnpm exec tsc --noEmit` en cada paso.
- `pnpm build` al final.
- Self-check sin framework (`node --experimental-strip-types`, mismo patrón que
  `useEditorStore.selfcheck.ts` y `route.selfcheck.ts` de la Fase 6a) para
  `src/lib/githubCommit.ts`: un Octokit fake (objeto plano con `rest.users.getAuthenticated`,
  `rest.repos.get`, `rest.repos.createForAuthenticatedUser`, `rest.repos.getContent`,
  `rest.repos.createOrUpdateFileContents` stubeados) cubre:
  - Repo existe + README existe → no llama a `createForAuthenticatedUser`, llama a
    `createOrUpdateFileContents` con el `sha` capturado.
  - Repo no existe → llama a `createForAuthenticatedUser` antes de `getContent`.
  - README no existe (repo sí) → llama a `createOrUpdateFileContents` sin `sha`.
  - `encodeUtf8Base64` decodifica de vuelta a texto original para caracteres no-ASCII (ej. tildes,
    ñ) — round-trip correcto.
- Verificación end-to-end con una cuenta de GitHub real es **opcional y a cargo del usuario** —
  no bloquea el cierre de esta fase.

## Criterios de aceptación

- [ ] `pnpm build` pasa sin errores de tipos.
- [ ] `src/lib/githubCommit.ts` expone `commitReadmeToProfile` y `encodeUtf8Base64`, recibe el
      cliente Octokit inyectado, sin `any`.
- [ ] `src/hooks/useGithubCommit.ts` expone `status`, `errorMessage`, `repoUrl`, `commit`.
- [ ] El botón "Commit to GitHub" en `MarkdownPreview.tsx` cubre los 5 estados descritos (sin
      sesión, idle, committing, success, error) y se deshabilita sin bloques.
- [ ] El self-check corre y pasa los 4 casos (repo+README existen, repo no existe, README no
      existe, round-trip de `encodeUtf8Base64`) sin llamar a la API real de GitHub.
- [ ] Ningún log ni mensaje de UI incluye el `providerAccessToken` crudo.
