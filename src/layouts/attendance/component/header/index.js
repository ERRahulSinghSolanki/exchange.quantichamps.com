import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Card, Grid, Menu, MenuItem, Tooltip } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import CalendarRoot from "examples/Calendar/CalendarRoot";

// Format: 20–27 Apr 2025
const formatCompactDateRange = (range) => {
  if (!range?.start || !range?.end) return "--";

  const start = new Date(range.start);
  const end = new Date(range.end);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[end.getMonth()];
  const year = end.getFullYear();

  return `${startDay}–${endDay} ${month} ${year}`;
};

const Header = ({
  activeTab,
  onTabChange,
  dateRange,
  onPrev,
  onNext,
  shiftName,
  shiftTime,
  checkOutNote,
  setCheckOutNote,
  checkOutTimer, // This prop will be ignored in favor of local timer
  activeView,
  setActiveView,
  activeDataTab,
  setActiveDataTab
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const timerRef = useRef();

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Format timer as HH:MM:SS
  const formatTimer = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };
// edit icons color and size
  const iconStyle = (view) => ({
    color: activeView === view ? "info.main" : "#FFFFFF",
    cursor: "pointer",
    fontSize: "1.4rem",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "info.contrastText",
      transform: "scale(1.1)",
    },
  });

const dataTabStyle = (tab) => ({
  backgroundColor: activeDataTab === tab ? "#ffffff33" : "transparent",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "20px",
  padding: "6px 16px",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
});

const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));


  // Show header section for all views, including tabular

  return (
    
    <Card sx={{ padding: 2, marginBottom: 2 ,boxShadow:3}}>

      <Box
        sx={{
         background: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1.5,
          borderRadius: "12px",
  }}
>
  {/* Left Tabs */}
  <Box display="flex" gap={2}>
    <SoftTypography
      variant="button"
      sx={dataTabStyle("mydata")}
      onClick={() => setActiveDataTab("mydata")}
    >
      My Data
    </SoftTypography>
    <SoftTypography
      variant="button"
      sx={dataTabStyle("team")}
      onClick={() => setActiveDataTab("team")}
    >
      Team
    </SoftTypography>
  </Box>

  {/* Right Icon Box */}
  {activeTab !=="shift" && (
  <Box
    sx={{
      // backgroundColor: "#C65C69",
      // padding: "8px",
      borderRadius: "10px",
      padding: "8px 12px",
// borderRadius: "12px",
boxShadow: "0px 2px 6px rgba(22, 20, 20, 0.05)",
      display: "flex",
      gap: 1,
    }}
  >
    <Tooltip title="List View" arrow placement="top">
      <Icon sx={iconStyle("list")} onClick={() => setActiveView("list")}>
        view_module
      </Icon>
    </Tooltip>
    <Tooltip title="Tabular View" arrow placement="top">
      <Icon sx={iconStyle("tabular")} onClick={() => setActiveView("tabular")}>
        view_stream
      </Icon>
    </Tooltip>
    <Tooltip title="Calendar View" arrow placement="top">
      <Icon
        // sx={{
        //   color: activeView === "calendar" ? "info.main" : "#344767",
        //   cursor: "pointer",
        // }}
        sx={iconStyle("calendar")}
        onClick={() => setActiveView("calendar")}
      >
        calendar_month
      </Icon>
    </Tooltip>
    <Tooltip title="Filter Options" arrow placement="top">
      <Icon
        // sx={{
        //   color: activeView === "filter" ? "info.main" : "#344767",
        //   cursor: "pointer",
        // }}
        sx={iconStyle("filter")}
        onClick={() => setActiveView("list")}
      >
        filter_list
      </Icon>
    </Tooltip>
    <Tooltip title="More" arrow placement="top">
      <Icon
        // sx={{
        //   color: activeView === "more" ? "info.main" : "#344767",
        //   cursor: "pointer",
        // }}
        sx={iconStyle("more")}
        onClick={handleMoreClick}
      >
        more_horiz
      </Icon>
    </Tooltip>

    <Menu
      anchorEl={anchorEl}
      open={openMore}
      onClose={handleMoreClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem onClick={handleMoreClose}>
        <Icon sx={{ mr: 1 }}>download</Icon> Import
      </MenuItem>
      <MenuItem onClick={handleMoreClose}>
        <Icon sx={{ mr: 1 }}>upload</Icon> Export
      </MenuItem>
      <MenuItem onClick={handleMoreClose}>
        <Icon sx={{ mr: 1 }}>visibility</Icon> Audit History
      </MenuItem>
    </Menu>
  </Box>
  )}
</Box>

 {activeDataTab === "mydata" && (
        <>
        
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={12} md={6}>
          <SoftBox display="flex" alignItems="center" gap={2}>
            <SoftTypography
              variant="button"
              fontWeight={activeTab === "summary" ? "bold" : "regular"}
              color={activeTab === "summary" ? "info" : "text"}
              sx={{ cursor: "pointer" }}
              onClick={() => onTabChange("summary")}
            >
              Attendance Summary
            </SoftTypography>
            <SoftTypography
              variant="button"
              fontWeight={activeTab === "shift" ? "bold" : "regular"}
              color={activeTab === "shift" ? "info" : "text"}
              sx={{ cursor: "pointer" }}
              onClick={() => onTabChange("shift")}
            >
              Shift
            </SoftTypography>
          </SoftBox>
        </Grid>

      
        
      </Grid>

      {/* Shift Info & Notes */}
     
{/* new added */}

<Grid container spacing={2} mt={3} alignItems="center">
  {/* 1. Shift Info */}
  <Grid item xs={12} md={3}>
    <SoftBox
      sx={{
        backgroundColor: "#f0f2f5",
        padding: "10px 16px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        width: "100%",
        whiteSpace: "nowrap", // Prevent text wrapping
        overflow: "hidden",
        textOverflow: "ellipsis",
        gap: 1,
      }}
    >
      <AccessTimeIcon sx={{ color: "#344767", fontSize: "20px" }} />
      <SoftTypography variant="button" fontWeight="bold" color="dark">
        {shiftName} &nbsp; [ {shiftTime} ]
      </SoftTypography>
    </SoftBox>
  </Grid>

  {/* 2. Check-in Notes */}
  <Grid item xs={12} md={3}>
    <SoftInput
      placeholder="Add notes for check-in"
      value={checkOutNote}
      onChange={(e) => setCheckOutNote(e.target.value)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "10px 12px",
        fontSize: "14px",
        border: "1px solid #dcdcdc",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        "::placeholder": {
          color: "#a0a0a0",
          fontStyle: "italic",
        },
        width: "100%",
      }}
    />
  </Grid>

  {/* 3. Date Range Selector - Single Line */}
  <Grid item xs={12} md={3}>
    <SoftBox
      sx={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #dcdcdc",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        gap: 1.5,
        whiteSpace: "nowrap", // Prevent multi-line
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Icon sx={{ cursor: "pointer" }} onClick={onPrev}>
        chevron_left
      </Icon>
      <Icon
        sx={{ color: "#344767", cursor: "pointer" }}
        onClick={() => setCalendarOpen(true)}
      >
        calendar_month
      </Icon>
     {/* <SoftTypography
  variant="button"
  fontWeight="medium"
  color="dark"
  sx={{
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "visible",         
        textOverflow: "unset",     
    minWidth: "180px",       
    flexShrink: 0,
  }}
>
  {(dateRange?.start || "--")} - {(dateRange?.end || "--")}
</SoftTypography> */}
{/** Responsive & Tooltip-enhanced text */}
    <Tooltip
      title={`${dateRange?.start || "--"} - ${dateRange?.end || "--"}`}
      arrow
      placement="top"
    >
      <SoftTypography
        variant="button"
        fontWeight="medium"
        color="dark"
        sx={{
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: isTablet ? "120px" : "160px",
          flex: 1,
        }}
      >
        {formatCompactDateRange(dateRange)}
      </SoftTypography>
    </Tooltip>
  


      <Icon sx={{ cursor: "pointer" }} onClick={onNext}>
        chevron_right
      </Icon>
    </SoftBox>
  </Grid>

  {/* 4. Checkout Timer */}
  <Grid item xs={12} md={3}>
    <SoftBox
      sx={{
        backgroundColor: "#f44336",
        color: "#fff",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 16px",
        width: "100%",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      <SoftBox>
        <SoftTypography
          variant="caption"
          fontWeight="medium"
          color="white"
          sx={{ opacity: 0.9 }}
        >
          Check-out
        </SoftTypography>
        <SoftTypography variant="h6" fontWeight="bold" color="white">
          {formatTimer(timer)} Hrs
        </SoftTypography>
      </SoftBox>
      <SoftBox
        sx={{
          backgroundColor: "#fff",
          color: "#f44336",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: 2,
        }}
      >
        <AccessTimeIcon fontSize="small" />
      </SoftBox>
    </SoftBox>
  </Grid>
</Grid>

      {/* Calendar Modal */}
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
       </>
)}
    </Card>

  );
};

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  shiftName: PropTypes.string.isRequired,
  shiftTime: PropTypes.string.isRequired,
  checkOutNote: PropTypes.string.isRequired,
  setCheckOutNote: PropTypes.func.isRequired,
  checkOutTimer: PropTypes.string.isRequired,
  activeView: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
  activeDataTab: PropTypes.string.isRequired,
  setActiveDataTab: PropTypes.func.isRequired,
};

Header.defaultProps = {
  activeView: "list",
  setActiveView: () => {},
};

export default Header;
