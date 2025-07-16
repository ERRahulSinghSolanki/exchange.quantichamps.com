import React, { useState } from "react";
import { Card, Grid, Box, Drawer, Typography } from "@mui/material";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import ApplyLeaveForm from "../applyleaveform";
import LeaveRecord from "../leaverecord";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import WarningIcon from "@mui/icons-material/Warning";
import { ChildFriendly } from "@mui/icons-material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";


  const leaveData = [
    {
      type: "Casual Leave",
      available: 12,
      booked: 0,
      color: "#e3f2fd",
      icon: <BeachAccessIcon sx={{ color: "#2196f3", fontSize: 20, padding: "10px", backgroundColor: "#c0e2feff", height: 40, width: 40, borderRadius: "8px" }} />
    },
    {
      type: "Sick Leave",
      available: 8,
      booked: 0,
      color: "#e8f5e9",
      icon: <LocalHospitalIcon sx={{ color: "#67C23A", fontSize: 20, padding: "10px", backgroundColor: "#c8fab0ff", height: 40, width: 40, borderRadius: "8px" }} />
    },
    {
      type: "Paternity Leave",
      available: 7,
      booked: 0,
      color: "#fce4ec",
      icon: <ChildFriendly sx={{ color: "#ec407a", fontSize: 20, padding: "10px", backgroundColor: "#fdbed3ff", height: 40, width: 40, borderRadius: "8px" }} />
    },
    {
      type: "Maternity Leave",
      available: 0,
      booked: 0,
      color: "#fff3e0",
      icon: <PregnantWomanIcon sx={{ color: "#ffa726", fontSize: 20, padding: "10px", backgroundColor: "#f9e0bbff", height: 40, width: 40, borderRadius: "8px" }} />
    },
    {
      type: "Negative Leave",
      available: 4,
      booked: 0,
      color: "#ffffe0",
      icon: <WarningIcon sx={{ color: "#9B59B6", fontSize: 20, padding: "10px", backgroundColor: "#f2d1ffff", height: 40, width: 40, borderRadius: "8px" }} />
    },
  ];

function LeaveReport() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleApplyClick = (leaveType) => {
    setSelectedLeaveType(leaveType);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedDate(null);
  };

  return (
    <SoftBox p={1}>
      {leaveData.map((leave, index) => (
        <Card
          key={index}
          sx={{ mb: 2, borderRadius: 3 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ padding: 16, textAlign: "center", backgroundColor: "white", display: "flex", cursor: "pointer", border: "1px solid #e0e0e0", width: "400px", height: "180px"}}
        >
        <Box display="flex" justifyContent="center" alignItems="center" mb={1} borderRadius="20%"  >
          {leave.icon}
        </Box>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {leave.type}
        </Typography>
        <SoftBox display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2">Available</Typography>
          <Typography variant="h6" fontWeight="bold" justifyContent="end">{leave.available}</Typography>
        </SoftBox>
        <SoftBox display="flex" justifyContent="space-between">
          <Typography variant="body2">Booked</Typography>
          <Typography variant="h6" fontWeight="bold">{leave.booked}</Typography>
        </SoftBox>
        </Card>
      ))}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: "100%", maxWidth: 1200 },
        }}
      >
      </Drawer>
    </SoftBox>
  );
}

export default LeaveReport;
