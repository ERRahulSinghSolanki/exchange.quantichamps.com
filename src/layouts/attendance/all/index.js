import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import Table from "examples/Tables/Table";
import { API_URL } from "config";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../AuthContext";

const PERMISSION_PREFIX = "allattendance.";

const AllAttendance = () => {
  const { permissions: authPermissions = [] } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);  // Manage loading state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [pagination, setPagination] = useState({ page: 1, perPage: 25, total: 0 });
  const [pageInput, setPageInput] = useState(1);
  const [searchName, setSearchName] = useState("");

  const navigate = useNavigate();

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);  // Set loading to true before fetching data
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`${API_URL}/attendance/all?page=${pagination.page}&per_page=${pagination.perPage}&q=${searchName}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      let attendanceData = [], totalCount = 0;

      if (data.data) {
        attendanceData = data.data;
        totalCount = data.total;
      }

      setAttendanceData(attendanceData);
      setPagination((p) => ({ ...p, total: totalCount }));
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to fetch attendance", color: "error" });
      setAttendanceData([]);
    } finally {
      setLoading(false);  // Set loading to false when fetching is complete
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [pagination.page, pagination.perPage, searchName]);

  useEffect(() => {
    setPageInput(pagination.page);
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.perPage);
    if (newPage >= 1 && newPage <= totalPages) setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  // Permissions for columns (with allattendance.* prefix)
  const baseColumns = [
    { name: "id", align: "left", width: "5%", permission: "allattendance.id" },
    { name: "name", align: "left", width: "12%", permission: "allattendance.name" },
    { name: "role", align: "left", width: "12%", permission: "allattendance.role" },
    { name: "branch", align: "left", width: "12%", permission: "allattendance.branch" },
    { name: "shift", align: "left", width: "12%", permission: "allattendance.shift" },
    { name: "login_time", align: "left", width: "12%", permission: "allattendance.login_time" },
    { name: "logout_time", align: "left", width: "12%", permission: "allattendance.logout_time" },
    { name: "status", align: "left", width: "8%", permission: "allattendance.status" },
  ];

  // Permissions for search box
  const searchPermission = "allattendance.search";

  // Filter columns based on permissions
  const allowedColumns = useMemo(() => baseColumns.filter((c) => authPermissions.includes(c.permission)), [baseColumns, authPermissions]);

  const allRows = useMemo(() => attendanceData.map((att) => ({
    id: <SoftTypography variant="button" fontWeight="medium">{att.id}</SoftTypography>,
    name: <SoftTypography variant="button" fontWeight="medium">{att.user?.name || "-"}</SoftTypography>,
    role: <SoftTypography variant="button" fontWeight="medium">{att.user?.roles?.[0]?.name || "-"}</SoftTypography>,
    branch: <SoftTypography variant="button" fontWeight="medium">{att.user?.branch?.name || "-"}</SoftTypography>,
    shift: <SoftTypography variant="button" fontWeight="medium">{att.user?.shifts?.[0]?.type || "-"}</SoftTypography>,
    login_time: <SoftTypography variant="button" fontWeight="medium">{att.login_time ? new Date(att.login_time).toLocaleString() : "-"}</SoftTypography>,
    logout_time: <SoftTypography variant="button" fontWeight="medium">{att.logout_time ? new Date(att.logout_time).toLocaleString() : "-"}</SoftTypography>,
    status: <SoftTypography variant="button" fontWeight="medium" color={att.status === "present" ? "success" : att.status === "absent" ? "error" : "warning"}>{att.status}</SoftTypography>,
  })), [attendanceData]);

  const allowedRows = useMemo(() => allRows.map((r) => {
    const obj = {};
    allowedColumns.forEach((c) => {
      obj[c.name] = r[c.name];
    });
    return obj;
  }), [allRows, allowedColumns]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftSnackbar color={snackbar.color} icon="notifications" title="Attendance" content={snackbar.message} open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} time={3000} />
      <SoftBox p={3}>
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <SoftTypography variant="h5" fontWeight="medium">All Attendance Records</SoftTypography>
          </SoftBox>

          {/* Pagination */}
          <SoftBox display="flex" justifyContent="center" alignItems="center" mb={2}>
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(1)} disabled={pagination.page === 1 || loading}>{"<<"}</SoftButton>
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>{"<"}</SoftButton>
            <input type="number" value={pageInput} min={1} max={Math.ceil(pagination.total / pagination.perPage)} onChange={(e) => setPageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handlePageChange(parseInt(pageInput))} onBlur={() => handlePageChange(parseInt(pageInput))} style={{ width: "60px", textAlign: "center", padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}>{">"}</SoftButton>
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.perPage))} disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}>{">>"}</SoftButton>
          </SoftBox>

          {/* Search Box moved below Pagination */}
          {authPermissions.includes(searchPermission) && (
            <SoftBox display="flex" justifyContent="center" flexDirection="column" alignItems="center" mb={3}>
              <SoftTypography variant="button" fontWeight="bold" mb={1}>Search by Name</SoftTypography>
              <TextField variant="outlined" size="small" value={searchName} onChange={handleSearchChange} placeholder="Enter name..." />
            </SoftBox>
          )}

          {/* Table Content with Loading Overlay */}
          <SoftBox position="relative" minHeight="300px">
            {loading && (
              <SoftBox
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor="rgba(255,255,255,0.7)"
                zIndex={1}
              >
                <CircularProgress color="info" />
              </SoftBox>
            )}

            {!loading && attendanceData.length === 0 ? (
              <SoftBox textAlign="center" py={4}>
                <SoftTypography variant="body2">No attendance records found</SoftTypography>
              </SoftBox>
            ) : allowedColumns.length === 0 ? (
              <SoftBox textAlign="center" py={4}>
                <SoftTypography variant="body2">Sorry! You don&apos;t have permission.</SoftTypography>
              </SoftBox>
            ) : (
              <Table columns={allowedColumns} rows={allowedRows} />
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AllAttendance;
