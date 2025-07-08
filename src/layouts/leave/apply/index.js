// ✅ LeaveApplyForm.js (Final Copy-Paste Ready)
import React, { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { API_URL } from "config";

const holidays = [
  { date: "2025-01-26", name: "Republic Day" },
  { date: "2025-08-15", name: "Independence Day" },
  { date: "2025-10-02", name: "Gandhi Jayanti" },
  { date: "2025-11-01", name: "Diwali" },
  { date: "2025-03-29", name: "Holi" },
];

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const LeaveApplyForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("casual");
  const [reason, setReason] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveCount, setLeaveCount] = useState(null);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const isHoliday = (dateStr) => holidays.find((h) => h.date === dateStr);
  const isSunday = (dateStr) => new Date(dateStr).getDay() === 0;

  const validateDate = (dateStr, isStartDate = true) => {
    if (!dateStr) return "";
    
    if (isSunday(dateStr)) {
      return "Sunday is not allowed";
    }
    
    if (isHoliday(dateStr)) {
      return "Holiday is not allowed";
    }
    
    return "";
  };

  const getValidLeaveDates = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      const iso = current.toISOString().split("T")[0];
      if (!isSunday(iso) && !isHoliday(iso)) {
        dates.push(iso);
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    const error = validateDate(date, true);
    setStartDateError(error);
    
    // Reset end date if it's before new start date
    if (endDate && date > endDate) {
      setEndDate("");
      setEndDateError("");
    }
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    setEndDate(date);
    setEndDateError(validateDate(date, false));
  };

  useEffect(() => {
    if (startDate && endDate && !startDateError && !endDateError) {
      const validDates = getValidLeaveDates(startDate, endDate);
      setLeaveCount(validDates.length);
    } else {
      setLeaveCount(null);
    }
  }, [startDate, endDate, startDateError, endDateError]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !type || !reason) {
      setSnackbar({ open: true, message: "All fields are required", severity: "error" });
      return;
    }

    if (startDateError || endDateError) {
      setSnackbar({ open: true, message: "Please fix date errors", severity: "error" });
      return;
    }

    const validDates = getValidLeaveDates(startDate, endDate);

    if (validDates.length === 0) {
      setSnackbar({ open: true, message: "Only holidays or Sundays selected", severity: "warning" });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_URL}/leave/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          day: validDates.length,
          type,
          reason,
          dates: validDates,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");

      setSnackbar({ open: true, message: "Leave submitted!", severity: "success" });
      setStartDate(""); setEndDate(""); setType("casual"); setReason(""); 
      setLeaveCount(null); setStartDateError(""); setEndDateError("");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = (dateStr) => {
    const h = isHoliday(dateStr);
    return h ? h.name : "";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={4}>
        <Card sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
          <SoftTypography variant="h4" fontWeight="bold" mb={3}>Apply for Leave</SoftTypography>

          <SoftBox mb={3}>
            <SoftTypography variant="body2" fontWeight="medium" mb={1}>Start Date</SoftTypography>
            <SoftInput
              type="date"
              fullWidth
              value={startDate}
              title={getTitle(startDate)}
              onChange={handleStartDateChange}
              inputProps={{ min: minDate }}
              disabled={isSubmitting}
              error={!!startDateError}
            />
            {startDateError && (
              <SoftTypography variant="caption" color="error" fontWeight="medium">
                {startDateError}
              </SoftTypography>
            )}
          </SoftBox>

          <SoftBox mb={3}>
            <SoftTypography variant="body2" fontWeight="medium" mb={1}>End Date</SoftTypography>
            <SoftInput
              type="date"
              fullWidth
              value={endDate}
              title={getTitle(endDate)}
              onChange={handleEndDateChange}
              inputProps={{ min: startDate || minDate }}
              disabled={isSubmitting}
              error={!!endDateError}
            />
            {endDateError && (
              <SoftTypography variant="caption" color="error" fontWeight="medium">
                {endDateError}
              </SoftTypography>
            )}
          </SoftBox>

          {leaveCount !== null && (
            <SoftBox mb={3}>
              <SoftTypography variant="body2" color="info" fontWeight="medium">
                You are applying for <strong>{leaveCount}</strong> day(s)
              </SoftTypography>
              <SoftTypography variant="caption" sx={{ color: "green" }}>
                Sundays and holidays are excluded
              </SoftTypography>
            </SoftBox>
          )}

          <SoftBox mb={3}>
            <SoftTypography variant="body2" fontWeight="medium" mb={1}>Type</SoftTypography>
            <FormControl fullWidth>
              <Select value={type} onChange={(e) => setType(e.target.value)} disabled={isSubmitting}>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
                <MenuItem value="function">Attend a Function</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </SoftBox>

          <SoftBox mb={3}>
            <SoftTypography variant="body2" fontWeight="medium" mb={1}>Reason</SoftTypography>
            <SoftInput
              multiline rows={4}
              placeholder="Enter reason for leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
          </SoftBox>

          <SoftBox display="flex" justifyContent="flex-end">
            <SoftButton color="info" onClick={handleSubmit} disabled={isSubmitting || startDateError || endDateError}>
              {isSubmitting ? (<><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />Applying...</>) : "Submit"}
            </SoftButton>
          </SoftBox>
        </Card>
      </SoftBox>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default LeaveApplyForm;