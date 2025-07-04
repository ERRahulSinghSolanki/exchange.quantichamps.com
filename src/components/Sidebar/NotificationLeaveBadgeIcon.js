import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import { API_URL } from "config";

const NotificationLeaveBadgeIcon = () => {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [audio] = useState(() => new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"));
  const location = useLocation();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user role from localStorage or wherever it's stored
    const role = localStorage.getItem("userRole") || "";
    setUserRole(role);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/notifications/leave`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      const unreadCount = Array.isArray(data.notifications)
        ? data.notifications.filter((n) => !n.read_at).length
        : 0;

      // Play sound based on conditions
      if (unreadCount > prevCount) {
        if (userRole === "Admin") {
          // For Admin, play only once when new notification arrives
          if (unreadCount > count) {
            audio.play().catch((e) => console.warn("Sound play failed:", e));
          }
        } else {
          // For other roles, play every time there's a notification
          audio.play().catch((e) => console.warn("Sound play failed:", e));
        }
      }

      setPrevCount(count);
      setCount(unreadCount);
    } catch (err) {
      console.error("Leave notification fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Repeat every 10 sec
    return () => clearInterval(interval);
  }, [location.pathname, count, prevCount, userRole]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <IconButton color="inherit">
        <NotificationsIcon />
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: 10,
              animation: "pulse 1s infinite",
              zIndex: 10,
            }}
          >
            {count}
          </span>
        )}
      </IconButton>

      <style>
        {`@keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }`}
      </style>
    </div>
  );
};

export default NotificationLeaveBadgeIcon;