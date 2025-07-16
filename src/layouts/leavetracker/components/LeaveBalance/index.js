import React from "react";
import { useState } from "react";
import { Card, Grid, Box } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import ApplyLeaveForm from "../applyleaveform";
import Drawer from "@mui/material/Drawer";
import LeaveRecord from "../leaverecord";

const leaveData = [
  {
    type: "Casual Leave",
    icon: "beach_access",
    backgroundColor: "#c0e2feff",
    textColor: "#007BFF",
    available: "11",
    booked: "1",
    canApply: true,
    height: "35",
    width: "35",
  },
  {
    type: "Sick Leave",
    icon: "local_hospital",
    backgroundColor: "#c8fab0ff",
    textColor: "#67C23A",
    available: "12",
    booked: "0",
    canApply: true,
    height: "35",
    width: "35",
  },
  {
    type: "Paternity Leave",
    icon: "child_friendly",
    backgroundColor: "#fdbed3ff",
    // textColor: "#F39C12",
    textColor: "#ec407a",
    available: "0",
    booked: "0",
    canApply: true,
    height: "35",
    width: "35",
  },
  {
    type: "Maternity Leave",
    icon: "pregnant_woman",
    backgroundColor: "#f9e0bbff",
    textColor: "#F2C037",
    available: "0",
    booked: "0",
    canApply: true,
    height: "35",
    width: "35",
  },
  {
    type: "Negative Leave",
    icon: "warning",
    backgroundColor: "#f2d1ffff",
    textColor: "#9B59B6",
    available: "12",
    booked: "0",
    canApply: true,
    height: "35",
    width: "35",
  },
];

function LeavaBalance() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  return (
    <SoftBox p={3}>
      {leaveData.map((leave, index) => (
        <Card
          key={index}
          sx={{ mb: 2, borderRadius: 3 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}

        >
          <Grid container alignItems="center" p={2} spacing={2}>
            {/* Icon */}
            <Grid item xs={2} sm={1}>
              <SoftBox
                width="40px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                sx={{ backgroundColor: leave.backgroundColor }}
              >
                <Icon sx={{ color: leave.textColor }}>{leave.icon}</Icon>
              </SoftBox>
            </Grid>

            {/* Leave Type */}
            <Grid item xs={10} sm={3}>
              <SoftTypography variant="h6">{leave.type}</SoftTypography>
            </Grid>

            {/* Available */}
            <Grid item xs={6} sm={2}>
              <SoftTypography variant="button" color="text" fontWeight="bold">
                Available
              </SoftTypography>
              <SoftTypography variant="h6" color="success" fontWeight="medium">
                {leave.available} {leave.available === "1" ? "day" : "days"}
              </SoftTypography>
            </Grid>

            {/* Booked */}
            <Grid item xs={6} sm={2}>
              <SoftTypography variant="button" color="text" fontWeight="bold">
                Booked
              </SoftTypography>
              <SoftTypography variant="h6" color="dark">
                {leave.booked} {leave.booked === "1" ? "day" : "days"}
              </SoftTypography>
            </Grid>
            <Grid item xs={12} sm={3} textAlign="right">
              {leave.canApply && hoveredIndex === index && (
                <SoftButton
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={() => {
                    setSelectedLeaveType(leave.type);
                    setDrawerOpen(true);
                  }}
                >
                  Apply Leave
                </SoftButton>

              )}
            </Grid>
          </Grid>

        </Card>
      ))}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        hideBackdrop={true}
        PaperProps={{
          // sx: { width: 850, maxWidth: 1200 },
          sx: { width: 1200 }
        }}

      >
        <Box p={3} display="flex" flexDirection="row">
          <ApplyLeaveForm selectedLeaveType={selectedLeaveType} onClick={() => {
            setSelectedLeaveType(leave.type);
            setDrawerOpen(false);
          }}
            handleClose={() => setDrawerOpen(false)}
            onDateChange={(date) => setSelectedDate(date)}
            minWidth="950px"
          />
          {selectedDate && (
            <Box  sx={{ flex: 1.5 }}>
              <LeaveRecord selectedDate={selectedDate} />
            </Box>
          )}
        </Box>
      </Drawer>
    </SoftBox>
  );
}

export default LeavaBalance;

