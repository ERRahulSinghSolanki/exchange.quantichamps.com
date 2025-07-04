import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSnackbar from "components/SoftSnackbar";
import SoftButton from "components/SoftButton";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Card, IconButton, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TableContainer, TableSortLabel
} from "@mui/material";
import Icon from "@mui/material/Icon";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { API_URL } from "config";
import { useAuth } from "../../../../AuthContext";         // 🔐 permissions

const PERMISSION_PREFIX = "shifttrashed.";                // ⭐ prefix

const TrashedShiftList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [shifts, setShifts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [snackbar, setSnackbar]   = useState({ open: false, message: "", color: "success" });
  const [restoringId, setRestoringId] = useState(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const navigate = useNavigate();

  /* ---------------- sorting state ---------------- */
  const [orderBy, setOrderBy] = useState("shift_code");
  const [order, setOrder]     = useState("asc");

  /* ---------------- fetch data ---------------- */
  const fetchTrashedShifts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/shifts/trashed/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch trashed shifts");
      }
      const { data } = await res.json();
      setShifts(data || []);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Error loading trashed shifts", color: "error" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrashedShifts(); }, []);

  /* ---------------- restore handlers ---------------- */
  const handleRestoreClick = (shift) => { setSelectedShift(shift); setRestoreDialogOpen(true); };
  const handleRestoreConfirm = async () => {
    try {
      setRestoringId(selectedShift.id);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/shifts/restore/${selectedShift.id}`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Restore failed"); }
      setSnackbar({ open: true, message: "Shift restored successfully", color: "success" });
      fetchTrashedShifts();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Restore failed", color: "error" });
    } finally {
      setRestoringId(null); setRestoreDialogOpen(false); setSelectedShift(null);
    }
  };

  /* ---------------- sort helpers ---------------- */
  const handleRequestSort = (prop) => {
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc"); setOrderBy(prop);
  };

  const sortedShifts = useMemo(() => {
    if (!shifts) return [];
    return [...shifts].sort((a, b) => {
      let valA = a[orderBy]; let valB = b[orderBy];
      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [shifts, orderBy, order]);

  /* ---------------- column definitions ---------------- */
  const baseColumns = useMemo(() => [
    { key: "branch",             label: "Branch",           width: 150, sortId: "branch.name",        align: "left",  permission: `${PERMISSION_PREFIX}branch` },
    { key: "shift_code",         label: "Shift Code",       width: 100, sortId: "shift_code",         align: "left",  permission: `${PERMISSION_PREFIX}shift_code` },
    { key: "type",               label: "Type",             width: 80,  sortId: "type",               align: "left",  permission: `${PERMISSION_PREFIX}type` },
    { key: "start_time",         label: "Start Time",       width: 100, sortId: "start_time",         align: "left",  permission: `${PERMISSION_PREFIX}start_time` },
    { key: "end_time",           label: "End Time",         width: 100, sortId: "end_time",           align: "left",  permission: `${PERMISSION_PREFIX}end_time` },
    { key: "has_flexible_break", label: "Flexible Break",   width: 120, sortId: "has_flexible_break", align: "left",  permission: `${PERMISSION_PREFIX}has_flexible_break` },
    { key: "break_duration",     label: "Break Duration",   width: 120, sortId: "break_duration",     align: "left",  permission: `${PERMISSION_PREFIX}break_duration` },
    { key: "grace_time",         label: "Grace Time (min)", width: 120, sortId: "grace_time",         align: "left",  permission: `${PERMISSION_PREFIX}grace_time` },
    { key: "expected_hours",     label: "Expected Hours",   width: 120, sortId: "expected_hours",     align: "left",  permission: `${PERMISSION_PREFIX}expected_hours` },
    { key: "deleted_at",         label: "Deleted At",       width: 150, sortId: "deleted_at",         align: "left",  permission: `${PERMISSION_PREFIX}deleted_at` },
    { key: "actions",            label: "Actions",          width: 120, sortId: null,                 align: "center",permission: `${PERMISSION_PREFIX}actions` },
  ], []);

  const allowedColumns = useMemo(() => (
    authPermissions.length === 0 ? baseColumns
      : baseColumns.filter(c => authPermissions.includes(c.permission))
  ), [baseColumns, authPermissions]);

  /* ---------------- formatting helpers ---------------- */
  const formatTime     = (t) => { if (!t) return "N/A"; const [h,m] = t.split(":"); return `${h}:${m}`; };
  const formatDuration = (min) => { if (!min) return "N/A"; const h = Math.floor(min/60); const m = min%60; return `${h}h ${m}m`; };

  /* ---------------- render ---------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color} icon="notifications"
        title="Shift Management" content={snackbar.message}
        open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open:false })} time={3000}
      />

      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">Trashed Shift List</SoftTypography>
          <SoftButton
            variant="gradient" color="info" startIcon={<Icon>arrow_back</Icon>}
            onClick={() => navigate("/projects/shifts")}
          >
            Back to Active Shifts
          </SoftButton>
        </SoftBox>

        <Card sx={{ overflow: "visible" }}>
          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress size={50} color="info" />
            </SoftBox>
          ) : (
            <>
              <TableContainer sx={{ width:"100%", overflowX:"auto" }}>
                <Table sx={{ tableLayout:"fixed", width:"100%" }}>
                  {/* ---------------- header ---------------- */}
                  <TableHead sx={{ display:"contents" }}>
                    <TableRow sx={{ backgroundColor:"rgb(23, 193, 232)", color:"#fff" }}>
                      {allowedColumns.map(col => (
                        <TableCell
                          key={col.key} align={col.align || "left"} sx={{ fontWeight:600, minWidth:col.width, color:"#fff" }}
                          sortDirection={orderBy === col.sortId ? order : false}
                        >
                          {col.sortId ? (
                            <TableSortLabel
                              active={orderBy === col.sortId}
                              direction={orderBy === col.sortId ? order : "asc"}
                              onClick={() => handleRequestSort(col.sortId)}
                              sx={{
                                color:"#fff",
                                "& .MuiTableSortLabel-icon":{ color:"#fff !important" },
                                "& .MuiTableSortLabel-label":{ color:"#fff !important" }
                              }}
                            >{col.label}</TableSortLabel>
                          ) : col.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {/* ---------------- body ---------------- */}
                  <TableBody>
                    {sortedShifts.length > 0 ? (
                      sortedShifts.map(shift => (
                        <TableRow key={shift.id} hover>
                          {allowedColumns.map((col) => {
                            switch (col.key) {
                              case "branch":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{shift.branch?.name || shift.branch_name || "N/A"}</TableCell>;
                              case "shift_code":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{shift.shift_code || "N/A"}</TableCell>;
                              case "type":
                                return <TableCell key={col.key} sx={{ minWidth:col.width, textTransform:"capitalize" }}>{shift.type || "N/A"}</TableCell>;
                              case "start_time":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{formatTime(shift.start_time)}</TableCell>;
                              case "end_time":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{formatTime(shift.end_time)}</TableCell>;
                              case "has_flexible_break":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{shift.has_flexible_break ? "Yes" : "No"}</TableCell>;
                              case "break_duration":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{formatDuration(shift.break_duration)}</TableCell>;
                              case "grace_time":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{shift.grace_time || "0"} min</TableCell>;
                              case "expected_hours":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{shift.expected_hours ? `${shift.expected_hours/60}h` : "N/A"}</TableCell>;
                              case "deleted_at":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{new Date(shift.deleted_at).toLocaleString()}</TableCell>;
                              case "actions":
                                return (
                                  <TableCell key={col.key} align="center" sx={{ minWidth:col.width }}>
                                    <Tooltip title="Restore Shift">
                                      <IconButton size="small" color="success"
                                        onClick={() => handleRestoreClick(shift)} aria-label="restore">
                                        <RestoreFromTrashIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                );
                              default: return null;
                            }
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={allowedColumns.length} align="center" sx={{ py:4 }}>
                          No trashed shifts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Card>
      </SoftBox>

      {/* ---------------- restore confirmation dialog ---------------- */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Confirm Restoration</DialogTitle>
        <DialogContent>
          <SoftTypography variant="body2">
            Are you sure you want to restore the shift <strong>{selectedShift?.shift_code}</strong>?
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton
            color="info" variant="contained" onClick={handleRestoreConfirm}
            disabled={restoringId === selectedShift?.id}
            sx={{ backgroundColor:"rgb(23, 193, 232)", "&:hover":{ backgroundColor:"rgba(23, 193, 232, 0.8)" }, color:"#fff", minWidth:100 }}
          >
            {restoringId === selectedShift?.id ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </SoftButton>
          <SoftButton
            variant="contained" onClick={() => setRestoreDialogOpen(false)}
            sx={{ backgroundColor:"red", "&:hover":{ backgroundColor:"darkred" }, color:"#fff", minWidth:100 }}
          >
            Cancel
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default TrashedShiftList;
