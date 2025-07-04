// src/pages/admin/ShiftList.jsx
// --------------------------------------------------------------
// • Column‑level permissions →  "viewshift.<key>"  (अब actions भी)
// --------------------------------------------------------------

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout   from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar   from "examples/Navbars/DashboardNavbar";
import SoftBox           from "components/SoftBox";
import SoftTypography    from "components/SoftTypography";
import SoftSnackbar      from "components/SoftSnackbar";
import SoftButton        from "components/SoftButton";

import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Card, IconButton, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TableContainer, TableSortLabel
} from "@mui/material";
import Icon         from "@mui/material/Icon";
import EditIcon     from "@mui/icons-material/Edit";
import DeleteIcon   from "@mui/icons-material/Delete";

import { API_URL } from "config";
import { useAuth } from "../../../../AuthContext";   // ← वही path जैसा तुम्हारे प्रोजेक्ट में है

/* ───────────────────────────────────────────────────────────── */
const ShiftList = () => {
  /* ---------- permissions ---------- */
  const { permissions: ctxPerms = [], isAuthReady } = useAuth();
  const storedPerms = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("permissions") || "[]"); }
    catch { return (localStorage.getItem("permissions") || "").split(",").filter(Boolean); }
  }, []);
  const permSet = useMemo(
    () => new Set((ctxPerms.length ? ctxPerms : storedPerms).map((p) => (typeof p === "string" ? p : p.name))),
    [ctxPerms, storedPerms]
  );
  const userHas = useCallback((colKey) => permSet.has(`viewshift.${colKey}`), [permSet]);

  /* ---------- state ---------- */
  const [shifts, setShifts]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [snackbar, setSnackbar]       = useState({ open: false, message: "", color: "success" });
  const [deletingId, setDeletingId]   = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift]       = useState(null);

  /* --- sorting --- */
  const [orderBy, setOrderBy] = useState("shift_code");
  const [order, setOrder]     = useState("asc");

  const navigate = useNavigate();

  /* ---------- fetch ---------- */
  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res   = await fetch(`${API_URL}/shifts`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed to fetch shifts"); }
      const { data } = await res.json();
      setShifts(data || []);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, color: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchShifts(); }, [fetchShifts]);

  /* ---------- column meta ---------- */
  const columnDefs = [
    { key: "branch",             label: "Branch",            width: 150, id: "branch.name" },
    { key: "shift_code",         label: "Shift Code",        width: 100 },
    { key: "type",               label: "Type",              width: 80 },
    { key: "start_time",         label: "Start Time",        width: 100 },
    { key: "end_time",           label: "End Time",          width: 100 },
    { key: "has_flexible_break", label: "Flexible Break",    width: 120 },
    { key: "break_duration",     label: "Break Duration",    width: 120 },
    { key: "grace_time",         label: "Grace Time (min)",  width: 120 },
    { key: "expected_hours",     label: "Expected Hours",    width: 120 },
    { key: "is_active",          label: "Status",            width: 100 },
    { key: "actions",            label: "Actions",           width: 120, align: "center", noSort: true },
  ];

  /* ✅ यहाँ सिर्फ़ एक लाइन बदली गयी है → अब actions भी permission‑gated */
  const visibleColumns = useMemo(
    () => columnDefs.filter((c) => userHas(c.key)),
    [columnDefs, userHas]
  );

  /* ---------- sorting ---------- */
  const sortedShifts = useMemo(() => {
    if (!shifts) return [];
    return [...shifts].sort((a, b) => {
      if (!orderBy) return 0;
      let valA, valB;
      if (orderBy === "branch.name") {
        valA = a.branch?.name || a.branch_name || "";
        valB = b.branch?.name || b.branch_name || "";
      } else {
        valA = a[orderBy];
        valB = b[orderBy];
      }
      valA = valA ?? ""; valB = valB ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1  : -1;
      return 0;
    });
  }, [shifts, orderBy, order]);

  const handleRequestSort = (prop) => {
    if (!prop) return;
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(prop);
  };

  /* ---------- helpers ---------- */
  const formatTime      = (t) => t ? `${t.split(":")[0]}:${t.split(":")[1]}` : "N/A";
  const formatDuration  = (m) => m ? `${Math.floor(m/60)}h ${m%60}m` : "N/A";

  /* ---------- delete / edit ---------- */
  const handleDeleteClick  = (shift) => { setSelectedShift(shift); setDeleteDialogOpen(true); };
  const handleEditClick    = (shift) => navigate(`/projects/shifts/edit/${shift.id}`);
  const handleDeleteConfirm = async () => {
    try {
      setDeletingId(selectedShift.id);
      const token = localStorage.getItem("authToken");
      const res   = await fetch(`${API_URL}/shifts/${selectedShift.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Delete failed"); }
      setSnackbar({ open: true, message: "Shift deleted successfully", color: "success" });
      await fetchShifts();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Delete failed", color: "error" });
    } finally {
      setDeletingId(null); setDeleteDialogOpen(false); setSelectedShift(null);
    }
  };

  /* ---------- render ---------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color}
        icon="notifications"
        title="Shift Management"
        content={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        time={3000}
      />

      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">Shift List</SoftTypography>
          <SoftButton variant="gradient" color="info" onClick={() => navigate("/projects/shifts/add")} startIcon={<Icon>add</Icon>}>
            Add New Shift
          </SoftButton>
        </SoftBox>

        <Card sx={{ overflow: "visible" }}>
          {loading || !isAuthReady ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress size={50} color="info" />
            </SoftBox>
          ) : (
            <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
              <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                {/* ---- Header ---- */}
                <TableHead style={{ display: "contents" }}>
                  <TableRow sx={{ backgroundColor: "rgb(23, 193, 232)" }}>
                    {visibleColumns.map(({ key, label, width, align, id, noSort }) => (
                      <TableCell
                        key={label}
                        sx={{ fontWeight: 600, minWidth: width, color: "#fff" }}
                        align={align || "left"}
                        sortDirection={orderBy === (id || key) ? order : false}
                      >
                        {noSort ? (
                          label
                        ) : (
                          <TableSortLabel
                            active={orderBy === (id || key)}
                            direction={orderBy === (id || key) ? order : "asc"}
                            onClick={() => handleRequestSort(id || key)}
                            sx={{
                              color: "#fff",
                              "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                              "& .MuiTableSortLabel-label": { color: "#fff !important" },
                            }}
                          >
                            {label}
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* ---- Body ---- */}
                <TableBody>
                  {sortedShifts.length ? (
                    sortedShifts.map((shift) => (
                      <TableRow key={shift.id} hover>
                        {visibleColumns.map(({ key, align }) => {
                          let content;
                          switch (key) {
                            case "branch":
                              content = shift.branch?.name || shift.branch_name || "N/A";
                              break;
                            case "shift_code":
                              content = shift.shift_code || "N/A";
                              break;
                            case "type":
                              content = shift.type || "N/A";
                              break;
                            case "start_time":
                              content = formatTime(shift.start_time);
                              break;
                            case "end_time":
                              content = formatTime(shift.end_time);
                              break;
                            case "has_flexible_break":
                              content = shift.has_flexible_break ? "Yes" : "No";
                              break;
                            case "break_duration":
                              content = formatDuration(shift.break_duration);
                              break;
                            case "grace_time":
                              content = `${shift.grace_time || 0} min`;
                              break;
                            case "expected_hours":
                              content = shift.expected_hours ? `${shift.expected_hours / 60}h` : "N/A";
                              break;
                            case "is_active":
                              content = (
                                <SoftBox display="inline-flex" alignItems="center" px={1.5} py={0.5} borderRadius={1}
                                         bgcolor={shift.is_active ? "success.light" : "error.light"}>
                                  <SoftTypography variant="caption" fontWeight="bold"
                                                  color={shift.is_active ? "success.dark" : "error.dark"}>
                                    {shift.is_active ? "ACTIVE" : "INACTIVE"}
                                  </SoftTypography>
                                </SoftBox>
                              );
                              break;
                            case "actions":
                              content = (
                                <SoftBox display="flex" justifyContent="center">
                                  <Tooltip title="Edit Shift">
                                    <IconButton size="small" onClick={() => handleEditClick(shift)}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Shift">
                                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(shift)}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </SoftBox>
                              );
                              break;
                            default:
                              content = "";
                          }
                          return (
                            <TableCell key={key} align={align || "left"} sx={{ minWidth: 80 }}>
                              {content}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length} align="center" sx={{ py: 4 }}>
                        No shifts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </SoftBox>

      {/* ---- Delete Dialog ---- */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <SoftTypography variant="body2">
            Are you sure you want to delete the shift <strong>{selectedShift?.shift_code}</strong>?
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton color="info" variant="contained" onClick={handleDeleteConfirm}
                      disabled={deletingId === selectedShift?.id}
                      sx={{ backgroundColor: "rgb(23, 193, 232)", "&:hover": { backgroundColor: "rgba(23, 193, 232, 0.8)" }, color: "#fff", minWidth: 100 }}>
            {deletingId === selectedShift?.id ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </SoftButton>
          <SoftButton variant="contained" onClick={() => setDeleteDialogOpen(false)}
                      sx={{ backgroundColor: "red", "&:hover": { backgroundColor: "darkred" }, color: "#fff", minWidth: 100 }}>
            Cancel
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ShiftList;
