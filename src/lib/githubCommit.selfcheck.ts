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
          assert.equal(
            params.sha,
            "existing-sha",
            "should reuse the existing sha",
          );
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
          assert.equal(
            params.sha,
            undefined,
            "no sha when README did not exist",
          );
          return {};
        },
      },
    },
  };
  await commitReadmeToProfile(fake, "hello");
  assert.deepEqual(
    calls,
    [
      "get",
      "createForAuthenticatedUser",
      "getContent",
      "createOrUpdateFileContents",
    ],
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
          assert.equal(
            params.sha,
            undefined,
            "no sha when README did not exist",
          );
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
  assert.equal(
    decoded,
    original,
    "base64 round-trip should preserve non-ASCII text",
  );
}

console.log("githubCommit.selfcheck: all assertions passed");
