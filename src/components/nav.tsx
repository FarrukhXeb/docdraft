"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { TopNav, type NavLink } from "@/components/ui/top-nav";
import { ThemeToggle } from "@/components/theme-toggle";

const links: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/library", label: "Answer Library", icon: "library-big" },
  { href: "/proposals", label: "Proposals", icon: "file-text" },
];

export function Nav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  const active =
    links.find((l) => l.href && pathname.startsWith(l.href))?.href ?? pathname;

  return (
    <TopNav
      links={links}
      active={active}
      userEmail={userEmail}
      onNavigate={(l) => l.href && router.push(l.href)}
      onSignOut={handleSignOut}
      right={<ThemeToggle />}
    />
  );
}
