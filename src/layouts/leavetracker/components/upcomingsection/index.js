import "../leavesummary/index.css";
// import "../data/index";
import LeaveRow from "../data/index";

const UpcomingLeaveSection = () =>{
    return(
        <div className="upcoming-section">
              <div className="upcoming-header">
                <select className="dropdown">
                  <option>Upcoming Leave & Holidays</option>
                  <option>Upcoming Leave</option>
                  <option>Upcoming Holidays</option>
                </select>
              </div>
              {/* <div className="no-data-illustration">
                <img src="https://placehold.co/200x150/E0E7FF/4F46E5?text=No+Data" alt="No data found" />
                <p>No Data Found</p>
              </div> */}
              <LeaveRow /> 
            </div>
    );
};

export default UpcomingLeaveSection;





// components/UpcomingLeaveSection.jsx

// import React from "react";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";

// function UpcomingSection() {
//   return (
//     <SoftBox mt={4}>
//       <FormControl fullWidth>
//         <InputLabel>Upcoming Leave & Holidays</InputLabel>
//         <Select defaultValue="">
//           <MenuItem value="">Upcoming Leave & Holidays</MenuItem>
//           {/* Add more options dynamically if needed */}
//         </Select>
//         <SoftBox textAlign="center" mt={3}>
//         <img
//           src="https://placehold.co/200x150/E0E7FF/4F46E5?text=No+Data"
//           alt="No data"
//           style={{ borderRadius: 8, maxWidth: "100%" }}
//         />
//         <SoftTypography variant="caption" color="text">
//           No Data Found
//         </SoftTypography>
//       </SoftBox>
//       </FormControl>

      
//     </SoftBox>
//   );
// }

// export default UpcomingSection;
