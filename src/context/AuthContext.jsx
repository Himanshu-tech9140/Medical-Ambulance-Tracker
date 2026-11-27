import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEMO_CREDENTIALS,
  DEMO_SESSION_STORAGE_KEY,
  REMEMBERED_USERNAME_STORAGE_KEY,
} from "../config/demoAuth.js";

const AuthContext = createContext(null);
const validRoles = Object.keys(DEMO_CREDENTIALS);

function readDemoSession() {
  const savedSession = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);
  if (!savedSession) return null;

  let session;
  try {
    session = JSON.parse(savedSession);
  } catch {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    return null;
  }

  const hasValidRole = session && validRoles.includes(session.role);
  const hasValidUsername =
    hasValidRole &&
    DEMO_CREDENTIALS[session.role].username === session.username;

  if (!hasValidUsername) {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    return null;
  }

  return {
    role: session.role,
    username: session.username,
    authenticatedAt: session.authenticatedAt,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readDemoSession);

  useEffect(() => {
    function syncSession(event) {
      if (
        event.key === DEMO_SESSION_STORAGE_KEY ||
        event.key === null
      ) {
        setUser(readDemoSession());
      }
    }

    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  function login(username, password, role, rememberMe) {
    const credentials = DEMO_CREDENTIALS[role];
    if (
      !credentials ||
      credentials.username !== username.trim() ||
      credentials.password !== password
    ) {
      return { success: false, reason: "invalid_credentials" };
    }

    const session = {
      username: credentials.username,
      role: credentials.role,
      authenticatedAt: new Date().toISOString(),
    };

    try {
      if (rememberMe) {
        window.localStorage.setItem(
          REMEMBERED_USERNAME_STORAGE_KEY,
          credentials.username,
        );
      } else {
        window.localStorage.removeItem(REMEMBERED_USERNAME_STORAGE_KEY);
      }

      window.localStorage.setItem(
        DEMO_SESSION_STORAGE_KEY,
        JSON.stringify(session),
      );
    } catch {
      return { success: false, reason: "storage_unavailable" };
    }

    setUser(session);
    return { success: true, user: session };
  }

  function logout() {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
