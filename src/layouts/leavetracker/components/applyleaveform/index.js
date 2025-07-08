// // import select from "assets/theme/components/form/select";
// // import formControlLabel from "assets/theme/components/form/formControlLabel";
// // import { components } from "react-select";
// // import SoftBox from "components/SoftBox";

// // const ApplyLeave = () => {
// //     return(
// //         <SoftBox
// //               width="100vw"
// //               height="100%"
// //               minHeight="100vh"
// //             //   bgColor={background}
// //             //   sx={{ overflowX: "hidden" }}
// //             >
// //               {/* {children} */}
// //             </SoftBox>
// //     );
// // };

// // export default ApplyLeave;


// import React, { useState } from "react";
// import "./index.css";

// const ApplyLeaveForm = () => {
//   const [leaveType, setLeaveType] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [email, setEmail] = useState("");
//   const [reason, setReason] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submit logic here
//     console.log({ leaveType, startDate, endDate, email, reason });
//   };

//   return (
//     <div className="modal-form-wrapper">
//       <div className="modal-title-bar">
//         <h3>Apply Leave</h3>
//         <button className="modal-close-button" onClick={() => window.location.reload()}>
//   ✕
// </button>
//       </div>

//       <form onSubmit={handleSubmit} className="leave-form">
//         <div className="form-section">
//           <h5>Leave</h5>

//           <div className="form-group">
//             <label>
//               Leave type <span className="required">*</span>
//             </label>
//             <select
//               className="form-control"
//               value={leaveType}
//               onChange={(e) => setLeaveType(e.target.value)}
//               required
//             >
//               <option value="">Select</option>
//               <option value="Sick">Sick Leave</option>
//               <option value="Casual">Casual Leave</option>
//               <option value="Casual">Paternity Leave</option>
//               <option value="Casual">Maternity Leave</option>
//               <option value="Negative">Negative Leave</option>
//             </select>
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>
//                 Date <span className="required">*</span>
//               </label>
//               <div className="input-group">
//                 <input
//                   type="text"
//                   placeholder="dd-MMM-yyyy"
//                   className="form-control"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   required
//                 />
//                 <span className="calendar-icon">📅</span>
//               </div>
//             </div>
//             <div className="col">
//               <label className="invisible-label">To</label>
//               <div className="input-group">
//                 <input
//                   type="text"
//                   placeholder="dd-MMM-yyyy"
//                   className="form-control"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   required
//                 />
//                 <span className="calendar-icon">📅</span>
//               </div>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Team Email ID</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//             />
//           </div>

//           <div className="form-group">
//             <label>Reason for leave</label>
//             <textarea
//               className="form-control"
//               rows="3"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Optional reason"
//             ></textarea>
//           </div>
//         </div>

//         <div className="form-footer">
//           <button type="submit" className="btn-submit">
//             Submit
//           </button>
//           <button type="button" className="btn-cancel">
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ApplyLeaveForm;


// Apply Leave Form - Soft UI Dashboard PRO React Theme Version

import React, { useState } from "react";

// Soft UI Components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import FullCalendar from "@fullcalendar/react";
import CalendarRoot from "examples/Calendar/CalendarRoot";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"



function ApplyLeaveForm() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ leaveType, startDate, endDate, email, reason });
  };

  return (
    <Card>
      <SoftBox p={3}>
        {/* Header */}
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SoftTypography variant="h5">Apply Leave</SoftTypography>
          <IconButton onClick={() => window.location.reload()}>
            <CloseIcon />
          </IconButton>
        </SoftBox>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <SoftBox mb={3}>
            <SoftTypography variant="h6" color="text">Leave</SoftTypography>
          </SoftBox>

          {/* Leave Type */}
          <SoftBox mb={3}>
            <TextField
              fullWidth
              select
              type="select"
              placeholder="Select Leave Type"
              label="Leave Type *"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Sick">Sick Leave</MenuItem>
              <MenuItem value="Casual">Casual Leave</MenuItem>
              <MenuItem value="Paternity">Paternity Leave</MenuItem>
              <MenuItem value="Maternity">Maternity Leave</MenuItem>
              <MenuItem value="Negative">Negative Leave</MenuItem>
            </TextField>
          </SoftBox>

          {/* Date Range */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SoftBox mb={3}>
                <TextField
                  fullWidth
                  label="Start Date *"
                  type="text"
                  placeholder="dd-MMM-yyyy"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputProps={{
                    endAdornment: <Icon
                sx={{ color: "#344767", cursor: "pointer" }}
                onClick={() => setCalendarOpen(true)}
              >
                calendar_month
              </Icon>
                  }}
                />
              </SoftBox>
              <Modal open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "55%", // Move slightly to the right
            transform: "translate(-50%, -50%)",
            width: 500,
            maxWidth: 420,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
            borderRadius: 2,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <CalendarRoot>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={[]}
              height={350}
              contentHeight={200}
            />
          </CalendarRoot>
        </Box>
      </Modal>
            </Grid>
            <Grid item xs={12} md={6}>
              <SoftBox mb={3}>
                <TextField
                  fullWidth
                  label="End Date *"
                  type="text"
                  placeholder="dd-MMM-yyyy"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputProps={{
                    endAdornment: <Icon
                sx={{ color: "#344767", cursor: "pointer" }}
                onClick={() => setCalendarOpen(true)}
              >
                calendar_month
              </Icon>
                  }}
                />
              </SoftBox>
            </Grid>
          </Grid>

          {/* Email */}
          <SoftBox mb={3}>
            <SoftInput
              type="email"
              placeholder="Enter Team Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Team Email ID"
            />
          </SoftBox>

          {/* Reason */}
          <SoftBox mb={4}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Optional reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              label="Reason for Leave"
            />
          </SoftBox>

          {/* Footer Buttons */}
          <SoftBox display="flex" gap={2}>
            <SoftButton type="submit" variant="gradient" color="info">
              Submit
            </SoftButton>
            <SoftButton type="button" variant="outlined" color="secondary" onClick={() => window.location.reload()}>
              Cancel
            </SoftButton>
          </SoftBox>
        </form>
      </SoftBox>
    </Card>
  );
}

export default ApplyLeaveForm;

