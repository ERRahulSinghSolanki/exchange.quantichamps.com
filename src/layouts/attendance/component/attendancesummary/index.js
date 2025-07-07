

import React, { useState, useEffect, useRef } from "react";
import { Card, Grid } from "@mui/material";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Header from "layouts/attendance/component/header";
import DayRow from "layouts/attendance/component/dayrow";
import AttendanceLegend from "layouts/attendance/component/attendancelegend";
// import ShiftSchedule from "layouts/attendance/component/shiftview";
import SoftBox from "components/SoftBox";
// import OrderList from "layouts/ecommerce/orders/order-list";
import CalendarRoot from "examples/Calendar/CalendarRoot"; 
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/ecommerce/orders/order-list/data/dataTableData";
import SummarySection from "layouts/attendance/component/summarysection";
import "./attendancesummary.css";

const mockAttendanceData = [
  { day: "Sun", date: "21", status: "Absent", checkIn: "", checkOut: "", lateBy: "01:15", hoursWorked: "00:00", comment: "Absent" },
  { day: "Mon", date: "22", status: "Absent", checkIn: "", checkOut: "", lateBy: "", hoursWorked: "00:00", comment: "Absent" },
  { day: "Tue", date: "23", status: "Casual Leave", checkIn: "", checkOut: "", lateBy: "", hoursWorked: "00:00", comment: "Casual Leave" },
  { day: "Wed", date: "24", status: "Casual Leave", checkIn: "", checkOut: "", lateBy: "", hoursWorked: "00:00", comment: "Casual Leave" },
  { day: "Thu", date: "25", status: "Present", checkIn: "04:40 PM", checkOut: "10:44 PM", lateBy: "07:40", hoursWorked: "06:04", comment: "0.5 day Present, 0.5 day Absent" },
  { day: "Fri", date: "26", status: "Absent", checkIn: "10:15 AM", checkOut: "", lateBy: "01:15", hoursWorked: "00:00", comment: "Absent" },
  { day: "Sat", date: "27", status: "Present", checkIn: "10:15 AM", checkOut: "", lateBy: "01:15", hoursWorked: "00:00", comment: "Present" },
];


function AttendanceSummary() {
  const [checkOutNote, setCheckOutNote] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [activeView, setActiveView] = useState("list");
  const [dateRange, setDateRange] = useState({
    start: "20-Apr-2025",
    end: "27-Apr-2025",
  });

  // Timer logic and clock rotation
  const [timer, setTimer] = useState(0); // seconds
  const [clockDeg, setClockDeg] = useState(0);
  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
      setClockDeg((prev) => (prev + 6) % 360); // 6deg per second for smooth rotation
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  const formatTimer = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Attendance summary counts
  const absentCount = mockAttendanceData.filter((d) => d.status.toLowerCase() === "absent").length;
  const presentCount = mockAttendanceData.filter((d) => d.status.toLowerCase() === "present").length;
  const weekendCount = mockAttendanceData.filter((d) => d.day.toLowerCase() === "sat" || d.day.toLowerCase() === "sun").length;
  const leaveCount = mockAttendanceData.filter((d) => d.status.toLowerCase().includes("leave")).length;

  const timeSlots = ["09AM", "10AM", "11AM", "12PM", "01PM", "02PM", "03PM", "04PM", "05PM", "06PM"];

  return (
    <Card sx={{ padding: 3 }}>
      {/* Attendance summary stats */}
      <Grid container spacing={2} mb={2} justifyContent="flex-end">
        <Grid item>
          <SoftBox sx={{ background: "#4caf50", color: "#fff", borderRadius: 2, px: 2, py: 0.5, minWidth: 80, minHeight: 50, maxWidth: 100, maxHeight: 60, textAlign: "center", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Present</div>
            <div style={{ fontSize: 14 }}>{presentCount}</div>
          </SoftBox>
        </Grid>
        <Grid item>
          <SoftBox sx={{ background: "#f44336", color: "#fff", borderRadius: 2, px: 2, py: 0.5, minWidth: 80, minHeight: 50, maxWidth: 100, maxHeight: 60, textAlign: "center", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Absent</div>
            <div style={{ fontSize: 14 }}>{absentCount}</div>
          </SoftBox>
        </Grid>
        <Grid item>
          <SoftBox sx={{ background: "#2196f3", color: "#fff", borderRadius: 2, px: 2, py: 0.5, minWidth: 80, textAlign: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Weekend</div>
            <div style={{ fontSize: 14 }}>{weekendCount}</div>
          </SoftBox>
        </Grid>
        <Grid item>
          <SoftBox sx={{ background: "#ff9800", color: "#fff", borderRadius: 2, px: 2, py: 0.5, minWidth: 80, textAlign: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Leave</div>
            <div style={{ fontSize: 14 }}>{leaveCount}</div>
          </SoftBox>
        </Grid>
      </Grid>

      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange={dateRange}
        onPrev={() => {}}
        onNext={() => {}}
        shiftName="General"
        shiftTime="9:00 AM - 6:00 PM"
        checkOutNote={checkOutNote}
        setCheckOutNote={setCheckOutNote}
        checkOutTimer={formatTimer(timer)}
        activeView={activeView}
        setActiveView={setActiveView}
      />


      {/* List View */}
      {activeTab === "summary" && activeView === "list" && (
        <>
          {mockAttendanceData.map((item, index) => (
            <DayRow key={index} {...item} />
          ))}

          <SoftBox className="time-scale" mt={2} mb={2} px={2}>
            <Grid container spacing={1}>
              {timeSlots.map((slot, index) => (
                <Grid item xs={1} key={index} textAlign="center">
                  <span style={{ fontSize: "0.75rem", color: "#555" }}>{slot}</span>
                </Grid>
              ))}
            </Grid>
          </SoftBox>

          <SoftBox mb={3}>
            <AttendanceLegend />
          </SoftBox>
        </>
      )}

      {/* Tabular View */}
      {activeTab === "summary" && activeView === "tabular" && (
        <SoftBox mt={3}>
         <DataTable table={dataTableData} entriesPerPage={false}  />
        </SoftBox>
      )}

      {/* Calendar View */}
      {activeTab === "summary" && activeView === "calendar" && (
        <SoftBox mt={3} mb={4}>
          <CalendarRoot>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={[]}
              height="auto"
            />
          </CalendarRoot>
        </SoftBox>
      )}
      <SummarySection />
    </Card>
    
  );
}

export default AttendanceSummary;
