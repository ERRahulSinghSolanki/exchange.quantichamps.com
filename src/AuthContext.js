import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_URL } from "config";

/* ─────────────────────────────────────────
   1.  CONTEXT SHAPE
   ───────────────────────────────────────── */
const AuthContext = createContext({
  isLoggedIn: false,
  isAuthReady: false,
  logout: () => {},            // 👈  renamed (was handleLogout)
  user: null,
  roles: [],
  permissions: [],
});

/* ─────────────────────────────────────────
   2.  PROVIDER
   ───────────────────────────────────────── */
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  /* ---------- Fetch current user ---------- */
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Missing token");

      const { data } = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data.user || {});
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setIsLoggedIn(true);

      /* Persist role / permissions for route‑filtering */
      if (data.roles?.length) {
        localStorage.setItem("role", data.roles[0]);
      }
      localStorage.setItem(
        "permissions",
        JSON.stringify(data.permissions || [])
      );
    } catch (err) {
      console.error("❌ Auth error:", err);
      /* Purge everything on failure */
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("permissions");
      setIsLoggedIn(false);
      setUser(null);
      setRoles([]);
      setPermissions([]);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  /* ---------- Run once on mount ---------- */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser();
    } else {
      setIsAuthReady(true);
    }
  }, [fetchUser]);

  /* ---------- Logout (only state + storage) ---------- */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    setIsLoggedIn(false);
    setUser(null);
    setRoles([]);
    setPermissions([]);
    /* No redirect here – leave navigation to the caller */
  }, []);

  /* ---------- Memo value ---------- */
  const value = useMemo(
    () => ({
      isLoggedIn,
      isAuthReady,
      logout,          // 👈  exposed to consumers
      user,
      roles,
      permissions,
    }),
    [isLoggedIn, isAuthReady, logout, user, roles, permissions]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* ─────────────────────────────────────────
   3.  HOOK
   ───────────────────────────────────────── */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
