import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/auth/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/PageTransition";

const guideTabs = [
  { to: "/guide/tours", label: "Turlar" },
  { to: "/guide/offers", label: "Takliflar" },
  { to: "/guide/apprentice", label: "Hamrohlik" },
  { to: "/guide/level", label: "Daraja" },
  { to: "/guide/earnings", label: "Daromad" },
];
const driverTabs = [
  { to: "/driver/tours", label: "Turlar" },
  { to: "/driver/earnings", label: "Daromad" },
];

export function MobileLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const tabs = user?.role === "guide" ? guideTabs : driverTabs;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div>
          <p className="font-display text-base leading-tight">{user?.full_name}</p>
          <p className="text-xs text-muted">
            {user?.role === "guide" ? `Git · ${user.guide_profile?.level ?? 1}-daraja` : "Haydovchi"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="rounded-md border border-border px-3 py-2 text-sm text-ink active:bg-paper"
          >
            Chiqish
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          <PageTransition pageKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-surface">
        <div className="mx-auto flex max-w-md">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="relative flex flex-1 flex-col items-center gap-1 py-3 text-xs"
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "font-medium text-primary" : "text-muted"}>{tab.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="mobile-tab-indicator"
                      className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
