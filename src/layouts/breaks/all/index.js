import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";
import { useAuth } from "../../../AuthContext"; // ✅ shared auth context

// 🔧 Utility function to format duration, e.g. "3 min 20 sec"
const formatDuration = (durationMinutes) => {
  const totalSeconds = Math.round(durationMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0 && seconds === 0) return "0 sec";
  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
};

const PERMISSION_PREFIX = "allbreaks."; // 🌟 column‑level permission prefix

const AllBreaksTable = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                               Fetch data                                   */
  /* -------------------------------------------------------------------------- */
  const fetchBreaks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/attendance/breaks/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      const formatted = (json.data || []).map((b) => ({
        id: b.id,
        name: b.user?.name || "-",
        role: b.user?.role || "-",
        branch: b.user?.branch || "-",
        shift: b.user?.shift || "-",
        break_start: b.break_start ? new Date(b.break_start).toLocaleString() : "-",
        break_end: b.break_end ? new Date(b.break_end).toLocaleString() : "-",
        duration:
          b.duration_minutes !== null && b.duration_minutes !== undefined
            ? formatDuration(parseFloat(b.duration_minutes))
            : "-",
        type: b.type || "-",
      }));

      setBreaks(formatted);
    } catch (err) {
      console.error("Error fetching all breaks:", err);
      setBreaks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaks();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                Column definition WITH permission property                  */
  /* -------------------------------------------------------------------------- */
  const baseColumns = useMemo(
    () => [
      { name: "id", align: "left", permission: `${PERMISSION_PREFIX}id` },
      { name: "name", align: "left", permission: `${PERMISSION_PREFIX}name` },
      { name: "role", align: "left", permission: `${PERMISSION_PREFIX}role` },
      { name: "branch", align: "left", permission: `${PERMISSION_PREFIX}branch` },
      { name: "shift", align: "left", permission: `${PERMISSION_PREFIX}shift` },
      { name: "break_start", align: "left", permission: `${PERMISSION_PREFIX}break_start` },
      { name: "break_end", align: "left", permission: `${PERMISSION_PREFIX}break_end` },
      { name: "duration", align: "left", permission: `${PERMISSION_PREFIX}duration` },
      { name: "type", align: "left", permission: `${PERMISSION_PREFIX}type` },
    ],
    []
  );

  /* -------------------------------------------------------------------------- */
  /*                Filter allowed columns based on permissions                 */
  /* -------------------------------------------------------------------------- */
  const allowedColumns = useMemo(() => {
    if (!authPermissions || authPermissions.length === 0) return baseColumns; // legacy
    return baseColumns.filter((c) => authPermissions.includes(c.permission));
  }, [baseColumns, authPermissions]);

  /* -------------------------------------------------------------------------- */
  /*                             Construct rows                                 */
  /* -------------------------------------------------------------------------- */
  const allRows = useMemo(
    () =>
      breaks.map((b) => ({
        id: <SoftTypography variant="button">{b.id}</SoftTypography>,
        name: <SoftTypography variant="button">{b.name}</SoftTypography>,
        role: <SoftTypography variant="button">{b.role}</SoftTypography>,
        branch: <SoftTypography variant="button">{b.branch}</SoftTypography>,
        shift: <SoftTypography variant="button">{b.shift}</SoftTypography>,
        break_start: <SoftTypography variant="button">{b.break_start}</SoftTypography>,
        break_end: <SoftTypography variant="button">{b.break_end}</SoftTypography>,
        duration: (
          <SoftTypography variant="button" color="info">
            {b.duration}
          </SoftTypography>
        ),
        type: <SoftTypography variant="button">{b.type}</SoftTypography>,
      })),
    [breaks]
  );

  /* -------------------------------------------------------------------------- */
  /*                Trim rows to allowed column keys only                       */
  /* -------------------------------------------------------------------------- */
  const allowedRows = useMemo(() => {
    return allRows.map((row) => {
      const subset = {};
      allowedColumns.forEach((c) => {
        subset[c.name] = row[c.name];
      });
      return subset;
    });
  }, [allRows, allowedColumns]);

  /* -------------------------------------------------------------------------- */
  /*                                  Render                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          All Breaks
        </SoftTypography>

        {loading ? (
          <SoftBox display="flex" justifyContent="center" py={6}>
            <CircularProgress color="info" />
          </SoftBox>
        ) : breaks.length === 0 ? (
          <SoftTypography variant="body2" color="text">
            No break records found.
          </SoftTypography>
        ) : allowedColumns.length === 0 ? (
          <SoftTypography variant="body2" color="text">
            Sorry ! You don&apos;t have permission.
          </SoftTypography>
        ) : (
          <Table columns={allowedColumns} rows={allowedRows} />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default AllBreaksTable;
