import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { RoleRoute } from "@/auth/RoleRoute";
import { LoginPage } from "@/pages/LoginPage";

import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";
import { OverviewPage } from "@/pages/super-admin/OverviewPage";
import { SuperAdminUsersPage } from "@/pages/super-admin/UsersPage";
import { LevelFeesPage } from "@/pages/super-admin/LevelFeesPage";
import { SuperAdminToursPage } from "@/pages/super-admin/ToursPage";

import { BossLayout } from "@/layouts/BossLayout";
import { BossDashboardPage } from "@/pages/boss/BossDashboardPage";
import { AdminsPage } from "@/pages/boss/AdminsPage";
import { BossToursPage } from "@/pages/boss/BossToursPage";
import { BossDailyReportPage } from "@/pages/boss/BossDailyReportPage";
import { BossMonthlyReportPage } from "@/pages/boss/BossMonthlyReportPage";

import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { ToursListPage } from "@/pages/admin/ToursListPage";
import { TourCreatePage } from "@/pages/admin/TourCreatePage";
import { TourDetailPage } from "@/pages/admin/TourDetailPage";
import { PayoutsPage } from "@/pages/admin/PayoutsPage";
import { PendingBonusPage } from "@/pages/admin/PendingBonusPage";

import { MobileLayout } from "@/layouts/MobileLayout";
import { GuideToursPage } from "@/pages/guide/GuideToursPage";
import { GuideTourDetailPage } from "@/pages/guide/GuideTourDetailPage";
import { GuideOffersPage } from "@/pages/guide/GuideOffersPage";
import { GuideApprenticePage } from "@/pages/guide/GuideApprenticePage";
import { GuideLevelPage } from "@/pages/guide/GuideLevelPage";
import { DriverToursPage } from "@/pages/driver/DriverToursPage";
import { DriverTourDetailPage } from "@/pages/driver/DriverTourDetailPage";
import { MeEarningsPage } from "@/pages/common/MeEarningsPage";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          {/* Super admin */}
          <Route element={<RoleRoute allow={["super_admin"]} />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="users" element={<SuperAdminUsersPage />} />
              <Route path="level-fees" element={<LevelFeesPage />} />
              <Route path="tours" element={<SuperAdminToursPage />} />
            </Route>
          </Route>

          {/* Boss */}
          <Route element={<RoleRoute allow={["boss"]} />}>
            <Route path="/boss" element={<BossLayout />}>
              <Route index element={<BossDashboardPage />} />
              <Route path="admins" element={<AdminsPage />} />
              <Route path="tours" element={<BossToursPage />} />
              <Route path="reports/daily" element={<BossDailyReportPage />} />
              <Route path="reports/monthly" element={<BossMonthlyReportPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allow={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="tours" element={<ToursListPage />} />
              <Route path="tours/new" element={<TourCreatePage />} />
              <Route path="tours/:id" element={<TourDetailPage />} />
              <Route path="payouts" element={<PayoutsPage />} />
              <Route path="pending-bonus" element={<PendingBonusPage />} />
            </Route>
          </Route>

          {/* Guide */}
          <Route element={<RoleRoute allow={["guide"]} />}>
            <Route path="/guide" element={<MobileLayout />}>
              <Route path="tours" element={<GuideToursPage />} />
              <Route path="tours/:id" element={<GuideTourDetailPage />} />
              <Route path="offers" element={<GuideOffersPage />} />
              <Route path="apprentice" element={<GuideApprenticePage />} />
              <Route path="level" element={<GuideLevelPage />} />
              <Route path="earnings" element={<MeEarningsPage />} />
            </Route>
          </Route>

          {/* Driver */}
          <Route element={<RoleRoute allow={["driver"]} />}>
            <Route path="/driver" element={<MobileLayout />}>
              <Route path="tours" element={<DriverToursPage />} />
              <Route path="tours/:id" element={<DriverTourDetailPage />} />
              <Route path="earnings" element={<MeEarningsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
