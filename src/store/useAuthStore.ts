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
