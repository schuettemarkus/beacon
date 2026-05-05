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
import { getStoredUser, type AuthUser } from "@/lib/client-auth";

const UserContext = createContext<AuthUser | null>(null);

export function useUser() {
  return useContext(UserContext);
}

export type { AuthUser };

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

  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
    setHydrated(true);
  }, []);

  // Re-check user on route changes (e.g. after login/logout)
  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  // Redirect logic
  useEffect(() => {
    if (!hydrated) return;
    if (!user && pathname !== "/login") {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, pathname, hydrated, router]);

  // Show nothing while hydrating to avoid flash
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
