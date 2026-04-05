'use client';

/**
 * AxiosConfig — sets up global Axios defaults and request interceptors.
 *
 * Rendered once in the root layout (layout.tsx) inside the UserProvider.
 * Returns null — no visible DOM output.
 *
 * What it configures:
 *  1. `baseURL` — all relative `/api/...` calls resolve to NEXT_PUBLIC_API_URL.
 *  2. `withCredentials` — sends the HTTP-only JWT cookie on every cross-origin request.
 *  3. Request interceptor — reads `jwtToken` from localStorage and attaches it
 *     as `Authorization: Bearer <token>`.  This is a fallback for environments
 *     where cookies are blocked (e.g. some privacy-hardened browsers).
 *
 * Security note: The cookie path (withCredentials) is preferred because HTTP-only
 * cookies are inaccessible to JavaScript and immune to XSS.  The localStorage Bearer
 * path is less secure.  See ARCHITECTURE.md §3 for context.
 */

import { useEffect } from 'react';
import axios from 'axios';

export default function AxiosConfig() {
  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
    axios.defaults.withCredentials = true;

    // Attach JWT from localStorage as Bearer header on every request.
    // This allows authentication in environments where cookies are blocked.
    const interceptorId = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Eject the interceptor on unmount to prevent duplicate registrations
    // during hot-module replacement in development.
    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, []);

  return null;
}
