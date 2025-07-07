// import React from "react";
// import PropTypes from "prop-types";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";

// import Icon from "@mui/material/Icon";
// import { Card, Grid } from "@mui/material";

// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftInput from "components/SoftInput";
// import { whitespace } from "stylis";
// // import "./attendanceheader.css";
// import CalendarRoot from "./examples/calendar/CalendarRoot";
// import { useState } from "react"; // Make sure this is at the top
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import CalendarRoot from "examples/Calendar/CalendarRoot";


// const AttendanceHeader = ({
//   activeTab,
//   onTabChange,
//   dateRange,
//   onPrev,
//   onNext,
//   shiftName,
//   shiftTime,
//   checkOutNote,
//   setCheckOutNote,
//   checkOutTimer
// }) => {
//   const [calendarOpen, setCalendarOpen] = useState(false);

//   return (
//     <Card sx={{ padding: 2, marginBottom: 3, marginLeft:30 }}>
//       <Grid container alignItems="center" justifyContent="space-between">
//         {/* Tabs */}
//         <Grid item xs={12} md={6} lg={6}>
//           <SoftBox display="flex" alignItems="center" gap={2}>
//             <SoftTypography
//               variant="button"
//               fontWeight={activeTab === "summary" ? "bold" : "regular"}
//               color={activeTab === "summary" ? "info" : "text"}
//               sx={{ cursor: "pointer" }}
//               onClick={() => onTabChange("summary")}
//             >
//               Attendance Summary
//             </SoftTypography>
//             <SoftTypography
//               variant="button"
//               fontWeight={activeTab === "shift" ? "bold" : "regular"}
//               color={activeTab === "shift" ? "info" : "text"}
//               sx={{ cursor: "pointer" }}
//               onClick={() => onTabChange("shift")}
//             >
//               Shift
//             </SoftTypography>
//           </SoftBox>
//         </Grid>

//               </Grid>

//       {/* Shift + input + timer */}
//       <Grid container mt={3} alignItems="center" spacing={2}>
//         <Grid item xs={12} md={5} lg={5}>
//           <SoftTypography variant="button" fontWeight="bold">
//             {shiftName} [ {shiftTime} ]
//           </SoftTypography>
//         </Grid>
//         <Grid item xs={12} md={5} lg={5}>
//           <SoftInput
//             placeholder="Add notes for check-out"
//             value={checkOutNote}
//             onChange={(e) => setCheckOutNote(e.target.value)}
//           />
//          {/* dates range */}
//            <Grid item xs={12} md={6} lg={6}>
//   <SoftBox
//   display="flex"
//   alignItems="center"
//   gap={2}
//   sx={{ flexWrap: "nowrap", minWidth: "300px" }} // Prevent wrapping
// >
//   <Icon sx={{ cursor: "pointer" }} onClick={onPrev}>chevron_left</Icon>

//   <SoftBox
//     sx={{
//       backgroundColor: "#fff",
//       borderRadius: "10px",
//       padding: "6px 10px",
//       display: "flex",
//       alignItems: "center",
//       gap: 1,
//     }}
//   >
//    <Icon sx={{ color: "#344767", cursor: "pointer" }} onClick={() => setCalendarOpen(true)}>
//   calendar_month
// </Icon>


//     <SoftTypography
//       variant="button"
//       fontWeight="medium"
//       color="dark"
//       sx={{
//         whiteSpace: "nowrap",
//         display: "inline-block",
//         minWidth: "fit-content",
//       }}
//     >
//       {(dateRange?.start || "--")} - {(dateRange?.end || "--")}
//     </SoftTypography>
//   </SoftBox>

//   <Icon sx={{ cursor: "pointer" }} onClick={onNext}>chevron_right</Icon>
// </SoftBox>


// </Grid>

//         </Grid>
//       </Grid> 
//       <SoftBox
//   sx={{
//     backgroundColor: "#f44336",
//     color: "#fff",
//     borderRadius: "10px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     fontWeight: "bold",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//     padding: "10px 12px",
//     width: "fit-content",
//     maxWidth: "100%",
//     marginLeft:"1010px",
//   }}
// >
//   <div style={{ textAlign: "left", lineHeight: "1.3", fontSize: "14px" }}>
//     Check-out <br />
//     <span style={{ fontSize: "16px" }}>{checkOutTimer} Hrs</span>
//   </div>

//   <div
//     style={{
//       backgroundColor: "#fff",
//       color: "#f44336",
//       borderRadius: "50%",
//       width: "26px",
//       height: "26px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       marginLeft: "30px",
//       boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//     }}
//   >
//     <AccessTimeIcon style={{ fontSize: "16px" }} />
//   </div>
// </SoftBox>
// <Modal open={calendarOpen} onClose={() => setCalendarOpen(false)}>
//   <Box
//     sx={{
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       width: "90%",
//       maxWidth: 1000,
//       bgcolor: "background.paper",
//       boxShadow: 24,
//       p: 3,
//       borderRadius: 2,
//       maxHeight: "90vh",
//       overflow: "auto",
//     }}
//   >
//     <CalendarRoot>
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         events={[
//           {
//             title: "Example Event",
//             start: new Date().toISOString().split("T")[0],
//             className: "event-success",
//           },
//         ]}
//         height="auto"
//       />
//     </CalendarRoot>
//   </Box>
// </Modal>


//     </Card>
//   );
// };

// AttendanceHeader.propTypes = {
//   activeTab: PropTypes.string.isRequired,
//   onTabChange: PropTypes.func.isRequired,
//   dateRange: PropTypes.shape({
//     start: PropTypes.string.isRequired,
//     end: PropTypes.string.isRequired
//   }).isRequired,
//   onPrev: PropTypes.func.isRequired,
//   onNext: PropTypes.func.isRequired,
//   shiftName: PropTypes.string.isRequired,
//   shiftTime: PropTypes.string.isRequired,
//   checkOutNote: PropTypes.string.isRequired,
//   setCheckOutNote: PropTypes.func.isRequired,
//   checkOutTimer: PropTypes.string.isRequired
// };
// AttendanceHeader.defaultProps = {
//   dateRange: { start: "--", end: "--" }
// };


// export default AttendanceHeader;

// This file has been moved to component/header/index.js
// export {};
