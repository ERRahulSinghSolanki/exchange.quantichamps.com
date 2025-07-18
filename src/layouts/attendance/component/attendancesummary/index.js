import React, { useState, useEffect, useRef } from "react";
import { 
  Card, 
  Grid, 
  Avatar, 
  Typography, 
  Box, 
  Icon, 
  CircularProgress,
  TextField 
} from "@mui/material";
import Header from "layouts/attendance/component/header";
import DayRow from "layouts/attendance/component/dayrow";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
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
import { API_URL } from "config";

// Default profile picture
const DEFAULT_PROFILE_PIC = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

// Function to convert 24-hour time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return "--";
  
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const twelveHour = hourNum % 12 || 12;
  
  return `${twelveHour}:${minutes} ${ampm}`;
};

function AttendanceSummary() {
  const [checkOutNote, setCheckOutNote] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [activeView, setActiveView] = useState("list");
  const [activeDataTab, setActiveDataTab] = useState("mydata");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, perPage: 24, total: 0 });
  const [pageInput, setPageInput] = useState(1);
  const [searchName, setSearchName] = useState("");

  // Timer logic
  const [timer, setTimer] = useState(0);
  const [clockDeg, setClockDeg] = useState(0);
  const timerRef = useRef();
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
      setClockDeg((prev) => (prev + 6) % 360);
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

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/users/team?page=${pagination.page}&per_page=${pagination.perPage}&q=${searchName}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setTeamMembers(data.users?.data || data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.users?.total || data.total,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeDataTab === "team") {
      fetchUsers();
    }
  }, [activeDataTab, pagination.page, pagination.perPage, searchName]);

  // Pagination Logic
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.perPage)) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  useEffect(() => {
    setPageInput(pagination.page);
  }, [pagination.page]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
        activeDataTab={activeDataTab}
        setActiveDataTab={setActiveDataTab}
      />

      {/* Team Tab - Shows users from API */}
      {activeDataTab === "team" && (
        <>
          {/* Pagination Controls */}
          <SoftBox display="flex" justifyContent="center" alignItems="center" mb={2}>
            <SoftButton
              size="small"
              variant="outlined"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1 || loading}
            >
              {"<<"}
            </SoftButton>
            <SoftButton
              size="small"
              variant="outlined"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              {"<"}
            </SoftButton>
            <input
              type="number"
              value={pageInput}
              min={1}
              max={Math.ceil(pagination.total / pagination.perPage)}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePageChange(parseInt(pageInput))}
              onBlur={() => handlePageChange(parseInt(pageInput))}
              style={{
                width: "60px",
                textAlign: "center",
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                margin: "0 5px"
              }}
            />
            <SoftButton
              size="small"
              variant="outlined"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
            >
              {">"}
            </SoftButton>
            <SoftButton
              size="small"
              variant="outlined"
              onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.perPage))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
            >
              {">>"}
            </SoftButton>
          </SoftBox>

          {/* Team Member List */}
          <Grid container spacing={2} p={2}>
            {loading ? (
              <Grid item xs={12} textAlign="center">
                <CircularProgress color="info" />
              </Grid>
            ) : teamMembers.length === 0 ? (
              <Grid item xs={12} textAlign="center">
                <Typography>No team members found</Typography>
              </Grid>
            ) : (
              teamMembers.map((user) => {
                const shift = user.shift || {};
                const shiftTime = shift.start_time && shift.end_time 
                  ? `${formatTime(shift.start_time)} - ${formatTime(shift.end_time)}`
                  : "--";

                return (
                  <Grid item xs={12} sm={6} md={3} lg={3} key={user.id}>
                    <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, width: '100%', maxWidth: 250 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box>
                          <Avatar src={user.profile_pic || DEFAULT_PROFILE_PIC} />
                          <Typography variant="subtitle1" fontWeight="bold" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="orange">
                            {user.role || "User"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Icon fontSize="small">login</Icon>
                        <Icon fontSize="small">logout</Icon>
                        <Typography variant="caption" color="textSecondary">
                          {shift.type || "General"} - {shiftTime}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        </>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default AttendanceSummary;
