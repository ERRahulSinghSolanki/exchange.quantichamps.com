/**
 * Component: TrashedDepartmentList
 * Purpose : Lists trashed departments with restore option (permission-aware)
 */

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
import RestoreIcon from "@mui/icons-material/Restore";
import { API_URL } from "config";
import { useAuth } from "../../../AuthContext";        // 🔐 permissions

const PERMISSION_PREFIX = "viewtrasheddepartment.";     // ⭐ prefix

const TrashedDepartmentList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [restoringId, setRestoringId] = useState(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const navigate = useNavigate();

  /* ---------------- fetch data ---------------- */
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/departments/trashed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Failed to fetch trashed departments"); 
      }
      const { data } = await res.json();
      setDepartments(data || []);
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Error loading trashed departments", 
        color: "error" 
      });
    } finally { 
      setLoading(false); 
    }
  };
  useEffect(() => { fetchDepartments(); }, []);

  /* ---------------- restore handlers ---------------- */
  const handleRestoreClick = (department) => { 
    setSelectedDepartment(department); 
    setRestoreDialogOpen(true); 
  };
  const handleRestoreConfirm = async () => {
    try {
      setRestoringId(selectedDepartment.id);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/departments/restore/${selectedDepartment.id}`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Restore failed"); 
      }
      setSnackbar({ 
        open: true, 
        message: "Department restored successfully", 
        color: "success" 
      });
      fetchDepartments();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Restore failed", 
        color: "error" 
      });
    } finally { 
      setRestoringId(null); 
      setRestoreDialogOpen(false); 
      setSelectedDepartment(null); 
    }
  };

  /* ---------------- sorting helpers ---------------- */
  const handleRequestSort = (prop) => {
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc"); 
    setOrderBy(prop);
  };

  const sortedDepartments = useMemo(() => {
    if (!departments) return [];
    return [...departments].sort((a, b) => {
      let A = a[orderBy] ?? ""; 
      let B = b[orderBy] ?? "";
      if (typeof A === "string") A = A.toLowerCase();
      if (typeof B === "string") B = B.toLowerCase();
      if (A < B) return order === "asc" ? -1 : 1;
      if (A > B) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [departments, orderBy, order]);

  /* ---------------- column definitions ---------------- */
  const baseColumns = [
    { key: "id", label: "ID", width: 80, sortId: "id", align: "left", permission: `${PERMISSION_PREFIX}id` },
    { key: "name", label: "Name", width: 150, sortId: "name", align: "left", permission: `${PERMISSION_PREFIX}name` },
    { key: "deleted_at", label: "Deleted At", width: 150, sortId: "deleted_at", align: "left", permission: `${PERMISSION_PREFIX}deleted_at` },
    { key: "status", label: "Status", width: 100, sortId: "status", align: "left", permission: `${PERMISSION_PREFIX}status` },
    { key: "actions", label: "Actions", width: 100, sortId: null, align: "center", permission: `${PERMISSION_PREFIX}actions` },
  ];

  const allowedColumns = authPermissions.length === 0
    ? baseColumns
    : baseColumns.filter(c => authPermissions.includes(c.permission));

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color} 
        icon="notifications" 
        title="Department Management"
        content={snackbar.message} 
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        time={3000}
      />

      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">Trashed Department List</SoftTypography>
          <SoftButton 
            variant="gradient" 
            color="info" 
            startIcon={<Icon>add</Icon>}
            onClick={() => navigate("/departments/add")}
          >
            Add New Department
          </SoftButton>
        </SoftBox>

        <Card sx={{ overflow: "visible" }}>
          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress size={50} color="info" />
            </SoftBox>
          ) : (
            <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
              <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                {/* ---------- header ---------- */}
                <TableHead sx={{ display: "contents" }}>
                  <TableRow sx={{ backgroundColor: "rgb(23, 193, 232)", color: "#fff" }}>
                    {allowedColumns.map(col => (
                      <TableCell 
                        key={col.key} 
                        align={col.align || "left"}
                        sx={{ fontWeight: 600, minWidth: col.width, color: "#fff" }}
                        sortDirection={orderBy === col.sortId ? order : false}
                      >
                        {col.sortId ? (
                          <TableSortLabel
                            active={orderBy === col.sortId}
                            direction={orderBy === col.sortId ? order : "asc"}
                            onClick={() => handleRequestSort(col.sortId)}
                            sx={{
                              color: "#fff !important",
                              "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                              "& .MuiTableSortLabel-label": { color: "#fff !important" }
                            }}
                          >
                            {col.label}
                          </TableSortLabel>
                        ) : col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* ---------- body ---------- */}
                <TableBody>
                  {sortedDepartments.length > 0 ? (
                    sortedDepartments.map(department => (
                      <TableRow key={department.id} hover>
                        {allowedColumns.map(col => {
                          switch (col.key) {
                            case "id":
                              return (
                                <TableCell key={col.key} sx={{ minWidth: col.width }}>
                                  {department.id}
                                </TableCell>
                              );
                            case "name":
                              return (
                                <TableCell key={col.key}
                                  sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500, minWidth: col.width }}>
                                  {department.name}
                                </TableCell>
                              );
                            case "deleted_at":
                              return (
                                <TableCell key={col.key} sx={{ minWidth: col.width }}>
                                  {new Date(department.deleted_at).toLocaleString()}
                                </TableCell>
                              );
                            case "status":
                              return (
                                <TableCell key={col.key} sx={{ minWidth: col.width }}>
                                  <SoftBox display="inline-flex" alignItems="center" px={1.5} py={0.5} borderRadius={1}
                                    bgcolor={department.status ? "success.light" : "error.light"}>
                                    <SoftTypography variant="caption" fontWeight="bold"
                                      color={department.status ? "success.dark" : "error.dark"}>
                                      {department.status ? "ACTIVE" : "INACTIVE"}
                                    </SoftTypography>
                                  </SoftBox>
                                </TableCell>
                              );
                            case "actions":
                              return (
                                <TableCell key={col.key} align="center" sx={{ minWidth: col.width }}>
                                  <Tooltip title="Restore Department">
                                    <IconButton 
                                      size="small" 
                                      color="success"
                                      onClick={() => handleRestoreClick(department)} 
                                      aria-label="restore"
                                    >
                                      <RestoreIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              );
                            default: 
                              return null;
                          }
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={allowedColumns.length} align="center" sx={{ py: 4 }}>
                        No trashed departments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </SoftBox>

      {/* ---------- Restore dialog ---------- */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Confirm Restore</DialogTitle>
        <DialogContent>
          <SoftTypography variant="body2">
            Are you sure you want to restore the department <strong>{selectedDepartment?.name}</strong>?
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton
            color="info" 
            variant="contained"
            onClick={handleRestoreConfirm}
            disabled={restoringId === selectedDepartment?.id}
            sx={{ 
              backgroundColor: "rgb(23, 193, 232)", 
              "&:hover": { backgroundColor: "rgba(23, 193, 232, 0.8)" }, 
              color: "#fff" 
            }}
          >
            {restoringId === selectedDepartment?.id ? 
              <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </SoftButton>
          <SoftButton
            variant="contained" 
            onClick={() => setRestoreDialogOpen(false)}
            sx={{ 
              backgroundColor: "red", 
              "&:hover": { backgroundColor: "darkred" }, 
              color: "#fff" 
            }}
          >
            Cancel
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default TrashedDepartmentList;