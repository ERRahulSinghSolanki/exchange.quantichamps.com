// src/context/BreakContext.js

import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_URL } from "config";

// ✅ Create Context
export const BreakContext = createContext();

// ✅ Provider
export const BreakProvider = ({ children }) => {
  const [onBreak, setOnBreak] = useState(false);
  const [timer, setTimer] = useState(0); // seconds since break started
  const [initialBreakDuration, setInitialBreakDuration] = useState(0); // total allowed in seconds
  const [remainingMinutes, setRemainingMinutes] = useState(0); // from backend
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  // ✅ Check Active Break
  const checkActiveBreak = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/attendance/check-active-break`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.active && res.data.break_start) {
        const breakStart = new Date(res.data.break_start);
        const now = new Date();
        const elapsed = Math.floor((now - breakStart) / 1000); // in seconds
        const backendRemainingSeconds = Math.floor((res.data.remaining_break || 15) * 60);
        const totalAllowed = elapsed + backendRemainingSeconds;

        setTimer(elapsed);
        setInitialBreakDuration(totalAllowed);
        setRemainingMinutes(res.data.remaining_break || 15);
        setOnBreak(true);
      }
    } catch (err) {
      console.error("❌ checkActiveBreak failed:", err);
    }
  };

  // ✅ Start Break
  const startBreak = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/attendance/start-break`,
        { type: "short" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.message === "Break started") {
        const backendMinutes = res.data.remaining_break || 15;
        const totalSeconds = backendMinutes * 60;

        setOnBreak(true);
        setTimer(0);
        setInitialBreakDuration(totalSeconds);
        setRemainingMinutes(backendMinutes);
      }

      return res;
    } catch (err) {
      console.error("❌ startBreak failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ End Break
  const endBreak = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/attendance/end-break`,
        { used_seconds: timer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message?.includes("Break ended")) {
        setOnBreak(false);
        setTimer(0);
        setInitialBreakDuration(0);
        setRemainingMinutes(0);
      }

      return res;
    } catch (err) {
      console.error("❌ endBreak failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Auto-increment timer
  useEffect(() => {
    let interval = null;
    if (onBreak) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [onBreak]);

  // 🔄 On App Mount
  useEffect(() => {
    checkActiveBreak();
  }, []);

  return (
    <BreakContext.Provider
      value={{
        onBreak,
        timer,
        startBreak,
        endBreak,
        loading,
        remainingMinutes,
        initialBreakDuration,
        setTimer,
        setOnBreak,
        checkActiveBreak,
      }}
    >
      {children}
    </BreakContext.Provider>
  );
};

BreakProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ Custom Hook
export const useBreakManager = () => {
  const context = useContext(BreakContext);
  if (!context) {
    throw new Error("useBreakManager must be used within a BreakProvider");
  }
  return context;
};

export default useBreakManager;
