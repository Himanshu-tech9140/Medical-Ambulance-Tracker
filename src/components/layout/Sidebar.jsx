import {
  Activity,
  Ambulance,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPinned,
  Settings,
  Siren,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === "student";
  const dashboardPath = isStudent ? "/student/dashboard" : "/admin/dashboard";
  const primaryLinks = isStudent
    ? [
        { label: "Dashboard", to: dashboardPath, icon: LayoutDashboard },
        { label: "Request Ambulance", to: "/student/request", icon: Siren },
        {
          label: "Track Ambulance",
          to: "/student/track-ambulance",
          icon: MapPinned,
        },
        { label: "My Requests", to: "/student/requests", icon: ClipboardList },
        { label: "My Profile", to: "/student/profile", icon: Users },
      ]
    : [
        { label: "Dashboard", to: dashboardPath, icon: LayoutDashboard },
        { label: "Emergency Requests", to: "/admin/emergency-requests", icon: Siren },
        { label: "Ambulance Management", to: "/admin/ambulances", icon: Ambulance },
        { label: "Driver Management", to: "/admin/drivers", icon: Users },
        { label: "Student Management", to: "/admin/students", icon: Users },
        { label: "Live Tracking", to: "/admin/tracking", icon: MapPinned },
        { label: "Reports & Analytics", to: "/admin/reports", icon: FileBarChart },
        { label: "Settings", to: "/admin/settings", icon: Settings },
      ];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-slate-100 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
          <NavLink
            className="flex items-center gap-3"
            onClick={onClose}
            to={dashboardPath}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <Activity size={21} strokeWidth={2.5} />
            </span>
            <span>
              <span className="font-display block text-lg font-extrabold tracking-tight text-ink">
                Jeevan<span className="text-brand-600">Setu</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Care, connected
              </span>
            </span>
          </NavLink>
          <button
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="scrollbar-hidden flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <div className="mt-3 space-y-1">
            {primaryLinks
              .filter(({ role }) => !role || role === user?.role)
              .map(({ label, to, icon: Icon }) => (
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                    }`
                  }
                  key={to}
                  onClick={onClose}
                  to={to}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span>{label}</span>
                  {label === "Ambulance tracking" && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-emergency" />
                  )}
                </NavLink>
              ))}
          </div>

          <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Support
          </p>
          <div className="mt-3 space-y-1">
            <a
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-ink"
              href="mailto:support@jeevansetu.example"
            >
              <LifeBuoy size={18} strokeWidth={1.9} />
              Help & support
            </a>
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-brand-50 p-4">
            <div className="flex items-center gap-2 text-brand-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-bold">All systems operational</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Patient care services are running normally.
            </p>
          </div>
          <p className="mt-4 px-1 text-[11px] text-slate-400">
            JeevanSetu Dashboard · v1.0
          </p>
          <button
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={18} strokeWidth={1.9} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
