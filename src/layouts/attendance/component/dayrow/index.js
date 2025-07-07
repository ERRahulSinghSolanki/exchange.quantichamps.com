import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import { Card, Grid } from "@mui/material";
import "./dayrow.css";

const statusColorMap = {
  Present: "#4CAF50",
  Absent: "#f44336",
  Leave: "#ff9800",
  "On Duty": "#2196f3",
  Holiday: "#9e9e9e",
};

const DayRow = ({
  day,
  date,
  status,
  checkIn,
  checkOut,
  hoursWorked,
  comment
}) => {
  const statusColor = statusColorMap[status] || "#bdbdbd";

  return (
    <Card sx={{ padding: 2, marginBottom: 2, width:1100, marginLeft: 36, position: 'relative' }}>
      {/* Dotted blue vertical line centered */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 12,
        bottom: 12,
        width: 3,
        background: 'repeating-linear-gradient(to bottom, #2196f3, #2196f3 6px, transparent 6px, transparent 12px)',
        zIndex: 1,
        borderRadius: 2,
        transform: 'translateX(-50%)'
      }} />
      <Grid container alignItems="center">
        {/* Day and Date */}
        <Grid item xs={12} md={1}>
          <SoftTypography variant="button" fontWeight="bold">
            {day} {date}
          </SoftTypography>
        </Grid>

        {/* Status Timeline (colored line) */}
        <Grid item xs={12} md={8}>
          <SoftBox height="6px" borderRadius="xl" mb={1} bgColor="#e0e0e0">
            <SoftBox
              height="100%"
              width="100%"
              borderRadius="xl"
              sx={{ backgroundColor: statusColor }}
            />
          </SoftBox>
          <SoftTypography variant="caption" color="text" fontWeight="regular">
            {comment}
          </SoftTypography>
        </Grid>

        {/* Check-in */}
        <Grid item xs={6} md={1}>
          <SoftTypography variant="caption" color="success">
            IN: {checkIn || "--"}
          </SoftTypography>
        </Grid>

        {/* Check-out */}
        <Grid item xs={6} md={1}>
          <SoftTypography variant="caption" color="error">
            OUT: {checkOut || "--"}
          </SoftTypography>
        </Grid>

        {/* Total Hours */}
        <Grid item xs={12} md={1}>
          <SoftTypography variant="caption" color="dark" fontWeight="medium">
            {hoursWorked || "--"}
          </SoftTypography>
        </Grid>
      </Grid>
    </Card>
  );
};

DayRow.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  hoursWorked: PropTypes.string,
  comment: PropTypes.string
};

DayRow.defaultProps = {
  checkIn: "--",
  checkOut: "--",
  hoursWorked: "--",
  comment: ""
};

export default DayRow;
