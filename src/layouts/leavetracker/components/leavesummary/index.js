import React, { useState } from 'react';
import "./index.css";
import LeaveCard from '../leavecard';
import Header from '../header';
import UpcomingLeaveSection from '../upcomingsection';
import PastLeaveSection from '../pastleave';
// import ApplyLeave from '../applyleaveform';
import ApplyLeaveForm from '../applyleaveform';

// Main App Component
const LeaveSummary = () => {
const [currentDateRange, setCurrentDateRange] = useState('01-Jan-2025 - 31-Dec-2025');
const [selectedTab, setSelectedTab] = useState('summary');
const [showApplyLeave, setShowApplyLeave] = useState(false);
  return (
    <div className="app-container">
      {/* Header Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="main-content">
        {selectedTab === 'summary' && (
          <div className="leave-summary-section">
            {/* Summary Header */}
            <div className="summary-header">
              <div className="leave-stats">
                <span>Leave booked this year : <strong>0</strong></span> | <span>Absent : <strong>0</strong></span>
              </div>
              <div className="date-navigation">
                <button className="nav-arrow">&lt;</button>
                <span className="date-range">{currentDateRange}</span>
                <button className="nav-arrow">&gt;</button>
                <button className="calendar-icon">🗓️</button>
                {/* <button className="apply-leave-btn">Apply Leave
                    <ApplyLeaveForm />
                </button> */}
                <div>
      <button onClick={() => setShowApplyLeave(true)} className="apply-leave-btn">
        Apply Leave
      </button>

      {showApplyLeave && (
        <div className="modal-overlay">
          <ApplyLeaveForm />
        </div>
      )}
    </div>
              </div>
            </div>

            <LeaveCard />
            <UpcomingLeaveSection/>
            <PastLeaveSection />
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaveSummary;



// import React, { useState } from 'react';

// Soft UI Dashboard PRO Components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftButton from "components/SoftButton";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import Icon from "@mui/material/Icon";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";
// import Divider from "@mui/material/Divider";
// import Header from 'layouts/leavetracker/components/header';
// import LeaveCard from '../leavecard';

// function LeaveSummary() {
//   const [selectedTab, setSelectedTab] = useState('summary');
//   const [currentDateRange, setCurrentDateRange] = useState('01-Jan-2025 - 31-Dec-2025');

//   const leaveTypes = [
//     { name: 'Casual Leave', icon: '🌊', available: 12, booked: 0 },
//     { name: 'Earned Leave', icon: '⏱️', available: 12, booked: 0 },
//     // { name: 'Leave Without Pay', icon: '🚫', available: 0, booked: 0 },
//     { name: 'Paternity Leave', icon: '👶', available: 0, booked: 0 },
//     { name: 'Maternity Leave', icon: '🧘', available: 0, booked: 0 },
//     { name: 'Sick Leave', icon: '🩺', available: 12, booked: 0 },
//   ];

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <SoftBox py={3}>
//         <Card>
//           <SoftBox p={3}>
//             {/* Header Navigation Tabs */}
//             <SoftBox display="flex" gap={3} mb={3}>
//               {['summary', 'balance', 'requests', 'shift'].map((tab) => (
//                 <SoftButton
//                   key={tab}
//                   variant={selectedTab === tab ? "gradient" : "outlined"}
//                   color={selectedTab === tab ? "info" : "secondary"}
//                   onClick={() => setSelectedTab(tab)}
//                 >
//                   {`Leave ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
//                 </SoftButton>
//               ))}
//             </SoftBox>
//             {/* <Header /> */}

//             {/* Summary Section */}
//             {selectedTab === 'summary' && (
//               <>
//                 {/* Stats and Navigation */}
//                 <SoftBox display="flex" justifyContent="space-between" flexWrap="wrap" mb={3}>
//                   <SoftTypography variant="body2">
//                     Leave booked this year: <strong>0</strong> | Absent: <strong>0</strong>
//                   </SoftTypography>
//                   <SoftBox display="flex" gap={1} flexWrap="wrap">
//                     <SoftButton variant="outlined" color="info">&lt;</SoftButton>
//                     <SoftTypography variant="button" fontWeight="medium">{currentDateRange}</SoftTypography>
//                     <SoftButton variant="outlined" color="info">&gt;</SoftButton>
//                     <SoftButton variant="outlined" color="info"><Icon>calendar_month</Icon></SoftButton>
//                     {/* <SoftButton variant="gradient" color="info">📋</SoftButton> */}
//                     {/* <SoftButton variant="outlined" color="info">📊</SoftButton> */}
//                     <SoftButton variant="gradient" color="success">Apply Leave</SoftButton>
//                     {/* <SoftButton variant="outlined" color="dark">...</SoftButton> */}
//                   </SoftBox>
//                 </SoftBox>

//                 {/* Leave Cards */}
//                 <Grid container spacing={3}>
//                   {leaveTypes.map((type, index) => (
//                     <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
//                       <Card sx={{ p: 2 }}>
//                         <SoftBox display="flex" alignItems="center" gap={1} mb={2}>
//                           <SoftBox
//                             width="40px"
//                             height="40px"
//                             display="flex"
//                             alignItems="center"
//                             justifyContent="center"
//                             borderRadius="50%"
//                             fontSize="24px"
//                             bgcolor="info.main"
//                             color="white"
//                           >
//                             {type.icon}
//                           </SoftBox>
//                           <SoftTypography variant="h6">{type.name}</SoftTypography>
//                         </SoftBox>
//                         <Divider />
//                         <SoftBox mt={2}>
//                           <SoftBox display="flex" justifyContent="space-between">
//                             <SoftTypography variant="button" color="text">Available</SoftTypography>
//                             <SoftTypography variant="button" fontWeight="bold">{type.available}</SoftTypography>
//                           </SoftBox>
//                           <SoftBox display="flex" justifyContent="space-between" mt={1}>
//                             <SoftTypography variant="button" color="text">Booked</SoftTypography>
//                             <SoftTypography variant="button" fontWeight="bold">{type.booked}</SoftTypography>
//                           </SoftBox>
//                         </SoftBox>
//                       </Card>
//                     </Grid>
//                   ))}
//                 </Grid>
//                 {/* <LeaveCard 
//                 /> */}


//                 {/* Upcoming Leaves and Holidays */}
//                 <SoftBox mt={4}>
//                   <FormControl fullWidth>
//                     <InputLabel>Upcoming Leave & Holidays</InputLabel>
//                     <Select defaultValue="">
//                       <MenuItem value="">Upcoming Leave & Holidays</MenuItem>
//                       {/* Add more options */}
//                     </Select>
//                   </FormControl>

//                   <SoftBox textAlign="center" mt={3}>
//                     <img
//                       src="https://placehold.co/200x150/E0E7FF/4F46E5?text=No+Data"
//                       alt="No data"
//                       style={{ borderRadius: 8, maxWidth: "100%" }}
//                     />
//                     <SoftTypography variant="caption" color="text">No Data Found</SoftTypography>
//                   </SoftBox>
//                 </SoftBox>
//               </>
//             )}
//           </SoftBox>
//         </Card>
//       </SoftBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default LeaveSummary;






// import Header from "layouts/leavetracker/components/Header/index";
// import LeaveCard from "layouts/leavetracker/components/LeaveCard/index";
// import UpcomingSection from "layouts/leavetracker/components/UpcomingSection/index";
// import LeaveCard from '../leavecard';
// import Header from '../header';
// import UpcomingSection from '../upcomingsection';

// const LeaveSummary = () => {
//   return (
//     <div className="leave-summary-container">
//       {/* Header with Tabs and Stats */}
//       <Header selectedTab="summary" setSelectedTab={() => {}} currentDateRange="01-Jan-2025 - 31-Dec-2025" />

//       {/* Leave Types Grid */}
//       <LeaveCard />

//       {/* Upcoming Leave Section */}
//       <UpcomingSection />
//     </div>
//   );
// }

// export default LeaveSummary;  