import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Spinner from "./components/ui/Spinner.jsx";
import StudentWorkspaceLayout from "./components/student/StudentWorkspaceLayout.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudentDashboardPage from "./pages/student/StudentDashboardPage.jsx";
import StudentProfilePage from "./pages/student/StudentProfilePage.jsx";
import StudentRequestPage from "./pages/student/StudentRequestPage.jsx";
import StudentRequestsPage from "./pages/student/StudentRequestsPage.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage.jsx"),
);
const AdminEmergencyRequestsPage = lazy(
  () => import("./pages/admin/AdminEmergencyRequestsPage.jsx"),
);
const AdminSectionPage = lazy(
  () => import("./pages/admin/AdminSectionPage.jsx"),
);
const StudentTrackPage = lazy(
  () => import("./pages/student/StudentTrackPage.jsx"),
);

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm font-semibold text-muted">
          <Spinner label="Loading workspace" />
          Loading workspace...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route
                path="emergency-requests"
                element={<AdminEmergencyRequestsPage />}
              />
              <Route
                path="requests"
                element={<Navigate to="/admin/emergency-requests" replace />}
              />
              <Route path="ambulances" element={<AdminSectionPage section="ambulances" />} />
              <Route path="drivers" element={<AdminSectionPage section="drivers" />} />
              <Route path="students" element={<AdminSectionPage section="students" />} />
              <Route path="tracking" element={<AdminSectionPage section="tracking" />} />
              <Route path="reports" element={<AdminSectionPage section="reports" />} />
              <Route path="settings" element={<AdminSectionPage section="settings" />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentWorkspaceLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="request" element={<StudentRequestPage />} />
              <Route
                path="track"
                element={<Navigate to="/student/track-ambulance" replace />}
              />
              <Route path="track-ambulance" element={<StudentTrackPage />} />
              <Route path="requests" element={<StudentRequestsPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
