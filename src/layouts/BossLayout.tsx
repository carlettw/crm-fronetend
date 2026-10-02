import { DesktopShell, type NavItem } from "@/layouts/DesktopShell";

const navItems: NavItem[] = [
  { to: "/boss", label: "Umumiy ko'rinish" },
  { to: "/boss/admins", label: "Adminlar" },
  { to: "/boss/tours", label: "Turlar (moliya)" },
  { to: "/boss/reports/daily", label: "Kunlik hisobot" },
  { to: "/boss/reports/monthly", label: "Oylik hisobot" },
];

export function BossLayout() {
  return <DesktopShell navItems={navItems} sectionTitle="Boshliq paneli" />;
}
