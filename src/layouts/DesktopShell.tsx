import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/auth/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/PageTransition";

export interface NavItem {
  to: string;
  label: string;
  badge?: number;
}

const roleLabel: Record<string, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  boss: "Boshliq",
};

export function DesktopShell({ navItems, sectionTitle }: { navItems: NavItem[]; sectionTitle: string }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <p className="font-display text-lg leading-tight">Turfirma</p>
            <p className="text-xs text-muted">{sectionTitle}</p>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split("/").length <= 2}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary text-white" : "text-ink hover:bg-paper"
                }`
              }
            >
              <span>{item.label}</span>
              {!!item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-medium text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate px-1 text-sm font-medium">{user?.full_name}</p>
          <p className="px-1 text-xs text-muted">{user ? roleLabel[user.role] : ""}</p>
          <button
            onClick={signOut}
            className="mt-2 w-full rounded-md border border-border px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-paper"
          >
            Chiqish
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <AnimatePresence mode="wait">
            <PageTransition pageKey={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
