import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";
import { useAuth } from "../../../../AuthContext"; // 🔑 same pattern as other pages

/**
 * All Attendance Table (permission‑aware)
 * ---------------------------------------------------------------------------
 * - Adds `permission` key to every column.
 * - Consumes the global permissions array from `useAuth()`.
 * - Table will render only the columns for which the logged‑in user
 *   has `allattendance.<columnName>` permission.
 */
const PERMISSION_PREFIX = "allattendance.";

const AllAttendanceTable = () => {
  const { permissions: authPermissions = [] } = useAuth(); // <- centralised source

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                           Fetch attendance data                            */
  /* -------------------------------------------------------------------------- */
  const fetchAllAttendance = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/attendance/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      const formatted = (json.data || []).map((a) => ({
        id: a.id,
        name: a.user?.name || "-",
        role: a.user?.roles?.[0]?.name || "-",
        branch: a.user?.branch?.name || "-",
        shift: a.user?.shifts?.[0]?.type || "-",
        login_time: a.login_time ? new Date(a.login_time).toLocaleString() : "-",
        logout_time: a.logout_time ? new Date(a.logout_time).toLocaleString() : "-",
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
    fetchAllAttendance();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*               Master list of columns WITH `permission` key                 */
  /* -------------------------------------------------------------------------- */
  const baseColumns = useMemo(
    () => [
      { name: "id", align: "left", permission: `${PERMISSION_PREFIX}id` },
      { name: "name", align: "left", permission: `${PERMISSION_PREFIX}name` },
      { name: "role", align: "left", permission: `${PERMISSION_PREFIX}role` },
      { name: "branch", align: "left", permission: `${PERMISSION_PREFIX}branch` },
      { name: "shift", align: "left", permission: `${PERMISSION_PREFIX}shift` },
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
    // If no perms available, default to all (legacy)
    if (!authPermissions || authPermissions.length === 0) return baseColumns;
    return baseColumns.filter((c) => authPermissions.includes(c.permission));
  }, [baseColumns, authPermissions]);

  /* -------------------------------------------------------------------------- */
  /*                          Build rows (with React nodes)                     */
  /* -------------------------------------------------------------------------- */
  const allRows = useMemo(
    () =>
      attendanceData.map((row) => ({
        id: <SoftTypography variant="button">{row.id}</SoftTypography>,
        name: <SoftTypography variant="button">{row.name}</SoftTypography>,
        role: <SoftTypography variant="button">{row.role}</SoftTypography>,
        branch: <SoftTypography variant="button">{row.branch}</SoftTypography>,
        shift: <SoftTypography variant="button">{row.shift}</SoftTypography>,
        login_time: (
          <SoftTypography variant="button">{row.login_time}</SoftTypography>
        ),
        logout_time: (
          <SoftTypography variant="button">{row.logout_time}</SoftTypography>
        ),
        status: (
          <SoftTypography
            variant="button"
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
  /*                                Render UI                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          All Attendance Records
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
            Sorry! You don&apos;t have permission.
          </SoftTypography>
        ) : (
          <Table columns={allowedColumns} rows={allowedRows} />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default AllAttendanceTable;
