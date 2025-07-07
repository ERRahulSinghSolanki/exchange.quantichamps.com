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
// import calendarEventsData from "layouts/applications/calendar/data/calendarEventsData";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import CalendarRoot from "examples/Calendar/CalendarRoot";

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
  setActiveView
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

  const iconStyle = (view) => ({
    color: activeView === view ? "info.main" : "#344767",
    cursor: "pointer",
  });

  // Show header section for all views, including tabular

  return (
    <Card sx={{ padding: 2, marginBottom: 3, marginLeft: 30 }}>
      {/* Tabs */}
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

        {/* View Icons */}
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>

      {/* Shift Info & Notes */}
      <Grid container mt={3} alignItems="center" spacing={2}>
        <Grid item xs={12} md={5}>
          <SoftTypography variant="button" fontWeight="bold">
            {shiftName} [ {shiftTime} ]
          </SoftTypography>
        </Grid>

        <Grid item xs={12} md={5}>
          <SoftInput
            placeholder="Add notes for check-out"
            value={checkOutNote}
            onChange={(e) => setCheckOutNote(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "14px",
              border: "1px solid #ced4da",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            }}
          />

          {/* Date Navigation */}
          <SoftBox display="flex" alignItems="center" gap={2} mt={2}>
            <Icon sx={{ cursor: "pointer" }} onClick={onPrev}>
              chevron_left
            </Icon>

            <SoftBox
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Icon
                sx={{ color: "#344767", cursor: "pointer" }}
                onClick={() => setCalendarOpen(true)}
              >
                calendar_month
              </Icon>
              <SoftTypography variant="button" fontWeight="medium" color="dark">
                {(dateRange?.start || "--")} - {(dateRange?.end || "--")}
              </SoftTypography>
            </SoftBox>

            <Icon sx={{ cursor: "pointer" }} onClick={onNext}>
              chevron_right
            </Icon>
          </SoftBox>
        </Grid>
      </Grid>

      {/* Checkout Timer */}
      <SoftBox
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
      </SoftBox>

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
};

Header.defaultProps = {
  activeView: "list",
  setActiveView: () => {},
};

export default Header;
