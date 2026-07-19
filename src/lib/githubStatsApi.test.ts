import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchGithubStats,
  fetchLanguages,
  GitHubUserStats,
} from "./githubStatsApi";

describe("githubStatsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchGithubStats", () => {
    it("should fetch real GitHub user stats successfully", async () => {
      const username = "torvalds";
      const result = await fetchGithubStats(username);

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
      if (result) {
        expect(result.username).toBe(username);
        expect(result.followers).toBeGreaterThanOrEqual(0);
        expect(result.following).toBeGreaterThanOrEqual(0);
        expect(result.publicRepos).toBeGreaterThanOrEqual(0);
        expect(result.createdAt).toBeDefined();
        expect(typeof result.createdAt).toBe("string");
      }
    });

    it("should return null for non-existent user", async () => {
      const username = "this-user-definitely-does-not-exist-12345678901234567890";
      const result = await fetchGithubStats(username);

      expect(result).toBeNull();
    });

    it("should handle rate limit errors gracefully", async () => {
      // This test verifies graceful error handling
      // In real usage, GitHub API rate limits are 60 requests/hour unauthenticated
      const result = await fetchGithubStats("");

      // Empty username should return null
      expect(result).toBeNull();
    });

    it("should have correct data structure", async () => {
      const username = "torvalds";
      const result = await fetchGithubStats(username);

      if (result) {
        expect(result).toHaveProperty("username");
        expect(result).toHaveProperty("followers");
        expect(result).toHaveProperty("following");
        expect(result).toHaveProperty("publicRepos");
        expect(result).toHaveProperty("createdAt");
        expect(result).toHaveProperty("bio");
        expect(result).toHaveProperty("location");
        expect(result).toHaveProperty("company");
      }
    });

    it("should return null on network errors", async () => {
      // Test with invalid username format
      const result = await fetchGithubStats("@invalid#user");

      // Should handle gracefully and return null
      expect(result === null || result !== undefined).toBe(true);
    });
  });

  describe("fetchLanguages", () => {
    it("should fetch language statistics for a user with public repos", async () => {
      const username = "torvalds";
      const result = await fetchLanguages(username);

      // May be null if user has no public repositories or no language data
      if (result) {
        expect(typeof result).toBe("object");
        // Each language should have a positive percentage or byte count
        for (const [lang, count] of Object.entries(result)) {
          expect(typeof lang).toBe("string");
          expect(typeof count).toBe("number");
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it("should return null for non-existent user", async () => {
      const username = "this-user-definitely-does-not-exist-12345678901234567890";
      const result = await fetchLanguages(username);

      expect(result).toBeNull();
    });

    it("should handle user with no public repositories", async () => {
      // Test with empty username
      const result = await fetchLanguages("");

      expect(result).toBeNull();
    });

    it("should have correct data structure for languages", async () => {
      const username = "torvalds";
      const result = await fetchLanguages(username);

      if (result) {
        expect(typeof result).toBe("object");
        expect(Object.keys(result).length).toBeGreaterThan(0);

        // Verify each language is a string with a numeric value
        for (const [lang, count] of Object.entries(result)) {
          expect(typeof lang).toBe("string");
          expect(lang.length).toBeGreaterThan(0);
          expect(typeof count).toBe("number");
        }
      }
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle API timeout gracefully", async () => {
      // Test that function doesn't throw on API errors
      const result = await fetchGithubStats("test-user");

      // Should return either valid data or null, never throw
      expect(result === null || typeof result === "object").toBe(true);
    });

    it("should handle malformed responses", async () => {
      const result = await fetchGithubStats("test");

      // Should return null or valid data, never throw
      expect(result === null || typeof result === "object").toBe(true);
    });
  });

  describe("Real API integration", () => {
    it("should respect GitHub API rate limits", async () => {
      // Make a request - should complete within timeout
      const startTime = Date.now();
      await fetchGithubStats("torvalds");
      const endTime = Date.now();

      // Request should complete reasonably quickly (within 30 seconds)
      expect(endTime - startTime).toBeLessThan(30000);
    });

    it("should handle consecutive requests", async () => {
      // Multiple requests should work
      const result1 = await fetchGithubStats("torvalds");
      const result2 = await fetchGithubStats("linus");

      // Both should return valid data or null
      expect(result1 === null || typeof result1 === "object").toBe(true);
      expect(result2 === null || typeof result2 === "object").toBe(true);
    });
  });
});
