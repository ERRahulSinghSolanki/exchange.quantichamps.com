import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import Globe from "examples/Globe";

import typography from "assets/theme/base/typography";
import breakpoints from "assets/theme/base/breakpoints";

import salesTableData from "layouts/dashboards/default/data/salesTableData";
import reportsBarChartData from "layouts/dashboards/default/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboards/default/data/gradientLineChartData";

import { API_URL } from "config";

function Default() {
  const { values } = breakpoints;
  const { size } = typography;
  const { chart, items } = reportsBarChartData;

  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingEarly, setLoadingEarly] = useState(false);
  const [loadingLate, setLoadingLate] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const userRole = localStorage.getItem("userRole");

  const fetchStatus = () => {
    fetch(`${API_URL}/attendance/status`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAttendanceStatus(data);
        if (userRole !== "Admin" && userRole !== "Manager" && data.show_popup) {
          setModalOpen(true);
        }
        setPageLoading(false);
      })
      .catch((err) => {
        console.error("Attendance check failed:", err);
        setPageLoading(false);
      });
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAttendance = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    setMarkingAttendance(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(`${API_URL}/attendance/mark`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude, longitude }),
        })
          .then(() => {
            setModalOpen(false);
            window.location.reload(); // ✅ No reset or enable
          })
          .catch((err) => {
            console.error("Failed to mark attendance:", err);
            setMarkingAttendance(false); // ✅ Only enable on error
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location access denied. Please enable it to mark attendance.");
        setMarkingAttendance(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const requestEarlyApproval = () => {
    setLoadingEarly(true);

    fetch(`${API_URL}/attendance/request-earlylogin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        window.location.reload(); // ✅ No re-enable
      })
      .catch((err) => {
        console.error("Early approval request failed", err);
        setLoadingEarly(false); // ✅ Only enable on error
      });
  };

  const requestLateApproval = () => {
    setLoadingLate(true);

    fetch(`${API_URL}/attendance/request-late`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        window.location.reload(); // ✅ No re-enable
      })
      .catch((err) => {
        console.error("Late approval request failed", err);
        setLoadingLate(false); // ✅ Only enable on error
      });
  };

  const renderPopupContent = () => {
    const status = attendanceStatus?.status;

    if (status === "pending_early_approval" || status === "pending_late_approval") {
      return (
        <>
          <SoftTypography variant="h5" fontWeight="bold" mb={2}>
            ✅ Your login request has been sent.
          </SoftTypography>
          <SoftTypography variant="body2" color="info" mb={2}>
            Please wait for approval from Team Leader / Manager / Admin.
          </SoftTypography>
        </>
      );
    }

    if (attendanceStatus?.can_login) {
      return (
        <>
          <SoftTypography variant="h5" fontWeight="bold" mb={2}>
            You&apos;re good to go!
          </SoftTypography>
          <SoftBox display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={markAttendance}
              disabled={markingAttendance}
            >
              {markingAttendance ? "Marking..." : "Mark Attendance"}
            </Button>
          </SoftBox>
        </>
      );
    }

    if (attendanceStatus?.status === "early_login") {
      return (
        <>
          <SoftTypography variant="h5" fontWeight="bold" mb={2}>
            You&apos;re early!
          </SoftTypography>
          <SoftTypography variant="body2" mb={2}>
            Your shift starts at <strong>{attendanceStatus?.scheduled_start}</strong>. Please wait or request early login approval.
          </SoftTypography>
          <TextField
            label="Reason for early login"
            multiline
            rows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="info"
            fullWidth
            onClick={requestEarlyApproval}
            disabled={loadingEarly}
          >
            {loadingEarly ? "Requesting..." : "Request Early Approval"}
          </Button>
        </>
      );
    }

    if (attendanceStatus?.status === "late") {
      return (
        <>
          <SoftTypography variant="h5" fontWeight="bold" mb={2}>
            You&apos;re late by {attendanceStatus?.late_minutes?.toFixed(2)} minutes.
          </SoftTypography>
          <TextField
            label="Reason for late login"
            multiline
            rows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={requestLateApproval}
            disabled={loadingLate}
          >
            {loadingLate ? "Requesting..." : "Request Late Approval"}
          </Button>
        </>
      );
    }

    return null;
  };

  if (pageLoading) {
    return (
      <SoftBox display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="rgba(255,255,255,0.9)">
        <CircularProgress color="info" size={50} />
      </SoftBox>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Modal open={modalOpen}>
        <SoftBox
          style={{
            background: "white",
            padding: 30,
            maxWidth: 400,
            margin: "10% auto",
            borderRadius: 10,
            textAlign: "center",
          }}
        >
          {renderPopupContent()}
        </SoftBox>
      </Modal>
      <SoftBox py={3}>
        <Grid container>
          <Grid item xs={12} lg={7}>
            <SoftBox mb={3} p={1}>
              <SoftTypography
                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                textTransform="capitalize"
                fontWeight="bold"
              >
                general statistics
              </SoftTypography>
            </SoftBox>
            <Grid container>
              <Grid item xs={12}>
                <Globe
                  display={{ xs: "none", md: "block" }}
                  position="absolute"
                  top="10%"
                  right={0}
                  mt={{ xs: -12, lg: 1 }}
                  mr={{ xs: 0, lg: 10 }}
                  canvasStyle={{ marginTop: "3rem" }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={5}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "today's money", fontWeight: "bold" }}
                    count="$53,000"
                    percentage={{ color: "success", text: "+55%" }}
                    icon={{ color: "info", component: "paid" }}
                  />
                </SoftBox>
                <MiniStatisticsCard
                  title={{ text: "today's users", fontWeight: "bold" }}
                  count="2,300"
                  percentage={{ color: "success", text: "+3%" }}
                  icon={{ color: "info", component: "public" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "new clients", fontWeight: "bold" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ text: "sales", fontWeight: "bold" }}
                    count="$103,430"
                    percentage={{ color: "success", text: "+5%" }}
                    icon={{ color: "info", component: "shopping_cart" }}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={10} lg={7}>
            <Grid item xs={12} lg={10}>
              <SoftBox mb={3} position="relative">
                <SalesTable title="Sales by Country" rows={salesTableData} />
              </SoftBox>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="active users"
                description={<>(<strong>+23%</strong>) than last week</>}
                chart={chart}
                items={items}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Sales Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more <SoftTypography variant="button" color="text" fontWeight="regular">in 2021</SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                chart={gradientLineChartData}
              />
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
