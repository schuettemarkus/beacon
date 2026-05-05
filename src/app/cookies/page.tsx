import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "Cookie Policy — Beacon",
  description: "How Beacon uses cookies and local storage.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground">
            How Beacon uses cookies and browser storage
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-headings:tracking-tight">
          <p>
            Beacon uses a minimal set of browser storage to provide core
            functionality. We do not use third-party tracking cookies or
            advertising cookies.
          </p>

          <h2>Essential Cookies</h2>
          <div className="not-prose">
            <div className="overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-slate-50/50">
                    <th className="px-5 py-3 text-left font-medium text-foreground">
                      Cookie
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-foreground">
                      Purpose
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-foreground">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-foreground">
                      beacon_session
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      Authentication session
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      httpOnly, sameSite: lax, 7-day expiry
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p>
            The <code>beacon_session</code> cookie is strictly necessary for the
            application to function. It identifies your authenticated session and
            is set when you log in. It cannot be used to track you across other
            websites.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Beacon does not set any third-party cookies. We do not use Google
            Analytics, Facebook Pixel, or any other third-party tracking service.
          </p>

          <h2>Analytics Cookies</h2>
          <p>
            Beacon does not currently use any analytics cookies. If we introduce
            analytics in the future, this policy will be updated and you will be
            informed.
          </p>

          <h2>Local Storage</h2>
          <p>
            In addition to cookies, Beacon uses your browser&apos;s localStorage
            for the following:
          </p>
          <div className="not-prose">
            <div className="overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-slate-50/50">
                    <th className="px-5 py-3 text-left font-medium text-foreground">
                      Key
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-foreground">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="px-5 py-3 text-muted-foreground">
                      Recent research searches
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      Stores your recent company search queries for quick access
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">
                      React Query cache
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      Caches API responses locally for faster page loads and
                      offline resilience
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p>
            All localStorage data stays on your device and is never transmitted to
            our servers. You can clear it at any time through your browser
            settings.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about how Beacon uses cookies or browser
            storage, please reach out through the app&apos;s feedback channel.
          </p>
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
