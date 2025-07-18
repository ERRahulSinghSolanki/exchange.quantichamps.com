import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// MUI
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import axios from "axios";

// Core / theme helpers
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { API_URL } from "config";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Media
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

// Auth + Break handling
import { useAuth } from "AuthContext";
import useBreakManager from "context/BreakContext";
import BreakModal from "layouts/break/BreakModal";

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  /* ──────────────────────────────────────
     LOCAL STATE
     ────────────────────────────────────── */
  const [navbarType, setNavbarType] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [shiftEndTime, setShiftEndTime] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  /* ──────────────────────────────────────
     GLOBAL CONTEXTS
     ────────────────────────────────────── */
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;

  const { isLoggedIn, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const route = location.pathname.split("/").slice(1);

  /* ──────────────────────────────────────
     BREAK CONTEXT
     ────────────────────────────────────── */
  const {
    onBreak,
    timer,
    setTimer,
    setOnBreak,
    startBreak,
    endBreak,
    initialBreakDuration,
    checkActiveBreak,
  } = useBreakManager();

  /* ──────────────────────────────────────
     EFFECTS
     ────────────────────────────────────── */
  // navbar transparency & type
  useEffect(() => {
    setNavbarType(fixedNavbar ? "sticky" : "static");
    const handleTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // check if a break is already running (on page refresh)
  useEffect(() => {
    checkActiveBreak();
  }, []);

  // Get user name and shift end time from localStorage
  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUserName(name);
    }
    
    const fetchShiftEndTime = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const { data } = await axios.get(`${API_URL}/user/shift-end-time`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setShiftEndTime(new Date(data.shift_end_time));
        }
      } catch (err) {
        console.error("Failed to fetch shift end time", err);
      }
    };
    
    fetchShiftEndTime();
  }, []);

  // Auto logout 15 minutes after shift end time for normal users
  useEffect(() => {
    if (!shiftEndTime || ["Admin", "Manager"].includes(localStorage.getItem("role") || !isLoggedIn)) {
      return;
    }

    const checkAutoLogout = () => {
      const now = new Date();
      const shiftEndPlus15 = new Date(shiftEndTime.getTime() + 15 * 60000); // 15 minutes after shift end

      if (now > shiftEndPlus15) {
        // Time to auto logout
        handleAutoLogout();
      } else {
        // Set timer for remaining time
        const remainingTime = shiftEndPlus15 - now;
        const timer = setTimeout(() => {
          handleAutoLogout();
        }, remainingTime);
        setLogoutTimer(timer);
      }
    };

    checkAutoLogout();

    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [shiftEndTime, isLoggedIn]);

  /* ──────────────────────────────────────
     UI HANDLERS
     ────────────────────────────────────── */
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfigurator = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (e) => setOpenMenu(e.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  /* Break start / end */
  const handleStartBreak = async () => {
    setLoading(true);
    try {
      await startBreak();
    } catch (err) {
      console.error("❌ Break start failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndBreak = async (elapsedSeconds) => {
    try {
      await endBreak(elapsedSeconds);
      setOnBreak(false);
      setTimer(0);
    } catch (err) {
      console.error("❌ Failed to end break", err);
    }
  };

  /* ──────────────────────────────────────
     AUTO LOGOUT HANDLER
     ────────────────────────────────────── */
  const handleAutoLogout = async () => {
    try {
      await authLogout();
      navigate("/authentication/sign-in/illustration", { replace: true });
    } catch (err) {
      console.error("Auto logout failed", err);
    }
  };

  /* ──────────────────────────────────────
     LOGOUT LOGIC
     ────────────────────────────────────── */
  const userRole = localStorage.getItem("role") || "";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${API_URL}/user/shift-end-time`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const shiftEnd = new Date(data.shift_end_time);
      const now = new Date();
      const isAdminManager = ["Admin", "Manager"].includes(userRole);

      /* ── 1. Admin / Manager  ─────────────────────────── */
      if (isAdminManager) {
        await authLogout();
        navigate("/authentication/sign-in/illustration", { replace: true });
        return;
      }

      /* ── 2. Normal user still within shift → auto break */
      if (now < shiftEnd) {
        await handleStartBreak();
        return;
      }

      /* ── 3. Normal user after shift end  ─────────────── */
      await authLogout();
      navigate("/authentication/sign-in/illustration", { replace: true });
    } catch (err) {
      console.error("Logout condition check failed", err);
      await authLogout();
      navigate("/authentication/sign-in/illustration", { replace: true });
    } finally {
      setLogoutLoading(false);
    }
  };

  /* ──────────────────────────────────────
     NOTIFICATION DROPDOWN
     ────────────────────────────────────── */
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="logo" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={<Icon fontSize="small">payment</Icon>}
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  /* ──────────────────────────────────────
     RENDER
     ────────────────────────────────────── */
  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        {/* Left side: breadcrumbs + menu collapse */}
        <SoftBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route}
            light={light}
          />
          <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav}>
            {miniSidenav ? "menu_open" : "menu"}
          </Icon>
        </SoftBox>

        {/* Right side: buttons */}
        {!isMini && (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox color={light ? "white" : "inherit"}>
              {isLoggedIn ? (
                <>
                  {/* Welcome message */}
                  {userName && (
                    <SoftTypography
                      variant="button"
                      fontWeight="medium"
                      color={light ? "white" : "dark"}
                      sx={{ mr: 2, display: "inline-block" }}
                    >
                      Welcome - {userName}
                    </SoftTypography>
                  )}

                  {/* Start Break button for non‑admin/non‑manager */}
                  {!["Admin", "Manager"].includes(userRole) && !onBreak && (
                    <IconButton
                      sx={{ ...navbarIconButton, mr: 1 }}
                      size="small"
                      onClick={handleStartBreak}
                      disabled={loading}
                    >
                      <Icon sx={{ color: light ? "#fff" : "#1e293b" }}>
                        {loading ? "hourglass_top" : "pause_circle"}
                      </Icon>
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        color={light ? "white" : "dark"}
                        ml={0.5}
                      >
                        {loading ? "Starting..." : "Start Break"}
                      </SoftTypography>
                    </IconButton>
                  )}

                  {/* Logout */}
                  <IconButton
                    sx={navbarIconButton}
                    size="small"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    <Icon sx={{ color: light ? "#fff" : "#1e293b" }}>
                      {logoutLoading ? "hourglass_top" : "logout"}
                    </Icon>
                    <SoftTypography
                      variant="button"
                      fontWeight="medium"
                      color={light ? "white" : "dark"}
                      ml={0.5}
                    >
                      {logoutLoading ? "Logging out..." : "Logout"}
                    </SoftTypography>
                  </IconButton>
                </>
              ) : (
                <Link to="/authentication/sign-in/illustration">
                  <IconButton sx={navbarIconButton} size="small">
                    <Icon sx={{ color: light ? "#fff" : "#1e293b" }}>account_circle</Icon>
                    <SoftTypography
                      variant="button"
                      fontWeight="medium"
                      color={light ? "white" : "dark"}
                      ml={0.5}
                    >
                      Sign in
                    </SoftTypography>
                  </IconButton>
                </Link>
              )}

              {/* Configurator / notifications / mobile menu */}
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfigurator}
              >
                <Icon>settings</Icon>
              </IconButton>

              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
              </IconButton>

              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>

      {/* Break Timer Modal */}
      <BreakModal
        open={onBreak}
        timer={timer}
        initialBreakDuration={initialBreakDuration}
        onEndBreak={handleEndBreak}
      />
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;