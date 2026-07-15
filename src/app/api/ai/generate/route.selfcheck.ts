import assert from "node:assert/strict";
import { resolveModelId, validateGenerateRequest } from "./route.ts";

// apiKey missing
assert.deepEqual(
  validateGenerateRequest({ bio: "hi", provider: "openai" }),
  { error: "apiKey is required" },
  "missing apiKey should fail validation",
);

// apiKey empty
assert.deepEqual(
  validateGenerateRequest({ apiKey: "", bio: "hi", provider: "openai" }),
  { error: "apiKey is required" },
  "empty apiKey should fail validation",
);

// bio missing
assert.deepEqual(
  validateGenerateRequest({ apiKey: "sk-test", provider: "openai" }),
  { error: "bio is required" },
  "missing bio should fail validation",
);

// bio empty
assert.deepEqual(
  validateGenerateRequest({ apiKey: "sk-test", bio: "", provider: "openai" }),
  { error: "bio is required" },
  "empty bio should fail validation",
);

// invalid provider
assert.deepEqual(
  validateGenerateRequest({ apiKey: "sk-test", bio: "hi", provider: "gemini" }),
  { error: "invalid provider" },
  "invalid provider should fail validation",
);

// missing provider
assert.deepEqual(
  validateGenerateRequest({ apiKey: "sk-test", bio: "hi" }),
  { error: "invalid provider" },
  "missing provider should fail validation",
);

// valid request
assert.deepEqual(
  validateGenerateRequest({ apiKey: "sk-test", bio: "hi", provider: "openai" }),
  { apiKey: "sk-test", bio: "hi", provider: "openai" },
  "a fully valid request should pass through unchanged",
);

// model selection
assert.equal(
  resolveModelId("openai"),
  "gpt-4o-mini",
  "openai should resolve to gpt-4o-mini",
);
assert.equal(
  resolveModelId("anthropic"),
  "claude-sonnet-5",
  "anthropic should resolve to claude-sonnet-5",
);

console.log("route.selfcheck: all assertions passed");
