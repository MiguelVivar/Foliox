# Foliox — Fase 6b: Integración Octokit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Botón "Commit to GitHub" en `MarkdownPreview.tsx` que serializa el lienzo actual a
Markdown y lo pushea como `README.md` al repo especial de perfil `{login}/{login}`, creando el
repo si no existe, usando Octokit en el cliente con el `providerAccessToken` que Appwrite ya
guarda en la sesión de GitHub OAuth.

**Architecture:** Lógica pura en `src/lib/githubCommit.ts` que recibe un cliente Octokit
inyectado tipado con una interfaz mínima (`GithubClient`, solo los 5 métodos usados) — el self
check pasa un objeto plano que cumple esa interfaz sin mockear módulos ni tocar la API real. Un
hook `useGithubCommit.ts` (mismo patrón sin Zustand que `useApiKey`) obtiene el token de la
sesión de Appwrite, construye el Octokit real, y llama a la lógica pura.

**Tech Stack:** `@octokit/rest` (nueva dependencia, ya instalada — ver Task 0).

## Global Constraints

- Gestor de paquetes: **pnpm** exclusivamente.
- TypeScript estricto: cero `any`.
- El `providerAccessToken` **nunca** se persiste ni se loguea — se obtiene de la sesión de
  Appwrite en cada commit y se descarta tras usarse.
- Verificado contra `node_modules/.pnpm/@octokit+plugin-rest-endpoi_*/node_modules/@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types.d.ts`
  antes de escribir este plan: `octokit.rest.users.getAuthenticated`, `octokit.rest.repos.get`,
  `octokit.rest.repos.createForAuthenticatedUser`, `octokit.rest.repos.getContent`,
  `octokit.rest.repos.createOrUpdateFileContents` existen tal cual en `@octokit/rest@22.0.1`.
- Sin verificación end-to-end contra una cuenta de GitHub real (fuera de alcance del spec, ver
  `docs/superpowers/specs/2026-07-14-foliox-fase6b-octokit-design.md`).

---

### Task 0: Dependencia ya instalada

`@octokit/rest@22.0.1` ya fue agregado a `package.json`/`pnpm-lock.yaml` durante la
investigación de tipos previa a este plan (mismo efecto que un `pnpm add`). No hay step aparte —
el Task 1 ya lo usa directamente. Si al ejecutar `pnpm exec tsc` faltara, correr:

```bash
pnpm add @octokit/rest
```

---

### Task 1: `src/lib/githubCommit.ts`

**Files:**
- Create: `src/lib/githubCommit.ts`

**Interfaces:**
- Produces: `encodeUtf8Base64(text: string): string`, `type GithubClient` (interfaz mínima
  estructural que `Octokit` real cumple), `commitReadmeToProfile(octokit: GithubClient, markdown:
  string): Promise<{ repoUrl: string }>`.

- [ ] **Step 1: Crear `src/lib/githubCommit.ts`**

```ts
export type GithubClient = {
  rest: {
    users: {
      getAuthenticated: () => Promise<{ data: { login: string } }>;
    };
    repos: {
      get: (params: { owner: string; repo: string }) => Promise<unknown>;
      createForAuthenticatedUser: (params: {
        name: string;
        private: boolean;
      }) => Promise<unknown>;
      getContent: (params: {
        owner: string;
        repo: string;
        path: string;
      }) => Promise<{ data: { sha: string } | unknown[] }>;
      createOrUpdateFileContents: (params: {
        owner: string;
        repo: string;
        path: string;
        message: string;
        content: string;
        sha?: string;
      }) => Promise<unknown>;
    };
  };
};

export function encodeUtf8Base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: unknown }).status === 404
  );
}

export async function commitReadmeToProfile(
  octokit: GithubClient,
  markdown: string,
): Promise<{ repoUrl: string }> {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  try {
    await octokit.rest.repos.get({ owner: login, repo: login });
  } catch (error: unknown) {
    if (!isNotFoundError(error)) throw error;
    await octokit.rest.repos.createForAuthenticatedUser({
      name: login,
      private: false,
    });
  }

  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: login,
      repo: login,
      path: "README.md",
    });
    if (!Array.isArray(data)) sha = data.sha;
  } catch (error: unknown) {
    if (!isNotFoundError(error)) throw error;
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: login,
    repo: login,
    path: "README.md",
    message: "Update README via Foliox",
    content: encodeUtf8Base64(markdown),
    sha,
  });

  return { repoUrl: `https://github.com/${login}/${login}` };
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/lib/githubCommit.ts
git commit -m "feat: add commitReadmeToProfile (Octokit push to {login}/{login} README.md)"
```

---

### Task 2: `src/hooks/useGithubCommit.ts`

**Files:**
- Create: `src/hooks/useGithubCommit.ts`

**Interfaces:**
- Consumes: `commitReadmeToProfile` desde `@/lib/githubCommit`, `account` desde
  `@/config/appwrite`.
- Produces: `useGithubCommit()` → `{ status: "idle" | "committing" | "success" | "error"; errorMessage: string | null; repoUrl: string | null; commit: (markdown: string) => Promise<void> }`.

- [ ] **Step 1: Crear `src/hooks/useGithubCommit.ts`**

```ts
"use client";

import { useCallback, useState } from "react";
import { Octokit } from "@octokit/rest";
import { account } from "@/config/appwrite";
import { commitReadmeToProfile } from "@/lib/githubCommit";

type Status = "idle" | "committing" | "success" | "error";

export function useGithubCommit(): {
  status: Status;
  errorMessage: string | null;
  repoUrl: string | null;
  commit: (markdown: string) => Promise<void>;
} {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  const commit = useCallback(async (markdown: string) => {
    setStatus("committing");
    setErrorMessage(null);
    try {
      const session = await account.getSession("current");
      const octokit = new Octokit({ auth: session.providerAccessToken });
      const { repoUrl: url } = await commitReadmeToProfile(octokit, markdown);
      setRepoUrl(url);
      setStatus("success");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Commit failed");
      setStatus("error");
    }
  }, []);

  return { status, errorMessage, repoUrl, commit };
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useGithubCommit.ts
git commit -m "feat: add useGithubCommit hook (Appwrite session token -> Octokit)"
```

---

### Task 3: Botón "Commit to GitHub" en `MarkdownPreview.tsx`

**Files:**
- Modify: `src/components/editor/MarkdownPreview.tsx`

**Interfaces:**
- Consumes: `useAuthStore` desde `@/store/useAuthStore`, `useGithubCommit` desde
  `@/hooks/useGithubCommit`.

- [ ] **Step 1: Editar `src/components/editor/MarkdownPreview.tsx`**

Reemplazar el contenido completo del archivo por:

```tsx
"use client";

import { useState } from "react";
import { Check, Copy, Download, Github } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGithubCommit } from "@/hooks/useGithubCommit";
import { serializeBlocks } from "@/lib/markdownSerializer";
import { MonospaceLabel } from "@/components/atoms/MonospaceLabel";

export function MarkdownPreview() {
  const { blocks } = useEditorStore();
  const markdown = serializeBlocks(blocks);

  const [copied, setCopied] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { status, errorMessage, repoUrl, commit } = useGithubCommit();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked (e.g. no HTTPS in some envs) — silent fail
    }
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "foliox-readme.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleCommit() {
    if (!user) {
      useAuthStore.getState().login();
      return;
    }
    void commit(markdown);
  }

  const iconBtn =
    "flex items-center gap-1.5 rounded-sm border border-[var(--border-subtle)] px-2.5 py-1.5 font-mono text-[10px] text-[var(--text-muted)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-50";

  const commitLabel =
    status === "committing"
      ? "Committing..."
      : status === "success"
        ? "Committed!"
        : status === "error"
          ? "Failed"
          : "Commit to GitHub";

  return (
    <div className="flex h-full flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
        <MonospaceLabel>[MARKDOWN OUTPUT]</MonospaceLabel>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleCopy} className={iconBtn}>
            {copied ? (
              <Check size={11} className="text-green-400" />
            ) : (
              <Copy size={11} />
            )}
            {copied ? "Copied!" : "Copy Markdown"}
          </button>
          <button type="button" onClick={handleDownload} className={iconBtn}>
            <Download size={11} />
            Download .md
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={status === "committing" || blocks.length === 0}
            title={status === "error" ? (errorMessage ?? undefined) : undefined}
            className={
              status === "success"
                ? `${iconBtn} text-green-400`
                : status === "error"
                  ? `${iconBtn} text-red-400`
                  : iconBtn
            }
          >
            {status === "success" ? (
              <Check size={11} className="text-green-400" />
            ) : (
              <Github size={11} />
            )}
            {commitLabel}
          </button>
          {status === "success" && repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
            >
              View
            </a>
          )}
        </div>
      </div>

      {/* Preview body */}
      <div className="flex-1 overflow-y-auto p-4">
        {markdown ? (
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--text-primary)]">
            {markdown}
          </pre>
        ) : (
          <p className="font-mono text-xs italic text-[var(--text-muted)]">
            Add blocks to see your Markdown output here.
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit --pretty false`
Expected: sin salida (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/MarkdownPreview.tsx
git commit -m "feat: add Commit to GitHub button to MarkdownPreview footer"
```

---

### Task 4: Self-check + verificación final

**Files:**
- Create: `src/lib/githubCommit.selfcheck.ts`

**Interfaces:** N/A — script standalone, no se importa desde la app.

- [ ] **Step 1: Crear el self-check**

```ts
import assert from "node:assert/strict";
import {
  commitReadmeToProfile,
  encodeUtf8Base64,
  type GithubClient,
} from "./githubCommit.ts";

function notFound(): never {
  const error = new Error("Not Found") as Error & { status: number };
  error.status = 404;
  throw error;
}

// Case 1: repo exists, README exists -> no repo creation, sha carried through
{
  const calls: string[] = [];
  const fake: GithubClient = {
    rest: {
      users: {
        getAuthenticated: async () => ({ data: { login: "octocat" } }),
      },
      repos: {
        get: async () => {
          calls.push("get");
          return {};
        },
        createForAuthenticatedUser: async () => {
          calls.push("createForAuthenticatedUser");
          return {};
        },
        getContent: async () => {
          calls.push("getContent");
          return { data: { sha: "existing-sha" } };
        },
        createOrUpdateFileContents: async (params) => {
          calls.push("createOrUpdateFileContents");
          assert.equal(params.sha, "existing-sha", "should reuse the existing sha");
          return {};
        },
      },
    },
  };
  const result = await commitReadmeToProfile(fake, "hello");
  assert.deepEqual(
    calls,
    ["get", "getContent", "createOrUpdateFileContents"],
    "existing repo+README should skip repo creation",
  );
  assert.equal(result.repoUrl, "https://github.com/octocat/octocat");
}

// Case 2: repo missing -> createForAuthenticatedUser runs before getContent
{
  const calls: string[] = [];
  const fake: GithubClient = {
    rest: {
      users: {
        getAuthenticated: async () => ({ data: { login: "octocat" } }),
      },
      repos: {
        get: async () => {
          calls.push("get");
          notFound();
        },
        createForAuthenticatedUser: async () => {
          calls.push("createForAuthenticatedUser");
          return {};
        },
        getContent: async () => {
          calls.push("getContent");
          notFound();
        },
        createOrUpdateFileContents: async (params) => {
          calls.push("createOrUpdateFileContents");
          assert.equal(params.sha, undefined, "no sha when README did not exist");
          return {};
        },
      },
    },
  };
  await commitReadmeToProfile(fake, "hello");
  assert.deepEqual(
    calls,
    ["get", "createForAuthenticatedUser", "getContent", "createOrUpdateFileContents"],
    "missing repo should be created before checking README",
  );
}

// Case 3: repo exists but README missing -> createOrUpdateFileContents without sha
{
  const fake: GithubClient = {
    rest: {
      users: {
        getAuthenticated: async () => ({ data: { login: "octocat" } }),
      },
      repos: {
        get: async () => ({}),
        createForAuthenticatedUser: async () => {
          throw new Error("should not be called when repo exists");
        },
        getContent: async () => notFound(),
        createOrUpdateFileContents: async (params) => {
          assert.equal(params.sha, undefined, "no sha when README did not exist");
          return {};
        },
      },
    },
  };
  await commitReadmeToProfile(fake, "hello");
}

// Case 4: encodeUtf8Base64 round-trips non-ASCII text
{
  const original = "José — café con ñ";
  const encoded = encodeUtf8Base64(original);
  const decoded = new TextDecoder().decode(
    Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0)),
  );
  assert.equal(decoded, original, "base64 round-trip should preserve non-ASCII text");
}

console.log("githubCommit.selfcheck: all assertions passed");
```

- [ ] **Step 2: Correr el self-check**

Run: `node --experimental-strip-types src/lib/githubCommit.selfcheck.ts`
Expected: imprime confirmación, exit code 0.

- [ ] **Step 3: Build completo**

Run: `pnpm build`
Expected: build exitoso sin errores de tipos.

- [ ] **Step 4: Commit**

```bash
git add src/lib/githubCommit.selfcheck.ts
git commit -m "test: add self-check for commitReadmeToProfile and encodeUtf8Base64"
```
