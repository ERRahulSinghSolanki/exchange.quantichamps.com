import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Card, Grid, Menu, MenuItem, Tooltip } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import CalendarRoot from "examples/Calendar/CalendarRoot";
import { Opacity } from "@mui/icons-material";

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
// const [activeDataTab, setActiveDataTab] = useState("mydata");//added new

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

  const iconStyle = (view) => ({
    color: activeView === view ? "info.main" : "#344767",
    cursor: "pointer",
  });
//added new myTeam and myData added new
 const dataTabStyle = (tab) => ({
    color: activeDataTab === tab ? "#ffffff" : "#ffffffcc",
    fontWeight: activeDataTab === tab ? "bold" : "regular",
    cursor: "pointer",
    marginRight: "24px",
    paddingBottom: "6px",
    borderBottom: activeDataTab === tab ? "3px solid #2196f3" : "3px solid transparent",
  });


  // Show header section for all views, including tabular

  return (
    
    <Card sx={{ padding: 2, marginBottom: 2 }}>
      {/* Tabs */}
      {/* <Box sx={{ backgroundColor: "#F08080", display: "flex", padding: "8px 20px", borderRadius: "8px 8px 0 0" }}>
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
</Box> */}

<Box
  sx={{
    backgroundColor: "#F08080",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 20px",
    borderRadius: "8px 8px 0 0",
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
  <Box
    sx={{
      // backgroundColor: "#C65C69",/
      padding: "8px",
      borderRadius: "10px",
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
        sx={{
          color: activeView === "calendar" ? "info.main" : "#344767",
          cursor: "pointer",
        }}
        onClick={() => setActiveView("calendar")}
      >
        calendar_month
      </Icon>
    </Tooltip>
    <Tooltip title="Filter Options" arrow placement="top">
      <Icon
        sx={{
          color: activeView === "filter" ? "info.main" : "#344767",
          cursor: "pointer",
        }}
        onClick={() => setActiveView("list")}
      >
        filter_list
      </Icon>
    </Tooltip>
    <Tooltip title="More" arrow placement="top">
      <Icon
        sx={{
          color: activeView === "more" ? "info.main" : "#344767",
          cursor: "pointer",
        }}
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

      
        {/* <Grid item xs={12} md={6}>
          <SoftBox display="flex" justifyContent="flex-end" gap={2}>
            <Box
              sx={{
                backgroundColor: "#f0f2f5",
                padding: "8px",
                borderRadius: "10px",
                display: "flex",
                gap: 1,
              }}
            >
              <Tooltip title="List View" arrow placement="top">
                </Tooltip>
              <Tooltip title="List View" arrow placement="top">
                <Icon sx={iconStyle("list")} onClick={() => setActiveView("list")}>view_module</Icon>
              </Tooltip>
              <Tooltip title="Tabular View" arrow placement="top">
                <Icon sx={iconStyle("tabular")} onClick={() => setActiveView("tabular")}>view_stream</Icon>
                
              </Tooltip>
              <Tooltip title="Calendar View" arrow placement="top">
                <Icon sx={{ color: activeView === "calendar" ? "info.main" : "#344767", cursor: "pointer" }} onClick={() => setActiveView("calendar")}>calendar_month</Icon>
              </Tooltip>
              <Tooltip title="Filter Options" arrow placement="top">
                <Icon sx={{ color: activeView === "filter" ? "info.main" : "#344767", cursor: "pointer" }} onClick={() => setActiveView( "list" )}>filter_list</Icon>
              </Tooltip>
              <Tooltip title="More" arrow placement="top">
                <Icon sx={{ color: activeView === "more" ? "info.main" : "#344767", cursor: "pointer" }} onClick={handleMoreClick}>more_horiz</Icon>
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
          </SoftBox>
        </Grid> */}
      </Grid>

      {/* Shift Info & Notes */}
     

      <Grid container spacing={2} mt={3} alignItems="center">
  {/* Row 1: Shift + Input */}
  <Grid item xs={12} md={3}>
    <SoftTypography
      variant="button"
      fontWeight="bold"
      color="dark"
      sx={{ whiteSpace: "nowrap" }}
    >
      {shiftName} [ {shiftTime} ]
    </SoftTypography>
  </Grid>

  <Grid item xs={12} md={3}>
    {/* <SoftBox display="flex" justifyContent="flex-start"> */}
      <SoftInput
        placeholder="Add notes for check-in"
        value={checkOutNote}
        onChange={(e) => setCheckOutNote(e.target.value)}
        fullWidth
        sx={{
          backgroundColor: "#fff",
          borderRadius: "5px",
          padding: "6px 10px",
          fontSize: "14px",
          border: "1px solid #dcdcdc",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          "::placeholder": {
            color: "#b0b0b0",
            fontStyle: "italic",
            marginLeft:"10px"
          },
          // width: "100%",
          // maxWidth: "400px",
        }}
      />
    {/* </SoftBox> */}
  </Grid>

  {/* Row 2: Calendar + Timer side by side */}
  <Grid item xs={12} md={3}>
    {/* <SoftBox
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
    > */}
      {/* Calendar Navigation Centered on Left */}
      {/* <SoftBox display="flex" alignItems="center" gap={2} marginLeft= "600px">
        <Icon sx={{ cursor: "pointer",  marginRight: "1px" }} onClick={onPrev}>
          chevron_left
        </Icon> */}

        <SoftBox
          sx={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 1,
             justifyContent: "center",
        border: "1px solid #dcdcdc",
            // marginRight: "20px"
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
          <SoftTypography variant="button" fontWeight="medium" color="dark">
            {(dateRange?.start || "--")} - {(dateRange?.end || "--")}
          </SoftTypography>
        {/* </SoftBox> */}

        <Icon sx={{ cursor: "pointer" , marginRight: "12px"}} onClick={onNext}>
          chevron_right
        </Icon>
      </SoftBox>
      </Grid>

      {/* Check-out Timer Right-Aligned */}
      <SoftBox
        sx={{
          backgroundColor: "#f44336",
          color: "#fff",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 14px",
          width: "fit-content",
          marginLeft:"110px"
        }}
      >
        <div style={{ textAlign: "left", lineHeight: "1.3", fontSize: "14px" }}>
          Check-out <br />
          <span style={{ fontSize: "16px" }}>{formatTimer(timer)} Hrs</span>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            color: "#f44336",
            borderRadius: "50%",
            width: "26px",
            height: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "10px",
          }}
        >
          <AccessTimeIcon style={{ fontSize: "16px" }} />
        </div>
      </SoftBox>
    {/* </SoftBox> */}
  </Grid>
{/* </Grid> */}


      {/* Checkout Timer */}
      {/* <SoftBox
        sx={{
          backgroundColor: "#f44336",
          color: "#fff",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          marginLeft: "auto",
          marginTop: 2,
          width: "fit-content",
        }}
      >
        <div style={{ textAlign: "left", lineHeight: "1.3", fontSize: "14px" }}>
          Check-out <br />
          <span style={{ fontSize: "16px" }}>{formatTimer(timer)} Hrs</span>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            color: "#f44336",
            borderRadius: "50%",
            width: "26px",
            height: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "30px",
          }}
        >
          <AccessTimeIcon style={{ fontSize: "16px" }} />
        </div>
      </SoftBox> */}

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
