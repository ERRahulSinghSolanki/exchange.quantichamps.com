

import React, { useState, useEffect, useRef } from "react";
import { Card, Grid , Avatar, Typography, Box, Icon, Slider} from "@mui/material";
import Header from "layouts/attendance/component/header";
import DayRow from "layouts/attendance/component/dayrow";
import SoftBox from "components/SoftBox";
import CalendarRoot from "examples/Calendar/CalendarRoot"; 

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DataTable from "examples/Tables/DataTable";
import dataTableData from "layouts/ecommerce/orders/order-list/data/dataTableData";
import Footer from "layouts/attendance/component/footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


const reportees = [
  {
    id: 1,
    name: "Lilly Williams",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Clarkson Walter",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Sophia Johnson",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  { id: 4,
    name: "Michael Brown",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Emma Wilson",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/women/5.jpg",   
  },
  {
    id: 6,  
    name: "James Smith",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM", 
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  { id: 7,
    name: "Olivia Taylor",    
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM", 
    weekend: true,
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {     
    id: 8,
    name: "Liam Anderson",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  { id: 9,
    name: "Ava Martinez",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/women/9.jpg", 
  },
  { id: 10,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

function AttendanceSummary() {
  const [checkOutNote, setCheckOutNote] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [activeView, setActiveView] = useState("list");
  const [activeDataTab, setActiveDataTab] = useState("mydata");
// useEffect(() => {
//     if (activeDataTab === "mydata") {
//       setActiveTab("summary");
//     }
//   }, [activeDataTab]);

 
    useEffect(() => {
    // Always set the tab to "summary" on mount (safe side)
    setActiveTab("summary");
  }, []);

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

 const [dateRange] = useState({
    start: "6-July-2025",
    end: "13-July-2025",
  });
  const timeSlots = ["09AM", "10AM", "11AM", "12PM", "01PM", "02PM", "03PM", "04PM", "05PM", "06PM"];
  const dummyEvents = [
    { title: "General", start: "2025-07-02T09:00:00", end: "2025-07-02T18:00:00" },
    { title: "Casual Leave", start: "2025-07-02" },
    { title: "General", start: "2025-07-06T09:00:00", end: "2025-07-06T18:00:00" },
    
  ];

  return (
 
  <DashboardLayout>
      <DashboardNavbar />
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        // dateRange={{ start: "2025-07-01", end: "2025-07-31" }}
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
         activeDataTab={activeDataTab}
        setActiveDataTab={setActiveDataTab}
        //  setCheckOutNote={() => {}}
        // checkOutTimer="00:00:00"
        // activeView="grid"
        // setActiveView={() => {}}
      />
 {/* ✅ Show reportee cards on Team tab */}

 {activeDataTab  === "team" && (
        <Grid container spacing={2} p={2}>
          {reportees.map((person) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
              <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box>
                    <Avatar src={person.image} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {person.name}
                    </Typography>
                    <Typography variant="caption" color="orange">
                      Weekend
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2} mt={1}>
                  <Icon fontSize="small">login</Icon>
                  <Icon fontSize="small">logout</Icon>
                  <Typography variant="caption" color="textSecondary">
                    {person.shift} - {person.shiftTime}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    {/* </DashboardLayout> */}

 {activeDataTab === "mydata" && (
        <>
 {activeTab === "shift" && (
          <SoftBox mt={3} mb={4}>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={dummyEvents}
          height="auto"
        />
         </SoftBox>
      )}
      {/* List View */}
      {activeTab === "summary" && activeView === "list" && (
        <>
          {[
  { status: "Absent", comment: "Absent" },
  { status: "Present", comment: "Present", checkIn: "9:10 AM",  checkOut: "--",
  hoursWorked: "00:00", },
  { status: "Absent", comment: "Present", checkIn: "9:10 AM",  checkOut: "--",
  hoursWorked: "00:00", },
 
  { status: "Present", comment: "Present", checkIn: "9:00 AM", checkOut: "--", hoursWorked: "00:00", },
  { status: "Present", comment: "Late by 01:00", checkIn: "9:00 AM", checkOut: "--", hoursWorked: "00:00", },
  { status: "Present", comment: "Present", checkIn: "9:00 AM", checkOut: "--", hoursWorked: "00:00", },
  { status: "Present", comment: "Present", checkIn: "9:00 AM", checkOut: "--", hoursWorked: "00:00", },
  { status: "Present", comment: "Present", checkIn: "9:00 AM", checkOut: "--", hoursWorked: "00:00", },
].map((entry, index) => {
  // const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index];
  const today = new Date();
  const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday
    const entryDate = new Date(weekStart);
  entryDate.setDate(weekStart.getDate() + index);
  const isToday = entryDate.toDateString() === new Date().toDateString();
  const dateString = entryDate.getDate().toString().padStart(2, "0");
    const weekdayName = entryDate.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.

  const dayLabel = isToday ? "Today" : `${weekdayName} ${dateString}`;
  return (
    <DayRow
      key={index}
      day={dayLabel}
      date={dateString}
      status={entry.status}
      checkIn={entry.checkIn || "--"}
      checkOut={entry.checkOut || "--"}
      hoursWorked={entry.hoursWorked || "00:00"}
      comment={entry.comment}
      isToday={isToday}
    />
  );
})}
    <SoftBox className="time-scale" mt={2} mb={2} px={2}>
            <Grid container spacing={1}>
              {timeSlots.map((slot, index) => (
                <Grid item xs={1} key={index} textAlign="center" marginRight="7px">
                  <span style={{ fontSize: "0.75rem", color: "#555"}}>{slot}</span>
                </Grid>
              ))}
            </Grid>
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
      </>
 )}

      <Footer />
       </DashboardLayout>
  
    
  );
}

export default AttendanceSummary;

