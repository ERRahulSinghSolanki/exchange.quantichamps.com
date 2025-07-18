import "../leavesummary/index.css";
import Icon from "@mui/material/Icon";

const leaveTypes = [
    { name: 'Casual Leave', icon: '', available: 12, booked: 0 },
    { name: 'Sick Leave', icon: '', available: 8, booked: 0 },
    { name: 'Paternity Leave', icon: '', available: 7, booked: 0 },
    { name: 'Maternity Leave', icon: '', available: 0, booked: 0 },
    { name: 'Negative Leave', icon: '', available: 4, booked: 0 },
  ];

const LeaveCard = () => {
    return (
            <div className="leave-cards-grid">
              {leaveTypes.map((type, index) => (
                <div key={index} className="leave-card">
                  <div className="card-header">
                    <span className="card-icon">{type.icon}</span>
                    <h3 className="card-title">{type.name}</h3>
                  </div>
                  <div className="card-body">
                    <div className="card-row">
                      <span>Available</span>
                      <span className="value">{type.available}</span>
                    </div>
                    <div className="card-row">
                      <span>Booked</span>
                      <span className="value">{type.booked}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
    );
};

export default LeaveCard;



// components/LeaveTypeGrid.jsx

// import React from "react";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import Divider from "@mui/material/Divider";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";

// const leaveTypes = [
//   { name: "Casual Leave", icon: "🌊", available: 12, booked: 0 },
//   { name: "Earned Leave", icon: "⏱️", available: 12, booked: 0 },
//   { name: "Paternity Leave", icon: "👶", available: 0, booked: 0 },
//   { name: "Maternity Leave", icon: "🧘", available: 0, booked: 0 },
//   { name: "Sick Leave", icon: "🩺", available: 12, booked: 0 },
// ];

// function LeaveCard() {
//   return (
//     <Grid container spacing={3}>
//       {leaveTypes.map((type, index) => (
//         <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
//           <Card sx={{ p: 2 }}>
//             <SoftBox display="flex" alignItems="center" gap={1} mb={2}>
//               <SoftBox
//                 width="40px"
//                 height="40px"
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 borderRadius="50%"
//                 fontSize="24px"
//                 bgcolor="info.main"
//                 color="white"
//               >
//                 {type.icon}
//               </SoftBox>
//               <SoftTypography variant="h6">{type.name}</SoftTypography>
//             </SoftBox>
//             <Divider />
//             <SoftBox mt={2}>
//               <SoftBox display="flex" justifyContent="space-between">
//                 <SoftTypography variant="button" color="text">Available</SoftTypography>
//                 <SoftTypography variant="button" fontWeight="bold">{type.available}</SoftTypography>
//               </SoftBox>
//               <SoftBox display="flex" justifyContent="space-between" mt={1}>
//                 <SoftTypography variant="button" color="text">Booked</SoftTypography>
//                 <SoftTypography variant="button" fontWeight="bold">{type.booked}</SoftTypography>
//               </SoftBox>
//             </SoftBox>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

// export default LeaveCard;
