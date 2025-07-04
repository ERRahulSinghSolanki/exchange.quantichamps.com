import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "config";

const IDLE_TIMEOUT = 3 * 60 * 1000; // 3 minute

const IdleTracker = () => {
  const timeoutRef = useRef(null);
  const [wasIdle, setWasIdle] = useState(false);

  const getToken = () => localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  const sendStatus = async (status) => {
    const token = getToken();
    if (!token) {
      console.warn("🔐 No token found. Skipping status send.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/idle-log`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log(`✅ [API SUCCESS] Status '${status}' sent.`, res.data);
    } catch (err) {
      console.error(`❌ [API ERROR] Status '${status}' failed:`, err.response?.data || err.message);
    }
  };

  const checkIfOnBreak = async () => {
    const token = getToken();
    if (!token) {
      console.warn("🔐 No token while checking break.");
      return false;
    }

    try {
      const res = await axios.get(`${API_URL}/attendance/check-active-break`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      console.log("🔄 Break status check:", res.data);
      return res.data.active === true;
    } catch (err) {
      console.error("❌ [Break Check Error]:", err.response?.data || err.message);
      return false;
    }
  };

  const handleIdle = async () => {
    console.log("🕒 handleIdle() triggered");

    if (!["User", "Team Leader"].includes(role)) {
      console.log("🚫 Not a tracked role:", role);
      return;
    }

    const isOnBreak = await checkIfOnBreak();
    if (isOnBreak) {
      console.log("☕ User is on break, skipping idle log.");
      return;
    }

    if (!wasIdle) {
      console.log("⏱️ User is idle now.");
      setWasIdle(true);
      await sendStatus("idle");
    } else {
      console.log("⚠️ Already marked idle. No action.");
    }
  };

  const handleActivity = async () => {
    // console.log("👀 Activity detected");
    if (!["User", "Team Leader"].includes(role)) return;

    if (wasIdle) {
      console.log("⚡ User became active after idle.");
      setWasIdle(false);
      await sendStatus("active");
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleIdle, IDLE_TIMEOUT);
  };

  useEffect(() => {
    console.log("📡 Idle tracker mounted");
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    timeoutRef.current = setTimeout(handleIdle, IDLE_TIMEOUT);

    return () => {
      console.log("🧹 Cleaning up IdleTracker");
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimeout(timeoutRef.current);
    };
  }, [wasIdle]);

  return null;
};

export default IdleTracker;
