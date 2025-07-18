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
  logout: () => {},
  login: () => {},
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

  /* ---------- Login function ---------- */
  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      
      // Store user details
      setUser(user);
      if (user?.name) {
        localStorage.setItem("name", user.name);
      }
      
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  /* ---------- Fetch current user ---------- */
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Missing token");

      const { data } = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state
      setUser(data.user || {});
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setIsLoggedIn(true);

      // Store user name if available
      if (data.user?.name) {
        localStorage.setItem("name", data.user.name);
      }

      /* Persist role / permissions */
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
      logout();
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

  /* ---------- Logout (clears all data) ---------- */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("name"); // Clear user name
    setIsLoggedIn(false);
    setUser(null);
    setRoles([]);
    setPermissions([]);
  }, []);

  /* ---------- Memoized context value ---------- */
  const value = useMemo(
    () => ({
      isLoggedIn,
      isAuthReady,
      logout,
      login,
      user,
      roles,
      permissions,
    }),
    [isLoggedIn, isAuthReady, logout, login, user, roles, permissions]
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