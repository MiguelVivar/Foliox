/**
 * GitHub Stats API Integration
 * Fetches real user statistics directly from GitHub REST API (public, no auth needed)
 * Implements caching with 1-hour revalidation (Next.js revalidate)
 */

export type GitHubUserStats = {
  username: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  bio: string | null;
  location: string | null;
  company: string | null;
};

type GitHubAPIUser = {
  login: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  bio: string | null;
  location: string | null;
  company: string | null;
};

type GitHubAPIRepo = {
  name: string;
  language: string | null;
  stargazers_count: number;
  size: number;
};

/**
 * Fetches GitHub user stats from the public GitHub API
 * No authentication required for public endpoints
 *
 * @param username GitHub username
 * @returns GitHubUserStats or null if user not found or error occurs
 */
export async function fetchGithubStats(
  username: string,
): Promise<GitHubUserStats | null> {
  if (!username || username.trim().length === 0) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // User not found
      }
      if (response.status === 403) {
        console.warn(
          `GitHub API rate limit reached for user ${username}. Try again later.`,
        );
        return null;
      }
      return null; // Other API errors
    }

    const data = (await response.json()) as GitHubAPIUser;

    return {
      username: data.login,
      followers: data.followers,
      following: data.following,
      publicRepos: data.public_repos,
      createdAt: data.created_at,
      bio: data.bio,
      location: data.location,
      company: data.company,
    };
  } catch (error) {
    console.error(`Error fetching GitHub stats for ${username}:`, error);
    return null;
  }
}

/**
 * Fetches language statistics for a GitHub user's repositories
 * Calculates the byte count for each language across all public repos
 *
 * @param username GitHub username
 * @returns Record of language names to byte counts, or null if user not found or has no repos
 */
export async function fetchLanguages(
  username: string,
): Promise<Record<string, number> | null> {
  if (!username || username.trim().length === 0) {
    return null;
  }

  try {
    // Fetch all public repositories for the user
    // GitHub paginated endpoint, get max 100 per page
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=stars`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // User not found
      }
      if (response.status === 403) {
        console.warn(`GitHub API rate limit reached. Try again later.`);
        return null;
      }
      return null;
    }

    const repos = (await response.json()) as GitHubAPIRepo[];

    if (!Array.isArray(repos) || repos.length === 0) {
      return null; // No repositories
    }

    // Aggregate language byte counts
    const languageStats: Record<string, number> = {};

    for (const repo of repos) {
      if (repo.language) {
        languageStats[repo.language] =
          (languageStats[repo.language] || 0) + (repo.size || 0);
      }
    }

    // If no languages found, return null
    if (Object.keys(languageStats).length === 0) {
      return null;
    }

    return languageStats;
  } catch (error) {
    console.error(
      `Error fetching languages for GitHub user ${username}:`,
      error,
    );
    return null;
  }
}
