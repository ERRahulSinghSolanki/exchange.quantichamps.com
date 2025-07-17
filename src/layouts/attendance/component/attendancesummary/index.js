

import React, { useState, useEffect, useRef } from "react";
import { Card, Grid, Avatar, Typography, Box, Icon, Slider, FormControl, Select, MenuItem } from "@mui/material";
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
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import "attendancesummary.css";

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
  {
    id: 4,
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
  {
    id: 7,
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
  {
    id: 9,
    name: "Ava Martinez",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: 10,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 11,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 12,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 13,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 14,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 15,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 16,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 17,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 18,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 19,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 20,
    name: "Noah Garcia",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    weekend: true,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  }, {
    id: 21,
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
const [selectedTeamUser, setSelectedTeamUser] = useState(null);
 const currentUser = {
    id: 99,
    name: "You",
    shift: "General",
    shiftTime: "9:00 AM - 6:00 PM",
    image: "https://randomuser.me/api/portraits/lego/1.jpg",
  };
  useEffect(() => {
    // Always set the tab to "summary" on mount (safe side)
    setActiveTab("summary");
  }, []);

  useEffect(() => {
    // Reset pagination to page 1 whenever team tab is selected
    if (activeDataTab === "team") {
      setCurrentPage(1);
    }
  }, [activeDataTab]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // You can change this based on how many cards you want per page

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
  //s1
  const getTodayRange = () => {
    const today = new Date();
    const start = new Date(today); // today
    const end = new Date(today);
    end.setDate(start.getDate() + 6); // next 6 days
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const [dateRange, setDateRange] = useState(getTodayRange());
const shiftDateBy = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  // 3️⃣ Handlers to move week back/forward
  const handlePrev = () => {
    setDateRange((prev) => ({
      start: shiftDateBy(prev.start, -7),
      end: shiftDateBy(prev.end, -7),
    }));
  };

  const handleNext = () => {
    setDateRange((prev) => ({
      start: shiftDateBy(prev.start, 7),
      end: shiftDateBy(prev.end, 7),
    }));
  };

  const timeSlots = ["09AM", "10AM", "11AM", "12PM", "01PM", "02PM", "03PM", "04PM", "05PM", "06PM"];
  const dummyEvents = [
    { title: "General", start: "2025-07-02T09:00:00", end: "2025-07-02T18:00:00" },
    { title: "Casual Leave", start: "2025-07-02" },
    { title: "General", start: "2025-07-03T09:00:00", end: "2025-07-03T18:00:00" },
    { title: "Casual Leave", start: "2025-07-03" }, 
    { title: "General", start: "2025-07-04T09:00:00", end: "2025-07-04T18:00:00" },
    { title: "Casual Leave", start: "2025-07-04" }, 
    { title: "General", start: "2025-07-05T09:00:00", end: "2025-07-05T18:00:00" },
    { title: "Casual Leave", start: "2025-07-05" },
     { title: "General", start: "2025-07-06T09:00:00", end: "2025-07-06T18:00:00" },
    { title: "Casual Leave", start: "2025-07-06" }, 
     { title: "General", start: "2025-07-07T09:00:00", end: "2025-07-07T18:00:00" },
    { title: "Casual Leave", start: "2025-07-07" },
     { title: "General", start: "2025-07-08T09:00:00", end: "2025-07-08T18:00:00" },
    { title: "Casual Leave", start: "2025-07-08" },
     { title: "General", start: "2025-07-09T09:00:00", end: "2025-07-09T18:00:00" },
    { title: "Casual Leave", start: "2025-07-09" },
    { title: "Casual Leave", start: "2025-07-10" },
         { title: "General", start: "2025-07-10T09:00:00", end: "2025-07-10T18:00:00" },


  ];
  //s2
  const today = new Date();
  const entries = Array.from({ length: 7 }, (_, index) => {
    const entryDate = new Date(dateRange.start);
    entryDate.setDate(entryDate.getDate() + index);
    const isToday = entryDate.toDateString() === today.toDateString();

    return {
      date: entryDate,
      status: isToday ? "Present" : "Absent",
      comment: isToday ? "Present" : "Absent",
      checkIn: isToday ? "9:00 AM" : "--",
      checkOut: "--",
      hoursWorked: "00:00",
    };
  });

  const totalPages = Math.ceil(reportees.length / itemsPerPage);
  const paginatedReportees = reportees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const calendarRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Update calendar whenever month/year changes
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(new Date(selectedYear, selectedMonth, 1));
    }
  }, [selectedMonth, selectedYear]);

  return (

    <DashboardLayout>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange={dateRange}
        setDateRange={setDateRange}
        // onPrev={() => { }}
        // onNext={() => { }}
        shiftName="General"
        shiftTime="9:00 AM - 6:00 PM"
        checkOutNote={checkOutNote}
        setCheckOutNote={setCheckOutNote}
        checkOutTimer={formatTimer(timer)}
        activeView={activeView}
        setActiveView={setActiveView}
        activeDataTab={activeDataTab}
        setActiveDataTab={setActiveDataTab}
         selectedUser={activeDataTab === "team" ? selectedTeamUser : currentUser}
  setSelectedUser={setSelectedTeamUser}
  userList={reportees} // List of reportees or subordinates
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {activeDataTab === "team" && selectedTeamUser && (
  <Box mt={2} mx={2}>
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems:"flex-start",
        padding: 2,
        borderRadius: "12px",
        boxShadow: 2,
        backgroundColor: "#fff",
      }}
    >
      {/* Left: Back Button + Avatar + Name */}
      <Box display="flex" alignItems="center" gap={2}>
        <Icon
          onClick={() => setSelectedTeamUser(null)}
          sx={{
            cursor: "pointer",
            fontSize: "2rem",
            color: "#344767",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "#1976d2",
              transform: "scale(1.1)",
            },
          }}
        >
          arrow_back
        </Icon>
        <Avatar src={selectedTeamUser.image} sx={{ width: 48, height: 48 }} />
        <Typography variant="h5" >
          
           <FormControl size="small" sx={{ minWidth: 200 , fontWeight:"bold"}}>
        <Select
          value={selectedTeamUser?.id || ""}
          onChange={(e) => {
            const newUser = reportees.find((u) => u.id === e.target.value);
            setSelectedTeamUser(newUser);
          }}
        >
          {reportees.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        </Typography>
      </Box>
    </Card>
  </Box>
)}


      {/* ✅ Show reportee cards on Team tab */}

      {activeDataTab === "team" && !selectedTeamUser && (
        <>
          <Grid container spacing={2} p={2}>
            {paginatedReportees.map((person) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
                <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 ,cursor: "pointer"}}
                 onClick={() => setSelectedTeamUser(person)}>
                  <Box display="flex" alignItems="center" gap={2}>
                     <Avatar src={person.image} />
                    <Box>
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

          {/* Pagination */}
          <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
            <Icon
              sx={{
                cursor: currentPage > 1 ? "pointer" : "default",
                opacity: currentPage > 1 ? 1 : 0.3,
              }}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              chevron_left
            </Icon>
            <Typography variant="button">
              Page {currentPage} of {totalPages}
            </Typography>
            <Icon
              sx={{
                cursor: currentPage < totalPages ? "pointer" : "default",
                opacity: currentPage < totalPages ? 1 : 0.3,
              }}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              chevron_right
            </Icon>
          </Box>
        </>
      )}
{activeDataTab === "team" && selectedTeamUser && (
  <>
    {/* Optional back button */}
    <Box display="flex" px={2} mt={2}>
      <Box
        onClick={() => setSelectedTeamUser(null)}
        sx={{ cursor: "pointer", display: "flex", alignItems: "center", fontWeight: "bold", color: "#1976d2" }}
      >
      </Box>
    </Box>

    {/* Reuse your mydata view structure here */}
    {activeTab === "summary" && activeView === "list" && (
      <>
        {entries.map((entry, index) => {
          const entryDate = entry.date;
          const isToday = entryDate.toDateString() === new Date().toDateString();
          const dateString = entryDate.getDate().toString().padStart(2, "0");
          const weekdayName = entryDate.toLocaleDateString("en-US", { weekday: "short" });
          const dayLabel = isToday ? "Today" : `${weekdayName} ${dateString}`;
          return (
            <DayRow
              key={index}
              day={dayLabel}
              date={dateString}
              status={entry.status}
              checkIn={entry.checkIn}
              checkOut={entry.checkOut}
              hoursWorked={entry.hoursWorked}
              comment={entry.comment}
              isToday={isToday}
            />
          );
        })}
        <SoftBox className="time-scale" mt={2} mb={2} px={2}>
          <Grid container spacing={0.5} marginLeft="75px">
            {timeSlots.map((slot, index) => (
              <Grid item xs={0.8} key={index} textAlign="center" marginLeft="5px">
                <span style={{ fontSize: "0.75rem", color: "#555" }}>{slot}</span>
              </Grid>
            ))}
          </Grid>
        </SoftBox>
      </>
    )}
  </>
)}

      {activeDataTab === "mydata" && (
        <>
          {activeTab === "shift" && (
            <SoftBox mt={3} mb={4}>
              {/* Month-Year Controls */}
              <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                      <MenuItem key={i} value={i}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {Array.from({ length: 20 }, (_, i) => {
                      const year = new Date().getFullYear() - 10 + i;
                      return <MenuItem key={year} value={year}>{year}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Box>

              {/* Calendar */}
              <CalendarRoot>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                events={dummyEvents}
                height="auto"
                // eventColor="#33ccff"
                // eventTextColor="#fff"
                headerToolbar={{
                  left: "prev",
                  center: "title",
                  right: "today ,next",
                }}
                  eventContent={(arg) => (
    <div
      style={{
        background: "linear-gradient(to right, #33ccff, #ff99cc)",
        borderRadius: "4px",
        padding: "2px 4px",
        color: "#fff",
        fontSize: "0.95rem",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {arg.event.title}
    </div>
  )}
              />
              </CalendarRoot>
            </SoftBox>
          )}


          {/* List View */}
          {/* s3 */}
          {activeTab === "summary" && activeView === "list" && (
            <>
              {/* 1 week data */}
              {entries.map((entry, index) => {
                const entryDate = entry.date;
                const isToday = entryDate.toDateString() === new Date().toDateString();
                const dateString = entryDate.getDate().toString().padStart(2, "0");
                const weekdayName = entryDate.toLocaleDateString("en-US", { weekday: "short" });
                const dayLabel = isToday ? "Today" : `${weekdayName} ${dateString}`;
                return (
                  <DayRow
                    key={index}
                    day={dayLabel}
                    date={dateString}
                    status={entry.status}
                    checkIn={entry.checkIn}
                    checkOut={entry.checkOut}
                    hoursWorked={entry.hoursWorked}
                    comment={entry.comment}
                    isToday={isToday}
                  />
                );
              })}
              {/* 9AM - 6 PM time range */}
              <SoftBox className="time-scale" mt={2} mb={2} px={2}>
                <Grid container spacing={0.5} marginLeft="75px">
                  {timeSlots.map((slot, index) => (
                    <Grid item xs={0.8} key={index} textAlign="center" marginLeft="5px">
                      <span style={{ fontSize: "0.75rem", color: "#555" }}>{slot}</span>
                    </Grid>
                  ))}
                </Grid>
              </SoftBox>


            </>
          )}

          {/* Tabular View */}
          {activeTab === "summary" && activeView === "tabular" && (
            <SoftBox mt={3}>
              <DataTable table={dataTableData} entriesPerPage={false} />
            </SoftBox>
          )}

          {/* Calendar View */}
          {activeTab === "summary" && activeView === "calendar" && (
  <SoftBox mt={3} mb={4}>
    {/* Month-Year Header with Prev/Next and Today Button */}
    <SoftBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      {/* Prev Button */}
      {/* <Icon
        sx={{ cursor: "pointer", fontSize: "1.5rem", color: "primary.main" }}
        onClick={() => {
          const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
          const newYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
          setSelectedMonth(newMonth);
          setSelectedYear(newYear);
        }}
      >
        chevron_left
      </Icon> */}

      {/* Month + Year + Today */}
      <SoftBox display="flex" gap={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            variant="outlined"
          >
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <MenuItem key={m} value={i}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            variant="outlined"
          >
            {Array.from({ length: 100 }, (_, i) => {
              const y = 1970 + i;
              return (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

      
      </SoftBox>
      

      {/* Next Button */}
      {/* <Icon
        sx={{ cursor: "pointer", fontSize: "1.5rem", color: "primary.main" }}
        onClick={() => {
          const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
          const newYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
          setSelectedMonth(newMonth);
          setSelectedYear(newYear);
        }}
      >
        chevron_right
      </Icon> */}
    </SoftBox>

    {/* Calendar */}
    <CalendarRoot>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // events={dummyEvents}
        height="auto"
           headerToolbar={{
                  left: "prev",
                  center: "title",
                  right: "today ,next",
                }}
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

