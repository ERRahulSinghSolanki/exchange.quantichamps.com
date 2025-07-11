import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";
import { useAuth } from "../../../AuthContext";
import TextField from "@mui/material/TextField";
import SoftButton from "components/SoftButton";

// Utility function to format duration
const formatDuration = (durationMinutes) => {
  const totalSeconds = Math.round(durationMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0 && seconds === 0) return "0 sec";
  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
};

const PERMISSION_PREFIX = "allbreaks.";

const AllBreaksTable = () => {
  const { permissions: authPermissions = [] } = useAuth();
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 25,
    total: 0,
  });
  const [pageInput, setPageInput] = useState(1);

  // Fetch data with pagination and search
  const fetchBreaks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${API_URL}/attendance/breaks/all?page=${pagination.page}&per_page=${pagination.perPage}&q=${searchName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setPagination((prev) => ({
        ...prev,
        total: json.total || json.data?.length || 0,
      }));
    } catch (err) {
      console.error("Error fetching all breaks:", err);
      setBreaks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaks();
  }, [pagination.page, pagination.perPage, searchName]);

  useEffect(() => {
    setPageInput(pagination.page);
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.perPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((p) => ({ ...p, page: newPage }));
    }
  };

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

  const allowedColumns = useMemo(() => {
    if (!authPermissions || authPermissions.length === 0) return baseColumns;
    return baseColumns.filter((c) => authPermissions.includes(c.permission));
  }, [baseColumns, authPermissions]);

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

  const allowedRows = useMemo(() => {
    return allRows.map((row) => {
      const subset = {};
      allowedColumns.forEach((c) => {
        subset[c.name] = row[c.name];
      });
      return subset;
    });
  }, [allRows, allowedColumns]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h5" fontWeight="medium">
            All Breaks
          </SoftTypography>
        </SoftBox>

        {/* Search by Name */}
        <SoftBox display="flex" justifyContent="center" flexDirection="column" alignItems="center" mb={3}>
          <SoftTypography variant="button" fontWeight="bold" mb={1}>
            Search by Name
          </SoftTypography>
          <TextField
            variant="outlined"
            size="small"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter name..."
          />
        </SoftBox>

        {/* Pagination Controls */}
        <SoftBox display="flex" justifyContent="center" alignItems="center" my={2} gap={1}>
          <SoftButton
            size="small"
            variant="outlined"
            onClick={() => handlePageChange(1)}
            disabled={pagination.page === 1}
          >
            {"<<"}
          </SoftButton>
          <SoftButton
            size="small"
            variant="outlined"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
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
            Sorry! You don&apos;t have permission.
          </SoftTypography>
        ) : (
          <Table columns={allowedColumns} rows={allowedRows} />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default AllBreaksTable;