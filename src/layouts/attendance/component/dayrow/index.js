// import React from "react";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import PropTypes from "prop-types";
// import { Card, Grid } from "@mui/material";
// import "./dayrow.css";

// const statusColorMap = {
//   Present: "#4CAF50",
//   Absent: "#f44336",
//   Leave: "#ff9800",
//   "On Duty": "#2196f3",
//   Holiday: "#9e9e9e",
// };

// const DayRow = ({
//   day,
//   date,
//   status,
//   checkIn,
//   checkOut,
//   hoursWorked,
//   comment
// }) => {
//   const statusColor = statusColorMap[status] || "#bdbdbd";

//   return (
//     <Card sx={{ padding: 2, marginBottom: 2, width:1100, marginLeft: 8, position: 'relative' }}>
//       {/* Dotted blue vertical line centered */}
//       <div style={{
//         position: 'absolute',
//         left: '50%',
//         top: 12,
//         bottom: 12,
//         width: 3,
//         background: 'repeating-linear-gradient(to bottom, #2196f3, #2196f3 6px, transparent 6px, transparent 12px)',
//         zIndex: 1,
//         borderRadius: 2,
//         transform: 'translateX(-50%)'
//       }} />
//       <Grid container alignItems="center">
//         {/* Day and Date */}
//         <Grid item xs={12} md={1}>
//           <SoftTypography variant="button" fontWeight="bold">
//             {day} {date}
//           </SoftTypography>
//         </Grid>

//         {/* Status Timeline (colored line) */}
//         <Grid item xs={12} md={8}>
//           <SoftBox height="6px" borderRadius="xl" mb={1} bgColor="#e0e0e0">
//             <SoftBox
//               height="100%"
//               width="100%"
//               borderRadius="xl"
//               sx={{ backgroundColor: statusColor }}
//             />
//           </SoftBox>
//           <SoftTypography variant="caption" color="text" fontWeight="regular">
//             {comment}
//           </SoftTypography>
//         </Grid>

//         {/* Check-in */}
//         <Grid item xs={6} md={1}>
//           <SoftTypography variant="caption" color="success">
//             IN: {checkIn || "--"}
//           </SoftTypography>
//         </Grid>

//         {/* Check-out */}
//         <Grid item xs={6} md={1}>
//           <SoftTypography variant="caption" color="error">
//             OUT: {checkOut || "--"}
//           </SoftTypography>
//         </Grid>

//         {/* Total Hours */}
//         <Grid item xs={12} md={1}>
//           <SoftTypography variant="caption" color="dark" fontWeight="medium">
//             {hoursWorked || "--"}
//           </SoftTypography>
//         </Grid>
//       </Grid>
//     </Card>
//   );
// };

// DayRow.propTypes = {
//   day: PropTypes.string.isRequired,
//   date: PropTypes.string.isRequired,
//   status: PropTypes.string.isRequired,
//   checkIn: PropTypes.string,
//   checkOut: PropTypes.string,
//   hoursWorked: PropTypes.string,
//   comment: PropTypes.string
// };

// DayRow.defaultProps = {
//   checkIn: "--",
//   checkOut: "--",
//   hoursWorked: "--",
//   comment: ""
// };

// export default DayRow;


import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import { Card, Grid } from "@mui/material";
import "./dayrow.css";

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
  const statusColor = statusColorMap[status] || "#bdbdbd";
  const autoCheckoutMessage = calculateAutoCheckout("09:00", hoursWorked, isToday, checkOut);

  return (
    <Card sx={{ padding: 2, marginBottom: 2, width: 1100, marginLeft: 8, position: 'relative' }}>
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
          <SoftTypography variant="button" fontWeight="bold">
            {day} {date}
          </SoftTypography>
        </Grid>

        {/* Status Line + Comment */}
        <Grid item xs={12} md={8}>
          <SoftBox height="6px" borderRadius="xl" mb={1} bgColor="#e0e0e0">
            <SoftBox
              height="100%"
              width="100%"
              borderRadius="xl"
              sx={{ backgroundColor: statusColor }}
            />
          </SoftBox>
          <SoftTypography variant="caption" color="text" fontWeight="regular">
            {comment}
          </SoftTypography>
        </Grid>

        {/* Check-in */}
        <Grid item xs={6} md={1}>
          <SoftTypography variant="caption" color="success">
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
      </Grid>
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

// import React from "react";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import PropTypes from "prop-types";
// import { Card, Grid } from "@mui/material";
// import "./dayrow.css";

// const statusColorMap = {
//   Present: "#4CAF50",
//   Absent: "#f44336",
//   Leave: "#ff9800",
//   "On Duty": "#2196f3",
//   Holiday: "#9e9e9e",
// };

// // Utility to determine if row is for today
// const isToday = (day, date) => {
//   const now = new Date();
//   const todayDay = now.toLocaleDateString("en-US", { weekday: "short" });
//   const todayDate = now.getDate().toString();
//   return day === todayDay && date === todayDate;
// };

// const calculateTimingMessage = (checkIn, shiftStart = "09:00", graceMinutes = 10) => {
//   if (!checkIn || checkIn === "--") return "";

//   const [shiftH, shiftM] = shiftStart.split(":").map(Number);
//   const shiftTime = new Date();
//   shiftTime.setHours(shiftH, shiftM + graceMinutes, 0, 0);

//   const [inH, inM] = checkIn.split(":").map(Number);
//   const inTime = new Date();
//   inTime.setHours(inH, inM, 0, 0);

//   const diff = Math.floor((inTime - shiftTime) / 60000);
//   if (diff > 0) {
//     return `Late by ${String(Math.floor(diff / 60)).padStart(2, "0")}:${String(diff % 60).padStart(2, "0")}`;
//   } else if (diff < -graceMinutes) {
//     const early = Math.abs(diff);
//     return `Early by ${String(Math.floor(early / 60)).padStart(2, "0")}:${String(early % 60).padStart(2, "0")}`;
//   } else {
//     return "On Time";
//   }
// };

// const calculateAutoCheckout = (checkOut, shiftEnd = "18:00") => {
//   if (checkOut && checkOut !== "--") return null;

//   const [endH, endM] = shiftEnd.split(":").map(Number);
//   const now = new Date();
//   const endTime = new Date();
//   endTime.setHours(endH, endM, 0, 0);

//   const diff = Math.floor((endTime - now) / 60000);
//   if (diff <= 0) return `Auto-checkout time passed (${shiftEnd})`;

//   const hrs = Math.floor(diff / 60);
//   const mins = diff % 60;
//   return `Auto-checkout at ${shiftEnd} (in ${hrs}h ${mins}m)`;
// };

// const DayRow = ({
//   day,
//   date,
//   status,
//   checkIn,
//   checkOut,
//   hoursWorked,
//   comment,
//   shiftStart = "09:00",
//   shiftEnd = "18:00",
//   graceMinutes = 10,
// }) => {
//   const today = isToday(day, date);
//   const timingMsg = today ? calculateTimingMessage(checkIn, shiftStart, graceMinutes) : comment;
//   const autoCheckoutMsg = today ? calculateAutoCheckout(checkOut, shiftEnd) : null;
//   const statusColor = statusColorMap[status] || "#bdbdbd";

//   return (
//     <Card sx={{ padding: 2, marginBottom: 2, width: 1100, marginLeft: 8, position: 'relative' }}>
//       {/* Center dotted line */}
//       <div style={{
//         position: 'absolute',
//         left: '50%',
//         top: 12,
//         bottom: 12,
//         width: 3,
//         background: 'repeating-linear-gradient(to bottom, #2196f3, #2196f3 6px, transparent 6px, transparent 12px)',
//         zIndex: 1,
//         borderRadius: 2,
//         transform: 'translateX(-50%)'
//       }} />

//       <Grid container alignItems="center">
//         {/* Day and Date */}
//         <Grid item xs={12} md={1}>
//           <SoftTypography variant="button" fontWeight="bold">
//             {today ? "Today" : `${day} ${date}`}
//           </SoftTypography>
//         </Grid>

//         {/* Status Line + Comment */}
//         <Grid item xs={12} md={8}>
//           <SoftBox height="6px" borderRadius="xl" mb={1} bgColor="#e0e0e0">
//             <SoftBox
//               height="100%"
//               width="100%"
//               borderRadius="xl"
//               sx={{ backgroundColor: statusColor }}
//             />
//           </SoftBox>
//           <SoftTypography variant="caption" color="text" fontWeight="regular">
//             {timingMsg}
//           </SoftTypography>
//         </Grid>

//         {/* Check-in */}
//         <Grid item xs={6} md={1}>
//           <SoftTypography variant="caption" color="success">
//             IN: {checkIn || "--"}
//           </SoftTypography>
//         </Grid>

//         {/* Check-out */}
//         <Grid item xs={6} md={1}>
//           <SoftTypography variant="caption" color="error">
//             OUT: {checkOut || "--"}
//           </SoftTypography>
//         </Grid>

//         {/* Hours or Auto-checkout */}
//         <Grid item xs={12} md={1}>
//           <SoftTypography variant="caption" color="dark" fontWeight="medium">
//             {hoursWorked || "--"}
//           </SoftTypography>
//           {autoCheckoutMsg && (
//             <SoftTypography variant="caption" fontWeight="bold">
//               {autoCheckoutMsg}
//             </SoftTypography>
//           )}
//         </Grid>
//       </Grid>
//     </Card>
//   );
// };

// DayRow.propTypes = {
//   day: PropTypes.string.isRequired,
//   date: PropTypes.string.isRequired,
//   status: PropTypes.string.isRequired,
//   checkIn: PropTypes.string,
//   checkOut: PropTypes.string,
//   hoursWorked: PropTypes.string,
//   comment: PropTypes.string,
//   shiftStart: PropTypes.string,
//   shiftEnd: PropTypes.string,
//   graceMinutes: PropTypes.number,
// };

// DayRow.defaultProps = {
//   checkIn: "--",
//   checkOut: "--",
//   hoursWorked: "--",
//   comment: "",
//   shiftStart: "09:00",
//   shiftEnd: "18:00",
//   graceMinutes: 10,
// };

// export default DayRow;
