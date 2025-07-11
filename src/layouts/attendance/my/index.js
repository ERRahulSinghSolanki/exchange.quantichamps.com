import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";
import { useAuth } from "../../../AuthContext";
import SoftPagination from "components/SoftPagination";

// ✅ Format to: "22 Jun 2025, 09:18 AM"
const formatDateTime = (datetime) => {
  if (!datetime) return "-";
  const date = new Date(datetime);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const PERMISSION_PREFIX = "myattendance."; // 👈 new prefix

const MyAttendanceTable = () => {
  const { permissions: authPermissions = [] } = useAuth(); // <- unified source

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  /* -------------------------------------------------------------------------- */
  /*                           Fetch attendance data                            */
  /* -------------------------------------------------------------------------- */
  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/attendance/my?page=${currentPage}&per_page=${rowsPerPage}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      const formatted = (json.data || []).map((a) => ({
        id: a.id,
        login_time: formatDateTime(a.login_time),
        logout_time: formatDateTime(a.logout_time),
        status: a.status || "N/A",
      }));

      setAttendanceData(formatted);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, [currentPage]);

  /* -------------------------------------------------------------------------- */
  /*               Master list of columns WITH `permission` key                 */
  /* -------------------------------------------------------------------------- */
  const baseColumns = useMemo(
    () => [
      { name: "id", align: "left", permission: `${PERMISSION_PREFIX}id` },
      { name: "login_time", align: "left", permission: `${PERMISSION_PREFIX}login_time` },
      { name: "logout_time", align: "left", permission: `${PERMISSION_PREFIX}logout_time` },
      { name: "status", align: "left", permission: `${PERMISSION_PREFIX}status` },
    ],
    []
  );

  /* -------------------------------------------------------------------------- */
  /*                Compute allowed columns based on auth permissions           */
  /* -------------------------------------------------------------------------- */
  const allowedColumns = useMemo(() => {
    // If no perms available, default to all (backward‑compatibility)
    if (!authPermissions || authPermissions.length === 0) return baseColumns;
    return baseColumns.filter((c) => authPermissions.includes(c.permission));
  }, [baseColumns, authPermissions]);

  /* -------------------------------------------------------------------------- */
  /*                          Build rows (with React nodes)                     */
  /* -------------------------------------------------------------------------- */
  const allRows = useMemo(
    () =>
      attendanceData.map((row) => ({
        id: (
          <SoftTypography variant="button" fontWeight="medium">
            {row.id}
          </SoftTypography>
        ),
        login_time: (
          <SoftTypography variant="button" fontWeight="medium">
            {row.login_time}
          </SoftTypography>
        ),
        logout_time: (
          <SoftTypography variant="button" fontWeight="medium">
            {row.logout_time}
          </SoftTypography>
        ),
        status: (
          <SoftTypography
            variant="button"
            fontWeight="medium"
            color={
              row.status === "present"
                ? "success"
                : row.status === "absent"
                ? "error"
                : "warning"
            }
          >
            {row.status}
          </SoftTypography>
        ),
      })),
    [attendanceData]
  );

  /* -------------------------------------------------------------------------- */
  /*                 Reduce rows down to ONLY allowed column keys               */
  /* -------------------------------------------------------------------------- */
  const allowedRows = useMemo(() => {
    return allRows.map((r) => {
      const subset = {};
      allowedColumns.forEach((c) => {
        subset[c.name] = r[c.name];
      });
      return subset;
    });
  }, [allRows, allowedColumns]);

  /* -------------------------------------------------------------------------- */
  /*                          Pagination Logic                                   */
  /* -------------------------------------------------------------------------- */
  const totalPages = Math.ceil(attendanceData.length / rowsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  /* -------------------------------------------------------------------------- */
  /*                                Render UI                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          My Attendance
        </SoftTypography>

        {loading ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress color="info" />
          </SoftBox>
        ) : attendanceData.length === 0 ? (
          <SoftTypography variant="body2" color="text">
            No attendance records found.
          </SoftTypography>
        ) : allowedColumns.length === 0 ? (
          <SoftTypography variant="body2" color="text">
            Sorry ! You don&apos;t have permission.
          </SoftTypography>
        ) : (
          <>
            <Table columns={allowedColumns} rows={allowedRows} />
            {/* Pagination */}
            <SoftBox display="flex" justifyContent="center" mt={3}>
              <SoftPagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="info"
              />
            </SoftBox>
          </>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default MyAttendanceTable;
