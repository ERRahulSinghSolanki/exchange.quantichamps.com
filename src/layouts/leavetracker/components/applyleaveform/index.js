import React, { useState } from "react";
import PropTypes from "prop-types";

// // Soft UI Components
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
import interactionPlugin from "@fullcalendar/interaction";
import selectLeaveType from "./data";
import SoftSelect from "components/SoftSelect";
import { useEffect } from "react";
import FormField from "layouts/applications/wizard/components/FormField";


function ApplyLeaveForm({ selectedLeaveType , handleClose, onClick, onDateChange }) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ leaveType, startDate, endDate, email, reason });
  };


  useEffect(() => {
    if (selectedLeaveType) {
      setLeaveType(selectedLeaveType); 
    }
  }, [selectedLeaveType]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    onDateChange(date); 
  };

  return (
    <Card>
      <SoftBox p={3}>
        {/* Header */}
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SoftTypography variant="h5">Apply Leave</SoftTypography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </SoftBox>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <SoftBox mb={1}>
            <SoftTypography variant="h6" color="#344767">Leave Type</SoftTypography>
          </SoftBox>

          {/* Leave Type */}
          <Grid item xs={12} md={6}>
              <SoftSelect
  placeholder="Select"
  value={{ value: leaveType, label: leaveType }} 
  options={selectLeaveType.leaveType}
  onChange={(selectedOption) => {
    setLeaveType(selectedOption.value); 
  }}
/>

          </Grid>

          <Grid item xs={12} sm={4}>
            <SoftTypography variant="h6" color="#344767" mb="-25px"  > Start Date</SoftTypography>
            <FormField type="date" placeholder=""  value={selectedDate}
  onChange={(e) => {
    setSelectedDate(e.target.value);
    if (onDateChange) onDateChange(e.target.value);
  }}       fullWidth/>
          </Grid>
            <Grid item xs={12} sm={4}>
              <SoftTypography variant="h6" color="#344767" mb="-25px" >End Date</SoftTypography>
            <FormField type="date" placeholder=""  value={selectedDate}
  onChange={(e) => {
    setSelectedDate(e.target.value);
    if (onDateChange) onDateChange(e.target.value);
  }} fullWidth/>
          </Grid>
          <SoftBox mb={2}>
            <SoftBox mb={1}>
            <SoftTypography variant="h6" color="#344767">Email ID</SoftTypography>
          </SoftBox>
            <SoftInput
              type="email"
              placeholder="Enter Team Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Team Email ID"
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox mb={1}>
            <SoftTypography variant="h6" color="#344767">Reason</SoftTypography>
          </SoftBox>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Optional reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </SoftBox>

          <SoftBox display="flex" gap={2}>
            <SoftButton type="submit" variant="gradient" color="info">
              Submit
            </SoftButton>
            <SoftButton type="button" variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </SoftButton>
          </SoftBox>
        </form>
      </SoftBox>
    </Card>
  );
}

ApplyLeaveForm.propTypes = {
  selectedLeaveType: PropTypes.string,
  handleClose: PropTypes.func,
  onDateChange: PropTypes.func, 
  onClick: PropTypes.func,
};


export default ApplyLeaveForm;

