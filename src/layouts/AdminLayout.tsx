import { useQuery } from "@tanstack/react-query";
import { DesktopShell, type NavItem } from "@/layouts/DesktopShell";
import { fetchPendingBonusReviews } from "@/api/adminTours";

export function AdminLayout() {
  const { data } = useQuery({
    queryKey: ["pending-bonus-reviews"],
    queryFn: fetchPendingBonusReviews,
    refetchOnWindowFocus: true,
  });

  const navItems: NavItem[] = [
    { to: "/admin", label: "Bosh sahifa" },
    { to: "/admin/tours", label: "Turlar" },
    { to: "/admin/pending-bonus", label: "Bonus/jarima", badge: data?.length },
  ];

  return <DesktopShell navItems={navItems} sectionTitle="Admin paneli" />;
}
