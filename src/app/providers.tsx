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
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ShortcutsHelp } from "@/components/layout/shortcuts-help";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  industry: string;
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

  const publicPages = ["/login", "/wiki", "/faq", "/sources", "/releases", "/tech-stack", "/cookies", "/privacy"];
  const isPublicPage = publicPages.includes(pathname);

  // Redirect logic
  useEffect(() => {
    if (!hydrated) return;
    if (!user && !isPublicPage) {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, pathname, hydrated, router, isPublicPage]);

  // Apply dark mode preference on mount
  useEffect(() => {
    const dark = localStorage.getItem("beacon_dark_mode") === "true";
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  if (!hydrated) return null;

  return (
    <UserContext.Provider value={user}>
      <QueryClientProvider client={queryClient}>
        {isPublicPage ? (
          children
        ) : user ? (
          <AppShell>{children}</AppShell>
        ) : null}
        {user && <CommandBar />}
        {user && <KeyboardShortcutsProvider />}
      </QueryClientProvider>
    </UserContext.Provider>
  );
}

function KeyboardShortcutsProvider() {
  const { showHelp, setShowHelp } = useKeyboardShortcuts();
  return <ShortcutsHelp open={showHelp} onOpenChange={setShowHelp} />;
}
