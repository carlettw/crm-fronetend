import { DesktopShell, type NavItem } from "@/layouts/DesktopShell";

const navItems: NavItem[] = [
  { to: "/super-admin", label: "Umumiy ko'rinish" },
  { to: "/super-admin/users", label: "Foydalanuvchilar" },
  { to: "/super-admin/level-fees", label: "Daraja haqlari" },
  { to: "/super-admin/tours", label: "Barcha turlar" },
];

export function SuperAdminLayout() {
  return <DesktopShell navItems={navItems} sectionTitle="Super admin" />;
}
