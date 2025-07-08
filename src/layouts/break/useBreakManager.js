// src/context/BreakContext.js
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_URL } from "config";

export const BreakContext = createContext();

export const BreakProvider = ({ children }) => {
  const [onBreak, setOnBreak] = useState(false);
  const [timer, setTimer] = useState(0);
  const [initialBreakDuration, setInitialBreakDuration] = useState(0); // in seconds
  const [remainingMinutes, setRemainingMinutes] = useState(0); // for UI display

  // ✅ Start Break
  const startBreak = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_URL}/attendance/start-break`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.message === "Break started") {
        const remainingBreakMinutes = res.data.remaining_break || 15;
        const durationSeconds = Math.floor(remainingBreakMinutes * 60);

        setTimer(0); // start from 0
        setInitialBreakDuration(durationSeconds); // save total break time
        setRemainingMinutes(remainingBreakMinutes); // for UI display
        setOnBreak(true);
      }

      return res.data;
    } catch (err) {
      console.error("❌ Break start error:", err);
      throw err;
    }
  };

  // ✅ End Break
  const endBreak = async (elapsedSeconds) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_URL}/attendance/end-break`,
        { used_seconds: elapsedSeconds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOnBreak(false);
      setTimer(0);
      return res.data;
    } catch (err) {
      console.error("❌ Break end error:", err);
      throw err;
    }
  };

  // ✅ Check Active Break on reload
  const checkActiveBreak = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/attendance/check-active-break`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.active && res.data.break_start) {
        const breakStart = new Date(res.data.break_start);
        const now = new Date();
        const elapsed = Math.floor((now - breakStart) / 1000);

        const totalSeconds = Math.floor(res.data.remaining_break * 60);

        setTimer(elapsed);
        setInitialBreakDuration(totalSeconds);
        setRemainingMinutes(res.data.remaining_break);
        setOnBreak(true);
      }
    } catch (err) {
      console.error("❌ Failed to check active break:", err);
    }
  };

  // ⏱ Increment timer every second if on break
  useEffect(() => {
    let interval;
    if (onBreak) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [onBreak]);

  useEffect(() => {
    checkActiveBreak();
  }, []);

  return (
    <BreakContext.Provider
      value={{
        onBreak,
        timer,
        setTimer,
        setOnBreak,
        startBreak,
        endBreak,
        remainingMinutes,
        initialBreakDuration,
      }}
    >
      {children}
    </BreakContext.Provider>
  );
};

BreakProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useBreakManager = () => {
  const context = useContext(BreakContext);
  if (!context) {
    throw new Error("useBreakManager must be used within a BreakProvider");
  }
  return context;
};

export default useBreakManager;
