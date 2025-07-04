// src/pages/admin/IdleLogs.jsx
// ----------------------------------------------------------------
// • Column‑level permissions: idelog.<columnKey> ( + legacy idlelog.* )
// • Pagination controls identical to UsersList page
// • Fallback to localStorage for permissions
// ----------------------------------------------------------------

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { API_URL } from "config";
import { useAuth } from "../../../AuthContext";      // 2 dots: admin → pages → src

import DashboardLayout   from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar   from "examples/Navbars/DashboardNavbar";
import SoftBox           from "components/SoftBox";
import SoftTypography    from "components/SoftTypography";
import Table             from "examples/Tables/Table";
import CircularProgress  from "@mui/material/CircularProgress";
import IconButton        from "@mui/material/IconButton";
import ChevronLeftIcon   from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon  from "@mui/icons-material/ChevronRight";
import SoftButton        from "components/SoftButton";            // pagination buttons
import TextField         from "@mui/material/TextField";

const PAGE_SIZE = 25;

/* ---------------------------------------------------------------- */
const IdleLogs = () => {
  /* -------- permissions -------- */
  const { permissions: ctxPerms = [], isAuthReady } = useAuth();

  const storedPerms = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]");
    } catch {
      const raw = localStorage.getItem("permissions") || "";
      return raw.split(",").filter(Boolean);
    }
  }, []);

  const permNames = ctxPerms.length ? ctxPerms : storedPerms;
  const permSet   = useMemo(
    () => new Set(permNames.map((p) => (typeof p === "string" ? p : p.name))),
    [permNames]
  );

  const userHas = useCallback(
    (col) => permSet.has(`idelog.${col}`) || permSet.has(`idlelog.${col}`),
    [permSet]
  );

  /* -------- data + pagination state -------- */
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPag]  = useState({
    page: 1,
    perPage: PAGE_SIZE,
    total: 0,
    lastPage: 1,
  });
  const [pageInput, setPageInput] = useState(1);

  /* -------- fetch API -------- */
  const fetchIdleLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res   = await fetch(
        `${API_URL}/idle-logs?page=${page}&per_page=${PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("API error");
      const data  = await res.json();

      /* build rows */
      const apiRows = data.data || data.users?.data || data.users || [];
      const total   = data.total || data.users?.total || apiRows.length;
      const lastPg  = data.last_page || Math.max(1, Math.ceil(total / PAGE_SIZE));

      const rows = apiRows.map((log, idx) => {
        const user   = log.user || {};
        const branch = user.branch?.name || "-";
        const shift  = user.shifts?.[0] || {};

        return {
          no:          (page - 1) * PAGE_SIZE + idx + 1,
          user:        user.name || "-",
          branch,
          shiftType:   shift.type || "-",
          shiftCode:   shift.shift_code || "-",
          shiftStart:  shift.start_time || "-",
          shiftEnd:    shift.end_time   || "-",
          role:        user.role || "-",
          start:       log.idle_start ? new Date(log.idle_start).toLocaleString("en-GB") : "-",
          end:         log.idle_end   ? new Date(log.idle_end).toLocaleString("en-GB")   : "-",
          duration:    log.idle_duration_time || "-",
        };
      });

      setLogs(rows);
      setPag({ page, perPage: PAGE_SIZE, total, lastPage: lastPg });
    } catch (err) {
      console.error("Idle logs fetch failed:", err);
      setLogs([]);
      setPag((p) => ({ ...p, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, []);

  /* initial + whenever page changes */
  useEffect(() => {
    fetchIdleLogs(pagination.page);
  }, [fetchIdleLogs, pagination.page]);

  /* keep input synced */
  useEffect(() => {
    setPageInput(pagination.page);
  }, [pagination.page]);

  /* -------- column definitions -------- */
  const allColumns = [
    { key: "no",         label: "No.",         align: "left"   },
    { key: "user",       label: "User",        align: "left"   },
    { key: "branch",     label: "Branch",      align: "left"   },
    { key: "shiftType",  label: "Shift Type",  align: "center" },
    { key: "shiftCode",  label: "Shift Code",  align: "center" },
    { key: "shiftStart", label: "Shift Start", align: "center" },
    { key: "shiftEnd",   label: "Shift End",   align: "center" },
    { key: "role",       label: "Role",        align: "center" },
    { key: "start",      label: "Idle Start",  align: "center" },
    { key: "end",        label: "Idle End",    align: "center" },
    { key: "duration",   label: "Duration",    align: "center" },
  ];

  const visibleColumns = useMemo(
    () => allColumns.filter((c) => userHas(c.key)),
    [allColumns, userHas]
  );

  const visibleRows = useMemo(
    () =>
      logs.map((row) =>
        Object.fromEntries(Object.entries(row).filter(([k]) => userHas(k)))
      ),
    [logs, userHas]
  );

  /* -------- pagination handlers -------- */
  const totalPages = Math.max(1, pagination.lastPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPag((prev) => ({ ...prev, page: newPage }));
    }
  };

  /* -------- render -------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h4" fontWeight="bold" mb={2}>
          Idle Logs
        </SoftTypography>

        {/* Pagination Controls (top) */}
        <SoftBox display="flex" justifyContent="center" alignItems="center" mt={1} gap={1}>
          <SoftButton variant="outlined" size="small" disabled={pagination.page === 1}
            onClick={() => handlePageChange(1)}>
            {"<<"}
          </SoftButton>
          <SoftButton variant="outlined" size="small" disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}>
            {"<"}
          </SoftButton>

          <input
            type="number"
            value={pageInput}
            min={1}
            max={totalPages}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePageChange(parseInt(pageInput, 10))}
            onBlur={() => handlePageChange(parseInt(pageInput, 10))}
            style={{
              width: "60px",
              textAlign: "center",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          <SoftButton variant="outlined" size="small"
            disabled={pagination.page >= totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}>
            {">"}
          </SoftButton>
          <SoftButton variant="outlined" size="small"
            disabled={pagination.page >= totalPages}
            onClick={() => handlePageChange(totalPages)}>
            {">>"}
          </SoftButton>
        </SoftBox>

        {/* Showing X to Y of Z */}
        <SoftTypography variant="caption" color="text" mt={1} textAlign="center" display="block">
          {pagination.total > 0 && (
            <>
              Showing <strong>{(pagination.page - 1) * pagination.perPage + 1}</strong> to{" "}
              <strong>{Math.min(pagination.page * pagination.perPage, pagination.total)}</strong> of{" "}
              <strong>{pagination.total}</strong> entries
            </>
          )}
        </SoftTypography>

        {/* Table or loader */}
        {loading || !isAuthReady ? (
          <SoftBox display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="info" />
          </SoftBox>
        ) : visibleColumns.length === 0 ? (
          <SoftTypography color="error" mt={4}>
            You do not have permission to view any columns.
          </SoftTypography>
        ) : (
          <Table
            columns={visibleColumns.map(({ key, label, align }) => ({
              name: key,
              label,
              align,
            }))}
            rows={visibleRows}
            sx={{
              "& .MuiTableCell-head": {
                fontWeight: "bold !important",
                fontSize: "0.875rem !important",
                padding: "8px 26px !important",
                verticalAlign: "middle",
              },
              "& .MuiTableCell-body": {
                padding: "12px 16px !important",
                verticalAlign: "middle",
              },
              "& .MuiTable-root": { tableLayout: "fixed" },
            }}
          />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default IdleLogs;
