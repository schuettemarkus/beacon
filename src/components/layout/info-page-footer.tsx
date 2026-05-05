import Link from "next/link";

const footerLinks = [
  { href: "/wiki", label: "Wiki" },
  { href: "/faq", label: "FAQ" },
  { href: "/sources", label: "Sources" },
  { href: "/releases", label: "Releases" },
  { href: "/tech-stack", label: "Tech Stack" },
  { href: "/cookies", label: "Cookies" },
  { href: "/privacy", label: "Privacy" },
];

export function InfoPageFooter() {
  return (
    <footer className="mt-20 border-t border-border/40 pt-8 pb-12">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          Back to Beacon
        </Link>
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-4 text-center text-xs text-muted-foreground/60">
        &copy; {new Date().getFullYear()} Beacon. All rights reserved.
      </p>
    </footer>
  );
}
