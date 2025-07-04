import React, { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import axios from "axios";
import { API_URL } from "config";

const NotificationBadgeIcon = () => {
  const [count, setCount] = useState(0);
  const [audio] = useState(() => new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Fetch both early and late login notifications
    const fetchCount = async () => {
      try {
        const resEarly = await axios.get(`${API_URL}/manager/early-login-notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const resLate = await axios.get(`${API_URL}/manager/late-login-notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Combine both counts
        const newCount = resEarly.data.notifications.length + resLate.data.notifications.length || 0;

        if (newCount > 0) {
          audio.play().catch((e) => console.warn("Audio play error:", e));
        }

        setCount(newCount);
      } catch (err) {
        console.warn("Badge fetch failed");
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000); // Re-fetch every 10 seconds
    return () => clearInterval(interval);
  }, [audio]);

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
