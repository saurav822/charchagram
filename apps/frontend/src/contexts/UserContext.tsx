'use client';

/**
 * UserContext — provides the currently authenticated user to the component tree.
 *
 * The context is intentionally minimal: it holds the user object fetched from
 * /api/auth/ping on app load.  Components that need the full user profile
 * (e.g. ProfilePage) should fetch directly via getUserData() to avoid
 * keeping a stale copy here.
 */

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@/types/user';

// ── Context shape ─────────────────────────────────────────────────────────────

interface UserContextType {
  /** The authenticated user, or null if unauthenticated / not yet loaded. */
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

/**
 * Wraps the app and makes `useUser()` available to all descendants.
 *
 * Authentication state is managed locally in each page/component that needs it
 * (e.g. login/page.tsx stores the user in localStorage after OTP verification).
 * This provider exists as an extension point for future global auth state.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  // User state is currently managed per-page (localStorage + axios interceptor).
  // This provider is kept as a stable extension point — future work can move
  // the fetchUserInfo logic here and expose setUser to the login flow.
  const value: UserContextType = { user: null };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Returns the current user context value.
 *
 * @throws {Error} If called outside of a UserProvider
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
