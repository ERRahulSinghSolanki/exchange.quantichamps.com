import React, { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import axios from "axios";
import { API_URL } from "config";

const NotificationBadgeIcon = () => {
  const [count, setCount] = useState(0);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [audio] = useState(() => new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"));
  const userRole = localStorage.getItem("role")?.toLowerCase(); // e.g., 'admin', 'manager', 'team leader'

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchCount = async () => {
      try {
        const resEarly = await axios.get(`${API_URL}/admin/early-login-notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resLate = await axios.get(`${API_URL}/admin/late-login-notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newCount = resEarly.data.notifications.length + resLate.data.notifications.length || 0;
        setCount(newCount);

        if (newCount > 0) {
          if (userRole === "Admin") {
            // 🔊 Play only once for Admin
            if (!hasPlayedOnce) {
              audio.play().catch((e) => console.warn("Audio play error:", e));
              setHasPlayedOnce(true);
            }
          } else {
            // 🔁 Loop for non-admins
            if (audio.paused) {
              audio.loop = true;
              audio.play().catch((e) => console.warn("Audio play error:", e));
            }
          }
        } else {
          // 🛑 Stop sound for all if no notification
          audio.pause();
          audio.currentTime = 0;
          audio.loop = false;
          setHasPlayedOnce(false);
        }
      } catch (err) {
        console.warn("Badge fetch failed");
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000); // every 10 sec
    return () => clearInterval(interval);
  }, [audio, hasPlayedOnce, userRole]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Icon>notifications</Icon>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "4px 6px",
            fontSize: 10,
            animation: "pulse 1s infinite",
          }}
        >
          {count}
        </span>
      )}
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

export default NotificationBadgeIcon;
