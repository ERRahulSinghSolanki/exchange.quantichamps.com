import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSnackbar from "components/SoftSnackbar";
import Table from "examples/Tables/Table";
import { API_URL } from "config";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../../../AuthContext";      // 🔐 global permissions

const PERMISSION_PREFIX = "myleavehistory.";            // ⭐ prefix

const LeaveHistoryTable = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [leaves, setLeaves]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });

  /* -------------------------------------------------------------------------- */
  /*                               Fetch data                                   */
  /* -------------------------------------------------------------------------- */
  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_URL}/leave/my-history`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      const formatted = (json.data || []).map((l) => ({
        id: l.id,
        start: new Date(l.start_date).toLocaleDateString(),
        end:   new Date(l.end_date).toLocaleDateString(),
        day:   l.day,
        type:  l.type,
        reason: l.reason || "N/A",
        status: l.status || "pending",
      }));

      setLeaves(formatted);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || "Failed to fetch leave history", color: "error" });
      setLeaves([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaveHistory(); }, []);

  /* -------------------------------------------------------------------------- */
  /*              Column definitions WITH permission property                   */
  /* -------------------------------------------------------------------------- */
  const baseColumns = useMemo(() => [
    { name: "id",     align: "left", permission: `${PERMISSION_PREFIX}id` },
    { name: "start",  align: "left", permission: `${PERMISSION_PREFIX}start` },
    { name: "end",    align: "left", permission: `${PERMISSION_PREFIX}end` },
    { name: "day",    align: "left", permission: `${PERMISSION_PREFIX}day` },
    { name: "type",   align: "left", permission: `${PERMISSION_PREFIX}type` },
    { name: "reason", align: "left", permission: `${PERMISSION_PREFIX}reason` },
    { name: "status", align: "left", permission: `${PERMISSION_PREFIX}status` },
  ], []);

  const allowedColumns = useMemo(() => (
    authPermissions.length === 0 ? baseColumns
      : baseColumns.filter((c) => authPermissions.includes(c.permission))
  ), [baseColumns, authPermissions]);

  /* -------------------------------------------------------------------------- */
  /*                          Build rows (React nodes)                          */
  /* -------------------------------------------------------------------------- */
  const allRows = useMemo(() => leaves.map((l) => ({
    id:     <SoftTypography variant="button">{l.id}</SoftTypography>,
    start:  <SoftTypography variant="button">{l.start}</SoftTypography>,
    end:    <SoftTypography variant="button">{l.end}</SoftTypography>,
    day:    <SoftTypography variant="button">{l.day}</SoftTypography>,
    type:   <SoftTypography variant="button">{l.type}</SoftTypography>,
    reason: <SoftTypography variant="button">{l.reason}</SoftTypography>,
    status: (
      <SoftTypography variant="button"
        color={l.status === "approved" ? "success" : l.status === "rejected" ? "error" : "warning"}>
        {l.status}
      </SoftTypography>
    ),
  })), [leaves]);

  const allowedRows = useMemo(() => allRows.map((r) => {
    const obj = {};
    allowedColumns.forEach((c) => { obj[c.name] = r[c.name]; });
    return obj;
  }), [allRows, allowedColumns]);

  /* -------------------------------------------------------------------------- */
  /*                                  UI                                        */
  /* -------------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color} icon="notifications" title="Leave History"
        content={snackbar.message} open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })} time={3000}
      />

      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={2}>
          My Leave History
        </SoftTypography>

        {loading ? (
          <SoftBox display="flex" justifyContent="center" py={6}>
            <CircularProgress color="info" />
          </SoftBox>
        ) : leaves.length === 0 ? (
          <SoftBox textAlign="center" py={4}>
            <SoftTypography variant="body2">No leave history found</SoftTypography>
          </SoftBox>
        ) : allowedColumns.length === 0 ? (
          <SoftBox textAlign="center" py={4}>
            <SoftTypography variant="body2">Sorry ! You don&apos;t have permission.</SoftTypography>
          </SoftBox>
        ) : (
          <Table columns={allowedColumns} rows={allowedRows} />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default LeaveHistoryTable;
