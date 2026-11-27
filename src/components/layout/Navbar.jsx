import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.username || "JeevanSetu user";
  const roleLabel = user?.role === "admin" ? "Administrator" : "Student";
  const initials = displayName.slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation menu"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={21} />
        </button>
        <div className="hidden max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 sm:flex sm:w-[min(34vw,360px)]">
          <Search className="shrink-0 text-slate-400" size={17} />
          <input
            aria-label="Search JeevanSetu"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search patients, records..."
            type="search"
          />
          <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 md:block">
            ⌘ K
          </kbd>
        </div>
        <span className="truncate text-sm font-semibold text-ink sm:hidden">
          Overview
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
          type="button"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emergency" />
        </button>
        <div className="h-8 w-px bg-slate-200" />
        <div className="relative">
          <button
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-xl p-1.5 pr-0 sm:pr-1.5"
            onClick={() => setProfileOpen((open) => !open)}
            type="button"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {initials}
            </div>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-ink">{displayName}</span>
              <span className="block text-xs text-muted">{roleLabel}</span>
            </span>
            <ChevronDown className="hidden text-slate-400 sm:block" size={16} />
          </button>
          {profileOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-popover"
              role="menu"
            >
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-bold text-ink">{displayName}</p>
                <p className="mt-0.5 text-xs text-muted">{roleLabel} demo account</p>
              </div>
              <button
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
                role="menuitem"
                type="button"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
