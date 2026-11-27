import {
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import {
  getRoleDashboardPath,
  REMEMBERED_USERNAME_STORAGE_KEY,
} from "../config/demoAuth.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState(() =>
    window.localStorage.getItem(REMEMBERED_USERNAME_STORAGE_KEY) || "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(username));
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [storageError, setStorageError] = useState("");

  if (user) {
    return <Navigate replace to={getRoleDashboardPath(user.role)} />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setStorageError("");

    const errors = {};
    if (!username.trim()) errors.username = "Enter your username.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = login(username, password, role, rememberMe);
    if (!result.success) {
      if (result.reason === "storage_unavailable") {
        setStorageError(
          "JeevanSetu could not save this demo session. Check browser storage settings and try again.",
        );
      } else {
        setAuthError("The username, password, or selected role is incorrect.");
      }
      return;
    }

    navigate(getRoleDashboardPath(result.user.role), { replace: true });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf7ff] via-white to-[#f5faff] px-4 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-100/60 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[440px] w-[440px] rounded-full bg-cyan-100/50 blur-[90px]" />
      <div className="relative w-full max-w-[460px]">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand-700"
          to="/"
        >
          <ArrowLeft size={16} /> Back to JeevanSetu
        </Link>
        <Card className="rounded-3xl border-white/80 p-6 shadow-[0_24px_70px_rgba(27,78,132,0.12)] sm:p-9">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
              <Activity size={23} />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-ink">
              Jeevan<span className="text-brand-600">Setu</span>
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
            Your care workspace
          </p>
          <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Sign in to continue to your JeevanSetu dashboard.
          </p>
          <form
            className="mt-7 space-y-5"
            noValidate
            onSubmit={handleSubmit}
          >
            <fieldset>
              <legend className="mb-2.5 text-sm font-semibold text-slate-700">
                Choose your account type
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "admin",
                    label: "Admin",
                    description: "Manage the care network",
                  },
                  {
                    value: "student",
                    label: "Student",
                    description: "Access your care details",
                  },
                ].map((option) => (
                  <label
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3.5 transition ${
                      role === option.value
                        ? "border-brand-300 bg-brand-50/80 ring-2 ring-brand-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    } focus-within:ring-2 focus-within:ring-brand-300`}
                    key={option.value}
                  >
                    <input
                      checked={role === option.value}
                      className="sr-only"
                      name="role"
                      onChange={() => {
                        setRole(option.value);
                        setAuthError("");
                      }}
                      type="radio"
                      value={option.value}
                    />
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        role === option.value
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {option.value === "admin" ? (
                        <ShieldCheck size={17} />
                      ) : (
                        <UserRound size={17} />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink">{option.label}</span>
                      <span className="mt-0.5 block text-[10px] leading-4 text-muted">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Input
              autoComplete="username"
              error={fieldErrors.username}
              label="Username"
              leadingIcon={UserRound}
              name="username"
              onChange={(event) => {
                setUsername(event.target.value);
                setFieldErrors((current) => ({ ...current, username: "" }));
                setAuthError("");
              }}
              placeholder="Enter your username"
              value={username}
            />

            <div className="relative">
              <Input
                autoComplete="current-password"
                className="pr-12"
                error={fieldErrors.password}
                label="Password"
                leadingIcon={LockKeyhole}
                name="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((current) => ({ ...current, password: "" }));
                  setAuthError("");
                }}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-[34px] rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input
                checked={rememberMe}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-brand-500"
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              Remember my username on this device
            </label>

            {authError && (
              <p
                aria-live="polite"
                className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
                role="alert"
              >
                {authError}
              </p>
            )}
            {storageError && (
              <p
                aria-live="polite"
                className="rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3 text-sm font-medium text-amber-800"
                role="alert"
              >
                {storageError}
              </p>
            )}

            <Button className="min-h-12 w-full rounded-xl" type="submit">
              <LockKeyhole size={16} /> Sign in
            </Button>
          </form>
          <p className="mt-5 rounded-xl bg-amber-50 px-3.5 py-3 text-center text-[11px] leading-5 text-amber-900">
            Demo authentication only. The session is stored in this browser&apos;s
            localStorage and is not production security.
          </p>
        </Card>
        <p className="mt-5 text-center text-xs text-slate-400">
          Need help signing in?{" "}
          <a
            className="font-semibold text-brand-700 hover:text-brand-800"
            href="mailto:support@jeevansetu.example"
          >
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
