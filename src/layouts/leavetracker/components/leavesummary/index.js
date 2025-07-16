import React, { useState } from "react";
import {
  Card,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import WarningIcon from "@mui/icons-material/Warning";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SoftSelect from "components/SoftSelect";
import SoftInput from "components/SoftInput";
import FormField from "layouts/pages/account/components/FormField";
import ApplyLeaveForm from "../applyleaveform";
import LeavaBalance from "../LeaveBalance";
import { ChildFriendly } from "@mui/icons-material";
import LeaveRequest from "../leaverequest";



function LeaveSummary() {

  const [calendarOpen, setCalendarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedLeaveType, setSelectedLeaveType] = useState(null);



  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [pastLeaves, setPastLeaves] = useState([
    {
      date: "02-Jul-2025",
      type: "Casual Leave",
      duration: "1 day",
    },
  ]);

  const selectData = {
    upcomingholidays: [{ value: "upcoming-holidays", label: "Upcoming Holidays" },
    { value: "upcoming-leave", label: "Upcoming Leaves" },
    { value: "upcoming-leave & holidays", label: "Upcoming Leaves & Holidays" },],

    pastholidays: [{ value: "past-holidays", label: "Past Holidays" },
    { value: "past-leave", label: "Past Leaves" },
    { value: "past-leave & holidays", label: "Past Leaves & Holidays" },],
  }


  const leaveTypes = [
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

  const leaveCards = leaveTypes.map((leave) => (
    <Grid item xs={12} sm={6} md={2.4} key={leave.type}>
      <Card style={{ padding: 16, textAlign: "center", backgroundColor: "white", display: "flex", cursor: "pointer", border: "1px solid #e0e0e0" }}
       onClick={() => {
        setSelectedLeaveType(leave.type);
        setDrawerOpen(true);
      }}>
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
    </Grid>
  ));


  const leaveItem = (
    <Card sx={{ p: 2, mb: 2 }}>
      <Typography variant="body2" fontWeight="bold" color="text">
        02-Jul-2025, Wed
      </Typography>
      <Typography variant="body2" color="blue">
        Casual Leave · 1 day
      </Typography>
    </Card>
  );

  const renderLeaveCard = (leave) => (
    <Box
      key={leave.date}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="white"
      p={2}
      borderRadius="md"
      mb={1}
      border="1px solid #e0e0e0"
    // boxShadow={1}
    >
      <Typography variant="body2" fontWeight="bold">
        {leave.date}, Wed
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <Box width={10} height={10} borderRadius="50%" bgcolor="#4285f4" />
        <Typography variant="body2" color="textPrimary">
          {leave.type}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          · {leave.duration}
        </Typography>
      </Box>
    </Box>
  );

  const renderNoData = () => (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={200}
      border="1px solid #eee"
      borderRadius="10px"
      bgcolor="white"
    >
      <Typography variant="body2" color="textSecondary">
        No Data Found
      </Typography>
    </Box>
  );

  const renderLeaveBalance = () => (
    <Card sx={{ p: 3, mt: 2 }}>
      <LeavaBalance />
    </Card>
  );

  const renderLeaveRequests = () => (
    <LeaveRequest />
  );

  const renderShift = () => (
    <Card sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Shift
      </Typography>
      {renderNoData()}
    </Card>
  );

  const tabStyles = (index) => ({
    fontWeight: activeTab === index ? "bold" : "normal",
    color: activeTab === index ? "#1976d2" : "inherit",
    textTransform: "none",
  });
  const renderLeaveSummary = () => (
    <Card sx={{ p: 3 }}>
      <SoftTypography variant="body2" color="text">
        Leave booked this year : <b>0</b> | Absent : <b>0</b>
      </SoftTypography>

      <Box mt={1} display="flex" alignItems="center" justifyContent="right">
        <SoftTypography mr={45}>01-Jan-2025 - 31-Dec-2025</SoftTypography>
        <IconButton onClick={() => setCalendarOpen(true)}>
          <CalendarMonthIcon />
        </IconButton>
        <Modal
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          aria-labelledby="calendar-modal-title"
          aria-describedby="calendar-modal-description"
        >
          <Box sx={{ width: '50%', height: '90%', margin: 'auto', mt: 5, bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={[
                { title: 'Event 1', date: '2025-01-01' },
                { title: 'Event 2', date: '2025-01-07' }
              ]}
            />
          </Box>
        </Modal>
        <Box>
          <SoftButton variant="gradient" color="info" size="small" onClick={() => setDrawerOpen(true)}>
            Apply Leave
          </SoftButton>
        </Box>
      </Box>
      <Grid container spacing={2} mt={2}>
        {leaveCards}
      </Grid>
      <Grid item xs={12} md={4} border={1} borderColor="divider" p={2} mt={5} mb={5} borderRadius={2}>
        <SoftSelect placeholder="Upcoming Leave & Holidays" options={selectData.upcomingholidays} />
        <Box mt={2}>
          {upcomingLeaves.length === 0 ? renderNoData() : upcomingLeaves.map(renderLeaveCard)}
        </Box>
      </Grid>
      <Grid item xs={12} md={4} border={1} borderColor="divider" p={2} mb={5} borderRadius={2}>
        <SoftSelect placeholder="Past Leave & Holidays" options={selectData.pastholidays} />
        <Box mt={4}>
          <Box mt={2}>
            {pastLeaves.length === 0 ? renderNoData() : pastLeaves.map(renderLeaveCard)}
          </Box>
        </Box>
      </Grid>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
      PaperProps={{
    sx: { width: 850, maxWidth: 1200 }, 
  }}
  
  >
        <Box p={3} width="850px">
         
           <ApplyLeaveForm selectedLeaveType={selectedLeaveType} 
           handleClose={() => setDrawerOpen(false)}/>
        </Box>
      </Drawer>
    </Card>

  );

  return (

    <DashboardLayout>
      <SoftBox py={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Leave Summary" sx={tabStyles(0)} />
            <Tab label="Leave Balance" sx={tabStyles(1)} />
            <Tab label="Leave Requests" sx={tabStyles(2)} />
            <Tab label="Shift" sx={tabStyles(3)} />
          </Tabs>
        </Box>

        {activeTab === 0 && renderLeaveSummary()}
        {activeTab === 1 && renderLeaveBalance()}
        {activeTab === 2 && renderLeaveRequests()}
        {activeTab === 3 && renderShift()}

      </SoftBox>
    </DashboardLayout>
  );
}

export default LeaveSummary;
