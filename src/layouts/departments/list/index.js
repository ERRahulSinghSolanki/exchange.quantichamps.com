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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "config";
import { useAuth } from "../../../AuthContext";

const PERMISSION_PREFIX = "viewDepartment.";  // Changed to department permissions

const DepartmentList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  /* ---------------- sorting ---------------- */
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const handleRequestSort = (prop) => {
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc"); 
    setOrderBy(prop);
  };

  /* ---------------- fetch departments ---------------- */
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/departments`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Failed to fetch departments"); 
      }
      const { data } = await res.json();
      setDepartments(data || []);
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Error loading departments", 
        color: "error" 
      });
    } finally { 
      setLoading(false); 
    }
  };
  useEffect(() => { fetchDepartments(); }, []);

  /* ---------------- delete handlers ---------------- */
  const handleDeleteClick = (department) => { 
    setSelectedDepartment(department); 
    setDeleteDialogOpen(true); 
  };
  const handleEditClick = (department) => navigate(`/departments/edit/${department.id}`);
  const handleDeleteConfirm = async () => {
    try {
      setDeletingId(selectedDepartment.id);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/departments/${selectedDepartment.id}`, {
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Delete failed"); 
      }
      setSnackbar({ 
        open: true, 
        message: "Department deleted successfully", 
        color: "success" 
      });
      fetchDepartments();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Delete failed", 
        color: "error" 
      });
    } finally { 
      setDeletingId(null); 
      setDeleteDialogOpen(false); 
      setSelectedDepartment(null); 
    }
  };

  /* ---------------- sort departments ---------------- */
  const sortedDepartments = useMemo(() => {
    if (!departments) return [];
    return [...departments].sort((a, b) => {
      let A = a[orderBy], B = b[orderBy];
      if (A === null || A === undefined) A = ""; 
      if (B === null || B === undefined) B = "";
      if (typeof A === "string") A = A.toLowerCase(); 
      if (typeof B === "string") B = B.toLowerCase();
      if (A < B) return order === "asc" ? -1 : 1;
      if (A > B) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [departments, orderBy, order]);

  /* ---------------- column definitions ---------------- */
  const baseColumns = useMemo(() => [
    { key: "id", label: "ID", width: 80, sortId: "id", align: "left", permission: `${PERMISSION_PREFIX}id` },
    { key: "name", label: "Name", width: 200, sortId: "name", align: "left", permission: `${PERMISSION_PREFIX}name` },
    { key: "code", label: "Code", width: 120, sortId: "code", align: "left", permission: `${PERMISSION_PREFIX}code` },
    { key: "created_at", label: "Created At", width: 180, sortId: "created_at", align: "left", permission: `${PERMISSION_PREFIX}created_at` },
    { key: "status", label: "Status", width: 120, sortId: "status", align: "left", permission: `${PERMISSION_PREFIX}status` },
    { key: "actions", label: "Actions", width: 150, sortId: null, align: "center", permission: `${PERMISSION_PREFIX}actions` },
  ], []);

  const allowedColumns = useMemo(() => (
    authPermissions.length === 0 ? baseColumns
      : baseColumns.filter(c => authPermissions.includes(c.permission))
  ), [baseColumns, authPermissions]);

  /* ---------------- render ---------------- */
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
          <SoftTypography variant="h4" fontWeight="bold">Department List</SoftTypography>
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
            <>
              <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                  {/* ---------- header ---------- */}
                  <TableHead sx={{ display: "contents" }}>
                    <TableRow sx={{ backgroundColor: "rgb(23, 193, 232)", color: "#fff" }}>
                      {allowedColumns.map(col => (
                        <TableCell
                          key={col.key} 
                          align={col.align || "left"} 
                          sx={{ 
                            fontWeight: 600, 
                            minWidth: col.width, 
                            width: col.width,
                            color: "#fff" 
                          }}
                          sortDirection={orderBy === col.sortId ? order : false}
                        >
                          {col.sortId ? (
                            <TableSortLabel
                              active={orderBy === col.sortId}
                              direction={orderBy === col.sortId ? order : "asc"}
                              onClick={() => handleRequestSort(col.sortId)}
                              sx={{
                                color: "#fff",
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
                      sortedDepartments.map(dept => (
                        <TableRow key={dept.id} hover>
                          {allowedColumns.map(col => {
                            switch (col.key) {
                              case "id":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width,
                                      whiteSpace: "nowrap", 
                                      overflow: "hidden", 
                                      textOverflow: "ellipsis" 
                                    }}
                                  >
                                    {dept.id}
                                  </TableCell>
                                );
                              case "name":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width,
                                      whiteSpace: "nowrap", 
                                      overflow: "hidden", 
                                      textOverflow: "ellipsis",
                                      fontWeight: 500 
                                    }}
                                  >
                                    {dept.name}
                                  </TableCell>
                                );
                              case "code":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width 
                                    }}
                                  >
                                    <SoftTypography variant="button" fontWeight="medium">
                                      {dept.code}
                                    </SoftTypography>
                                  </TableCell>
                                );
                              case "created_at":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width 
                                    }}
                                  >
                                    {new Date(dept.created_at).toLocaleString()}
                                  </TableCell>
                                );
                              case "status":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width 
                                    }}
                                  >
                                    <SoftBox 
                                      display="inline-flex" 
                                      alignItems="center" 
                                      px={1.5} 
                                      py={0.5} 
                                      borderRadius={1}
                                      bgcolor={dept.status ? "success.light" : "error.light"}
                                    >
                                      <SoftTypography 
                                        variant="caption" 
                                        fontWeight="bold"
                                        color={dept.status ? "success.dark" : "error.dark"}
                                      >
                                        {dept.status ? "ACTIVE" : "INACTIVE"}
                                      </SoftTypography>
                                    </SoftBox>
                                  </TableCell>
                                );
                              case "actions":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    align="center" 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width 
                                    }}
                                  >
                                    <Tooltip title="Edit Department">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleEditClick(dept)} 
                                        aria-label="edit"
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Department">
                                      <IconButton 
                                        size="small" 
                                        color="error" 
                                        onClick={() => handleDeleteClick(dept)} 
                                        aria-label="delete"
                                      >
                                        <DeleteIcon fontSize="small" />
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
                          No departments found.
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

      {/* ---------- Delete Confirmation Dialog ---------- */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <SoftTypography variant="body2">
            Are you sure you want to delete the department <strong>{selectedDepartment?.name}</strong>?
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton
            color="info" 
            variant="contained" 
            onClick={handleDeleteConfirm}
            disabled={deletingId === selectedDepartment?.id}
            sx={{ 
              backgroundColor: "rgb(23, 193, 232)", 
              "&:hover": { backgroundColor: "rgba(23, 193, 232, 0.8)" }, 
              color: "#fff", 
              minWidth: 100 
            }}
          >
            {deletingId === selectedDepartment?.id ? 
              <CircularProgress size={20} color="inherit" /> : 
              "Confirm"
            }
          </SoftButton>
          <SoftButton
            variant="contained" 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              backgroundColor: "red", 
              "&:hover": { backgroundColor: "darkred" }, 
              color: "#fff", 
              minWidth: 100 
            }}
          >
            Cancel
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DepartmentList;