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
