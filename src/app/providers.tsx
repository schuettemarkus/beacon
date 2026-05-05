"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { CommandBar } from "@/components/layout/command-bar";
import { AppShell } from "@/components/layout/app-shell";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
} | null;

const UserContext = createContext<AuthUser>(null);

export function useUser() {
  return useContext(UserContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [user, setUser] = useState<AuthUser>(null);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data?.user || null);
        setHydrated(true);
      })
      .catch(() => {
        setUser(null);
        setHydrated(true);
      });
  }, []);

  // Re-check on route changes (post-login/logout)
  useEffect(() => {
    if (!hydrated) return;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname, hydrated]);

  // Redirect logic
  useEffect(() => {
    if (!hydrated) return;
    if (!user && pathname !== "/login") {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, pathname, hydrated, router]);

  if (!hydrated) return null;

  const isLoginPage = pathname === "/login";

  return (
    <UserContext.Provider value={user}>
      <QueryClientProvider client={queryClient}>
        {isLoginPage ? (
          children
        ) : user ? (
          <AppShell>{children}</AppShell>
        ) : null}
        {user && <CommandBar />}
      </QueryClientProvider>
    </UserContext.Provider>
  );
}
