// App.js
import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
// MUI
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
// Core Components
import SoftBox from "components/SoftBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
// Themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
// RTL
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// Routes
import { getRoutes } from "routes";
// Context
import {
  useSoftUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
// Logo
import brand from "assets/images/logo-ct.png";
// Auth
import { useAuth } from "./AuthContext";
// Idle tracker
import IdleTracker from "components/IdleTracker";
import { isUserLoggedIn } from "config";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, isAuthReady } = useAuth();

  /* ──────────────────────────────────────
     1.  ROLES  ⟶ अगर दूसरी जगह काम आते हैं तो रहने दें
     ────────────────────────────────────── */
  const rawRole = localStorage.getItem("role");
  const userRoles = useMemo(() => {
    if (!rawRole) return [];
    return rawRole.startsWith("[") ? JSON.parse(rawRole) : [rawRole];
  }, [rawRole]);

  /* ──────────────────────────────────────
     2.  PERMISSIONS  ⟶ ROUTE FILTERING के लिए
     ────────────────────────────────────── */
  const rawPerms = localStorage.getItem("permissions"); // e.g. '["viewDashboard", …]'
  const userPermissions = useMemo(() => {
    if (!rawPerms) return [];
    try {
      return JSON.parse(rawPerms);
    } catch {
      // fallback: comma‑separated string
      return rawPerms.split(",").map((p) => p.trim());
    }
  }, [rawPerms]);

  /* 3.  FILTER ROUTES BY PERMISSIONS */
  const filteredRoutes = useMemo(
    () => getRoutes(userPermissions),
    [userPermissions]
  );

  /* RTL cache only once */
  useEffect(() => {
    const cache = createCache({ key: "rtl", stylisPlugins: [rtlPlugin] });
    setRtlCache(cache);
  }, []);

  /* set dir attr whenever direction changes */
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  /* scroll to top on route change */
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location.pathname]);

  /* ──────────────────────────────────────
     4.  AUTH / REDIRECT HANDLING
     ────────────────────────────────────── */
  useEffect(() => {
    if (!isAuthReady) return;

    const isAuthPage = location.pathname.startsWith("/authentication");
    const isRoot = location.pathname === "/";

    // Not logged in ➜ kick to sign‑in
    if (!isLoggedIn && !isAuthPage) {
      navigate("/authentication/sign-in/illustration", { replace: true });
      return;
    }

    // Logged in but sitting on auth / root ➜ send to dashboard
    if (isLoggedIn && (isAuthPage || isRoot)) {
      navigate("/dashboards/default", { replace: true });
    }
  }, [isAuthReady, isLoggedIn, location.pathname, navigate]);

  /* ──────────────────────────────────────
     UI EVENT HANDLERS
     ────────────────────────────────────── */
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  /* ──────────────────────────────────────
     RENDER ROUTES RECURSIVELY
     ────────────────────────────────────── */
  const renderRoutes = (routesList) =>
    routesList.flatMap((route, idx) => {
      if (route.collapse) return renderRoutes(route.collapse);
      if (route.route && route.component) {
        return (
          <Route
            key={route.key || `route-${idx}`}
            path={route.route}
            element={route.component}
          />
        );
      }
      return [];
    });

  /* Config floating button */
  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  /* Wait until auth context is ready */
  if (!isAuthReady) return null;

  /* Extra guard: unauthenticated user anywhere else */
  if (!isLoggedIn && location.pathname !== "/authentication/sign-in/illustration") {
    return <Navigate to="/authentication/sign-in/illustration" replace />;
  }

  /* ──────────────────────────────────────
     MAIN LAYOUT
     ────────────────────────────────────── */
  const appLayout = (
    <>
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brand}
            brandName="Quantichamps Exchange"
            routes={filteredRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}

      {layout === "vr" && <Configurator />}

      <Routes>
        {renderRoutes(filteredRoutes)}
        {/* Unknown route fallback */}
        <Route
          path="*"
          element={<Navigate to="/dashboards/default" replace />}
        />
      </Routes>
    </>
  );

  /* Debug logs (remove in prod) */
  console.log("📦 Filtered routes:", filteredRoutes.map((r) => r.route || r.name));
  console.log("🔑 Permissions in LS:", userPermissions);

  /* ──────────────────────────────────────
     THEME WRAP
     ────────────────────────────────────── */
  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {isUserLoggedIn() && <IdleTracker />}
        {appLayout}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isUserLoggedIn() && <IdleTracker />}
      {appLayout}
    </ThemeProvider>
  );
}
