// import React from "react";
// import SoftBox from "components/SoftBox";
// import Box from "@mui/material/Box";
// import SoftTypography from "components/SoftTypography";
// // import Icon from "@mui/material/Icon";
// import PropTypes from "prop-types";


// function LeaveRow({ date = "02-Jul-2025, Wed", type = "Casual Leave", days = "1 day", color = "info" }) {
//   return (
//     // <SoftBox
//     //   display="flex"
//     //   justifyContent="space-between"
//     //   alignItems="center"
//     //   py={1.5}
//     //   px={2}
//     //   borderRadius="lg"
//     //   boxShadow="sm"
//     //   bgcolor="white"
//     //   mb={1}
//     // >
//     <Box
//       sx={{
//         borderBottom: "1px solid #e0e0e0",
//         padding: "15px",
//         backgroundColor: "#f2f2f2",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         borderRadius: "8px",    
//         boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//         marginBottom: "10px",
//       }}
//     >
//       {/* Date Column */}
//       <SoftTypography variant="button" fontWeight="medium" color="text">
//         {date}
//       </SoftTypography>

//       {/* Leave Info Column */}
//       <SoftBox display="flex" alignItems="center" gap={1}>
//         {/* Colored Dot */}
//         <SoftBox
//           width="14px"
//           height="14px"
//           borderRadius="sm"
//           bgcolor={`${color}.main`}
//         />
//         <SoftTypography variant="button" fontWeight="medium">
//           {type}
//         </SoftTypography>
//         <SoftTypography variant="caption" color="secondary" ml={1}>
//           • {days}
//         </SoftTypography>
//       </SoftBox>

//       {/* Optional Right Column - for future icons, actions, etc. */}
//       <SoftBox width="32px" />
//     </Box>
//   );
// }

// LeaveRow.propTypes = {
//   date: PropTypes.string,
//   type: PropTypes.string,
//   days: PropTypes.string,
//   color: PropTypes.string,
// };


// export default LeaveRow;
