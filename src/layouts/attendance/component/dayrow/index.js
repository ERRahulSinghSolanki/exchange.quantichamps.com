

import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import { Box, Card, Grid, Slide } from "@mui/material";
import "./dayrow.css";
import SliderPanel from "../slider";

const statusColorMap = {
  Present: "#4CAF50",
  Absent: "#f44336",
  Leave: "#ff9800",
  "On Duty": "#2196f3",
  Holiday: "#9e9e9e",
};

const calculateAutoCheckout = (shiftStart = "09:00", hoursWorked, isToday, checkOut) => {
  if (!isToday || checkOut !== "--") return null;


  const [startHour, startMin] = shiftStart.split(":").map(Number);
  const now = new Date();
  const shiftStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMin);

  const shiftEnd = new Date(shiftStartDate.getTime() + 9 * 60 * 60 * 1000); // +9 hours

  if (now < shiftEnd) {
    const remainingMs = shiftEnd - now;
    const hrsLeft = Math.floor(remainingMs / (1000 * 60 * 60));
    const minLeft = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return `Auto-checkout at ${shiftEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (in ${hrsLeft}h ${minLeft}m)`;
  }

  return "Shift over";
};

const DayRow = ({
  day,
  date,
  status,
  checkIn,
  checkOut,
  hoursWorked,
  comment,
  isToday,
}) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const isWeekend = day.startsWith("Sun") || day === "Sunday";
  const statusColor = isWeekend ? "#FFD700" : (statusColorMap[status] || "#bdbdbd");
  const finalComment = isWeekend ? "Weekend" : comment;

  const today = new Date();
  const currentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${date}`);
  const isFuture = currentDate > today;

  // Only show status bar for non-future days
  const shouldRenderStatusBar = !isFuture && (status || isWeekend);
  const autoCheckoutMessage = calculateAutoCheckout("09:00", hoursWorked, isToday, checkOut);


  // 🕓 Late/Early by calculation
  const shiftStartTime = "09:00";

  const handleClick = () => {
    if (status === "Present") {
      setIsSliderOpen(true); // Opens the slider
    }
  };

  const parseTimeToDate = (timeStr) => {
    if (!timeStr || timeStr === "--") return null;
    const now = new Date();
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  };

  const checkInDate = parseTimeToDate(checkIn);
  const shiftStartDate = parseTimeToDate(shiftStartTime + " AM");

  let timeDiffText = null;
  if (checkInDate && shiftStartDate) {
    const diffMs = checkInDate - shiftStartDate;
    const isLate = diffMs > 0;
    const diffMin = Math.abs(Math.floor(diffMs / 60000));
    const hrs = Math.floor(diffMin / 60).toString().padStart(2, "0");
    const mins = (diffMin % 60).toString().padStart(2, "0");

    if (diffMin > 0) {
      timeDiffText = `${isLate ? "Late" : "Early"} by ${hrs}:${mins}`;
    }
  }

  // Progress width for today if Present
  // const progressWidth =
  //   isToday && status === "Present" && checkInDate
  //     ? `${Math.min(
  //         ((new Date() - checkInDate) / (9 * 60 * 60 * 1000)) * 100,
  //         100
  //       ).toFixed(1)}%`
  //     : "100%";

  const getInitialProgress = () => {
    if (isToday && status === "Present" && checkInDate) {
      const diff = new Date() - checkInDate;
      return `${Math.min((diff / (9 * 60 * 60 * 1000)) * 100, 100).toFixed(1)}%`;
    }
    return "100%";
  };

  const [liveProgress, setLiveProgress] = useState(getInitialProgress());

  useEffect(() => {
    const updateProgress = () => {
      if (isToday && status === "Present" && checkInDate) {
        const now = new Date();
        const diff = now - checkInDate;
        const percent = Math.min((diff / (9 * 60 * 60 * 1000)) * 100, 100).toFixed(1);
        setLiveProgress(`${percent}%`);
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, [isToday, status, checkIn]);
  const progressWidth = isToday && status === "Present" ? liveProgress : "100%";

  // 💡 Line Label Text
  const lineLabel = isWeekend ? "Weekend" : status || "";
  // const dayLabel = isWeekend ? "Weekend" : day;

  return (
    <Card sx={{ padding: 2, marginBottom: 2, width: 1200, marginLeft: 1, position: 'relative' }}
      onClick={handleClick}>
      {/* Centered dotted line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 12,
        bottom: 12,
        width: 3,
        background: 'repeating-linear-gradient(to bottom, #2196f3, #2196f3 6px, transparent 6px, transparent 12px)',
        zIndex: 1,
        borderRadius: 2,
        transform: 'translateX(-50%)'
      }} />

      <Grid container alignItems="center">
        {/* Day and Date */}
        <Grid item xs={12} md={1}>
          <SoftTypography
            variant="button"
            fontWeight="bold"
            sx={{
              color: isToday ? "#fff" : "#000",
              backgroundColor: isToday ? "#1976d2" : "transparent",
              borderRadius: isToday ? "8px" : "0",
              padding: isToday ? "4px 8px" : "0",
              display: "inline-block",
              textAlign: "center",
              minWidth: "55px"
            }}
          >
            {day}
          </SoftTypography>
        </Grid>


        {/* Status Line + Comment */}
        <Grid item xs={12} md={8}>
          <SoftBox height="6px" borderRadius="xl" mb={1} bgColor="#e0e0e0" position="relative">
            {shouldRenderStatusBar && (
              <>
                <SoftBox
                  className={isToday && status === "Present" ? "animated-progress" : ""}
                  height="100%"
                  // width="100%"
                  borderRadius="xl"
                  sx={{
                    backgroundColor: statusColor,
                    width: liveProgress,
                    transition: "width 0.3s ease-in-out",
                  }}
                />

                <SoftTypography
                  variant="caption"
                  fontWeight="bold"
                  color="#000"
                  sx={{
                    position: "absolute",
                    top: "-18px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {lineLabel}
                </SoftTypography>
              </>
            )}
          </SoftBox>
        </Grid>


        {/* Check-in */}
        {!isWeekend && (
          <>
            <Grid item xs={6} md={1}>
              <SoftTypography variant="caption" color="success" fontWeight="medium">
                IN: {checkIn || "--"}
              </SoftTypography>
            </Grid>

            {/* Check-out */}

            <Grid item xs={6} md={1}>
              <SoftTypography variant="caption" color="error">
                OUT: {checkOut || "--"}
              </SoftTypography>
            </Grid>

            {/* Hours or Auto-checkout */}

            <Grid item xs={12} md={1}>
              <SoftTypography variant="caption" color="dark" fontWeight="medium">
                {autoCheckoutMessage || hoursWorked || "--"}
              </SoftTypography>
            </Grid>
          </>
        )}
      </Grid>
      
      {isSliderOpen && <SliderPanel />}

    </Card>

  );
};

DayRow.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  hoursWorked: PropTypes.string,
  comment: PropTypes.string,
  isToday: PropTypes.bool,
};

DayRow.defaultProps = {
  checkIn: "--",
  checkOut: "--",
  hoursWorked: "--",
  comment: "",
  isToday: false,
};

export default DayRow;
