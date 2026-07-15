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
