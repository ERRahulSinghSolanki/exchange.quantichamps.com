// import React from "react";
// import { Grid, Box, Typography } from "@mui/material";
// import PropTypes from "prop-types"; 
// import SoftTypography from "components/SoftTypography"; // Assuming you have a SoftTypography component for consistency

// function AttendanceRow({ attendance }) {
//   return (
    
//     <Box
//       sx={{
//         borderBottom: "1px solid #e0e0e0",
//         padding: "15px",
//         backgroundColor: "#f9f9f9",
//       }}
//     >
//       <Grid container spacing={2}>
//         {/* Date Column */}
//         <Grid item xs={2}>
//           <SoftTypography variant="body1" fontWeight="bold">
//             {attendance.date}
//           </SoftTypography>
//         </Grid>

//         {/* Time In Column */}
//         <Grid item xs={2}>
//           {attendance.timeIn ? (
//             <SoftTypography variant="body2">{attendance.timeIn}</SoftTypography>
//           ) : (
//             <SoftTypography variant="body2" color="textSecondary">
//               N/A
//             </SoftTypography>
//           )}
//         </Grid>

//         {/* Status Column */}
//         <Grid item xs={3}>
//           <SoftTypography
//             variant="body2"
//             sx={{
//               backgroundColor:
//                 attendance.status === "Absent"
//                   ? "#fddede"
//                   : attendance.status.includes("Leave")
//                   ? "#ffecc7"
//                   : "#e0f7fa",
//               padding: "4px 10px",
//               borderRadius: "6px",
//             }}
//           >
//             {attendance.status}
//           </SoftTypography>
//         </Grid>

//         {/* Time Out Column */}
//         <Grid item xs={2}>
//           {attendance.timeOut ? (
//             <SoftTypography variant="body2">{attendance.timeOut}</SoftTypography>
//           ) : (
//             <SoftTypography variant="body2" color="textSecondary">
//               N/A
//             </SoftTypography>
//           )}
//         </Grid>

//         {/* Hours Worked Column */}
//         <Grid item xs={2}>
//           <SoftTypography variant="body2" fontWeight="bold">
//             {attendance.hoursWorked} Hrs worked
//           </SoftTypography>
//         </Grid>

//         {/* Late By Column */}
//         <Grid item xs={1}>
//           {attendance.lateBy && (
//             <SoftTypography variant="body2" color="error">
//               Late by {attendance.lateBy}
//             </SoftTypography>
//           )}
//         </Grid>
//       </Grid>
//     </Box>
    

//   );
// }
// AttendanceRow.propTypes = {
//   attendance: PropTypes.shape({
//     date: PropTypes.string.isRequired,      // 'date' is a required string
//     timeIn: PropTypes.string,               // 'timeIn' can be a string, but is optional
//     timeOut: PropTypes.string,              // 'timeOut' can be a string, but is optional
//     lateBy: PropTypes.string,               // 'lateBy' can be a string, but is optional
//     hoursWorked: PropTypes.string.isRequired, // 'hoursWorked' is a required string
//     status: PropTypes.string.isRequired,     // 'status' is a required string
//   }).isRequired, // Making the 'attendance' object required
// };

// export default AttendanceRow;


import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import PropTypes from "prop-types"; 
import SoftTypography from "components/SoftTypography"; // Assuming you have a SoftTypography component for consistency
import "./attendancerow.css";
function AttendanceRow({ attendance }) {
  // Fallback to default values to prevent "undefined" errors
  const {
    date = "N/A", 
    timeIn = "N/A", 
    timeOut = "N/A", 
    lateBy = "N/A", 
    hoursWorked = "00:00", 
    status = "No Status",
  } = attendance || {};  // Fallback if attendance is undefined

  return (
    <Box
      sx={{
        borderBottom: "1px solid #e0e0e0",
        padding: "15px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Grid container spacing={2}>
        {/* Date Column */}
        <Grid item xs={2}>
          <SoftTypography variant="body1" fontWeight="bold">
            {date}
          </SoftTypography>
        </Grid>

        {/* Time In Column */}
        <Grid item xs={2}>
          <SoftTypography variant="body2">{timeIn}</SoftTypography>
        </Grid>

        {/* Status Column */}
        <Grid item xs={3}>
          <SoftTypography
            variant="body2"
            sx={{
              backgroundColor:
                status === "Absent"
                  ? "#fddede"
                  : status.includes("Leave")
                  ? "#ffecc7"
                  : "#e0f7fa",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            {status}
          </SoftTypography>
        </Grid>

        {/* Time Out Column */}
        <Grid item xs={2}>
          <SoftTypography variant="body2">{timeOut}</SoftTypography>
        </Grid>

        {/* Hours Worked Column */}
        <Grid item xs={2}>
          <SoftTypography variant="body2" fontWeight="bold">
            {hoursWorked} Hrs worked
          </SoftTypography>
        </Grid>

        {/* Late By Column */}
        <Grid item xs={1}>
          {lateBy !== "N/A" && (
            <SoftTypography variant="body2" color="error">
              Late by {lateBy}
            </SoftTypography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

// PropTypes validation for props
AttendanceRow.propTypes = {
  attendance: PropTypes.shape({
    date: PropTypes.string,      // 'date' can be a string, default is "N/A"
    timeIn: PropTypes.string,    // 'timeIn' can be a string, default is "N/A"
    timeOut: PropTypes.string,   // 'timeOut' can be a string, default is "N/A"
    lateBy: PropTypes.string,    // 'lateBy' can be a string, default is "N/A"
    hoursWorked: PropTypes.string, // 'hoursWorked' is a required string
    status: PropTypes.string,    // 'status' is a required string
  }).isRequired,
};

export default AttendanceRow;
