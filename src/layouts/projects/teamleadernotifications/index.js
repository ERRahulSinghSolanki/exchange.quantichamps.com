import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import TextField from "@mui/material/TextField";
import { API_URL } from "config";

const PAGE_SIZE = 5;

const TeamLeaderLoginApprovalNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState({});

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // ✅ Team Leader endpoints
      const earlyRes = await axios.get(`${API_URL}/teamleader/early-login-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const lateRes = await axios.get(`${API_URL}/teamleader/late-login-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mergedData = [...earlyRes.data.notifications, ...lateRes.data.notifications];
      setNotifications(mergedData);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to fetch notifications", color: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApproval = async (attendanceId, notificationId, isApproved, type) => {
    try {
      const token = localStorage.getItem("authToken");

      let url = "";
      if (type === "early") {
        url = `${API_URL}/teamleader/early-login-approve/${attendanceId}`;
      } else if (type === "late") {
        url = `${API_URL}/teamleader/late-login-approve/${attendanceId}`;
      }

      await axios.post(
        url,
        {
          approve: isApproved,
          notification_id: notificationId,
          comment: comments[notificationId] || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbar({
        open: true,
        message: `Successfully ${isApproved ? "approved" : "rejected"} request.`,
        color: "success",
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setComments((prev) => {
        const updated = { ...prev };
        delete updated[notificationId];
        return updated;
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Approval action failed",
        color: "error",
      });
    }
  };

  const paginatedData = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftSnackbar
        color={snackbar.color}
        icon="notifications"
        title="Team Leader Login Approval Requests"
        content={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        time={3000}
      />
      <SoftBox p={3}>
        <SoftTypography variant="h4" fontWeight="bold" mb={2}>
          Login Approval Requests
        </SoftTypography>

        {loading ? (
          <SoftTypography>Loading...</SoftTypography>
        ) : notifications.length === 0 ? (
          <SoftTypography>No login approval requests found.</SoftTypography>
        ) : (
          <>
            {paginatedData.map((n) => (
              <SoftBox
                key={n.id}
                mt={2}
                p={2}
                border="1px solid #ccc"
                borderRadius="lg"
                sx={{ backgroundColor: "#f8f9fa" }}
              >
                <SoftTypography>
                  <strong>{n.user_name}</strong> (Shift: <strong>{n.shift_type}</strong>) from{" "}
                  <strong>{n.branch_name}</strong> requested{" "}
                  {n.status === "pending_early_approval"
                    ? "early login"
                    : n.status === "pending_late_approval"
                    ? "late login"
                    : "login"}{" "}
                  approval
                </SoftTypography>
                <SoftTypography variant="body2" mt={1}>
                  Scheduled Start: {n.scheduled_start} <br />
                  Requested Login Time: {n.request_login_time}
                </SoftTypography>

                <TextField
                  fullWidth
                  placeholder="Add a comment"
                  value={comments[n.id] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({ ...prev, [n.id]: e.target.value }))
                  }
                  sx={{ mt: 2 }}
                />

                <SoftBox mt={2}>
                  <SoftButton
                    color="success"
                    size="small"
                    onClick={() =>
                      handleApproval(
                        n.attendance_id,
                        n.id,
                        true,
                        n.status === "pending_early_approval" ? "early" : "late"
                      )
                    }
                  >
                    Approve
                  </SoftButton>
                  <SoftButton
                    color="error"
                    size="small"
                    onClick={() =>
                      handleApproval(
                        n.attendance_id,
                        n.id,
                        false,
                        n.status === "pending_early_approval" ? "early" : "late"
                      )
                    }
                    sx={{ ml: 1 }}
                  >
                    Reject
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            ))}

            {totalPages > 1 && (
              <SoftBox mt={3} display="flex" justifyContent="center">
                <SoftButton
                  variant="outlined"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  sx={{ mx: 1 }}
                >
                  Prev
                </SoftButton>
                <SoftTypography variant="body2" mt={1}>
                  Page {page} of {totalPages}
                </SoftTypography>
                <SoftButton
                  variant="outlined"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  sx={{ mx: 1 }}
                >
                  Next
                </SoftButton>
              </SoftBox>
            )}
          </>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default TeamLeaderLoginApprovalNotifications;
