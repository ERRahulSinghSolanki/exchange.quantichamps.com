import LeavaBalance from "../LeaveBalance";
import "../leavesummary/index.css";
import { useState } from "react";

const Header = () => {
    const [selectedTab, setSelectedTab] = useState('summary');
    return(
        <header className="header">
        <nav className="nav-tabs">
          <button className={`nav-tab ${selectedTab === 'summary' ? 'active' : ''}`} onClick={() => setSelectedTab('summary')}>Leave Summary</button>
          <button className={`nav-tab ${selectedTab === 'balance' ? 'active' : ''}`} onClick={() => setSelectedTab('balance')}>Leave Balance</button>
          <button className={`nav-tab ${selectedTab === 'requests' ? 'active' : ''}`} onClick={() => setSelectedTab('requests')}>Leave Requests</button>
          <button className={`nav-tab ${selectedTab === 'shift' ? 'active' : ''}`} onClick={() => setSelectedTab('shift')}>Shift</button>
        </nav>
        {selectedTab === "balance" && <LeavaBalance />}

      </header>
    );
};

export default Header;

// import SoftBox from "components/SoftBox";
// import SoftButton from "components/SoftButton";
// import React, { useState } from 'react';

// const [selectedTab, setSelectedTab] = useState('summary');



// const Header = () => {
//   return(
// <SoftBox display="flex" gap={3} mb={3}>
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
//   );
//             };

// export default Header;





// components/SoftBoxHeader.jsx

// import React from "react";
// import PropTypes from "prop-types";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftButton from "components/SoftButton";
// import Icon from "@mui/material/Icon";
// import ApplyLeaveForm from "../applyleaveform"; // Adjust the import path as necessary

// function Header({ selectedTab, setSelectedTab, currentDateRange }) {
//   const tabs = ["summary", "balance", "requests", "shift"];

//   return (
//     <>
//       {/* Header Tabs */}
//       <SoftBox display="flex" gap={3} mb={3}>
//         {tabs.map((tab) => (
//           <SoftButton
//             key={tab}
//             variant={selectedTab === tab ? "gradient" : "outlined"}
//             color={selectedTab === tab ? "info" : "secondary"}
//             onClick={() => setSelectedTab(tab)}
//           >
//             {`Leave ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
//           </SoftButton>
//         ))}
//       </SoftBox>

//       {/* Stats and Date Navigation */}
//       <SoftBox display="flex" justifyContent="space-between" flexWrap="wrap" mb={3}>
//         <SoftTypography variant="body2">
//           Leave booked this year: <strong>0</strong> | Absent: <strong>0</strong>
//         </SoftTypography>

//         <SoftBox display="flex" gap={1} flexWrap="wrap">
//           <SoftButton variant="outlined" color="info">&lt;</SoftButton>
//           <SoftTypography variant="button" fontWeight="medium">
//             {currentDateRange}
//           </SoftTypography>
//           <SoftButton variant="outlined" color="info">&gt;</SoftButton>
//           <SoftButton variant="outlined" color="info">
//             <Icon>calendar_month</Icon>
//           </SoftButton>
//           {/* <SoftButton variant="gradient" color="success">Apply Leave</SoftButton> */}
//           <button onClick={() => setShowApplyLeave(true)} className="apply-leave-btn">
//         Apply Leave
//        </button>

//        {showApplyLeave && (
//        <div className="modal-overlay">
//            <ApplyLeaveForm />
//          </div>
//        )}
//         </SoftBox>
//       </SoftBox>
//     </>
//   );
// }

// Header.propTypes = {
//   selectedTab: PropTypes.string,
//   setSelectedTab: PropTypes.func,
//   currentDateRange: PropTypes.string,
// };

// export default Header;



// components/SoftBoxHeader.jsx

// import React, { useState } from "react";
// import PropTypes from "prop-types";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftButton from "components/SoftButton";
// import Icon from "@mui/material/Icon";
// import ApplyLeaveForm from "../applyleaveform"; // Adjust the import path as necessary

// function Header({ selectedTab, setSelectedTab, currentDateRange }) {
//   const tabs = ["summary", "balance", "requests", "shift"];
//   const [showApplyLeave, setShowApplyLeave] = useState(false);

//   return (
//     <>
//       {/* Header Tabs */}
//       <SoftBox display="flex" gap={3} mb={3}>
//         {tabs.map((tab) => (
//           <SoftButton
//             key={tab}
//             variant={selectedTab === tab ? "gradient" : "outlined"}
//             color={selectedTab === tab ? "info" : "secondary"}
//             onClick={() => setSelectedTab(tab)}
//           >
//             {`Leave ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
//           </SoftButton>
//         ))}
//       </SoftBox>

//       {/* Stats and Date Navigation */}
//       <SoftBox display="flex" justifyContent="space-between" flexWrap="wrap" mb={3}>
//         <SoftTypography variant="body2">
//           Leave booked this year: <strong>0</strong> | Absent: <strong>0</strong>
//         </SoftTypography>

//         <SoftBox display="flex" gap={1} flexWrap="wrap">
//           <SoftButton variant="outlined" color="info">&lt;</SoftButton>
//           <SoftTypography variant="button" fontWeight="medium">
//             {currentDateRange}
//           </SoftTypography>
//           <SoftButton variant="outlined" color="info">&gt;</SoftButton>
//           <SoftButton variant="outlined" color="info">
//             <Icon>calendar_month</Icon>
//           </SoftButton>
//           <SoftButton variant="gradient" color="success" onClick={() => setShowApplyLeave(true)}>
//             Apply Leave
//           </SoftButton>
//         </SoftBox>
//       </SoftBox>

//       {/* Apply Leave Modal */}
//       {showApplyLeave && (
//         <SoftBox
//           position="fixed"
//           top={0}
//           left={0}
//           width="100%"
//           height="100%"
//           bgcolor="rgba(0, 0, 0, 0.5)"
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex={1300}
//         >
//           <SoftBox
//             width="90%"
//             maxWidth="600px"
//             bgcolor="white"
//             borderRadius="lg"
//             p={3}
//             boxShadow="xl"
//           >
//             <ApplyLeaveForm onClose={() => setShowApplyLeave(false)} />
//           </SoftBox>
//         </SoftBox>
//       )}
//     </>
//   );
// }

// Header.propTypes = {
//   selectedTab: PropTypes.string.isRequired,
//   setSelectedTab: PropTypes.func.isRequired,
//   currentDateRange: PropTypes.string.isRequired,
// };

// export default Header;
