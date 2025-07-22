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
import { useAuth } from "../../../AuthContext";

const PERMISSION_PREFIX = "viewTrashedDesignation.";  // Updated to trashed designation permissions

const TrashedDesignationList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [restoringId, setRestoringId] = useState(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const navigate = useNavigate();

  /* ---------------- sorting ---------------- */
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const handleRequestSort = (prop) => {
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc"); 
    setOrderBy(prop);
  };

  /* ---------------- fetch designations ---------------- */
  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/designations/trashed/list`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Failed to fetch trashed designations"); 
      }
      const { data } = await res.json();
      setDesignations(data || []);
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Error loading trashed designations", 
        color: "error" 
      });
    } finally { 
      setLoading(false); 
    }
  };
  useEffect(() => { fetchDesignations(); }, []);

  /* ---------------- restore handlers ---------------- */
  const handleRestoreClick = (designation) => { 
    setSelectedDesignation(designation); 
    setRestoreDialogOpen(true); 
  };
  const handleRestoreConfirm = async () => {
    try {
      setRestoringId(selectedDesignation.id);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/designations/restore/${selectedDesignation.id}`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { 
        const err = await res.json(); 
        throw new Error(err.message || "Restore failed"); 
      }
      setSnackbar({ 
        open: true, 
        message: "Designation restored successfully", 
        color: "success" 
      });
      fetchDesignations();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Restore failed", 
        color: "error" 
      });
    } finally { 
      setRestoringId(null); 
      setRestoreDialogOpen(false); 
      setSelectedDesignation(null); 
    }
  };

  /* ---------------- sort designations ---------------- */
  const sortedDesignations = useMemo(() => {
    if (!designations) return [];
    return [...designations].sort((a, b) => {
      let A = a[orderBy], B = b[orderBy];
      if (A === null || A === undefined) A = ""; 
      if (B === null || B === undefined) B = "";
      if (typeof A === "string") A = A.toLowerCase(); 
      if (typeof B === "string") B = B.toLowerCase();
      if (A < B) return order === "asc" ? -1 : 1;
      if (A > B) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [designations, orderBy, order]);

  /* ---------------- column definitions ---------------- */
  const baseColumns = useMemo(() => [
    { key: "id", label: "ID", width: 80, sortId: "id", align: "left", permission: `${PERMISSION_PREFIX}id` },
    { key: "name", label: "Name", width: 200, sortId: "name", align: "left", permission: `${PERMISSION_PREFIX}name` },
    { key: "code", label: "Code", width: 120, sortId: "code", align: "left", permission: `${PERMISSION_PREFIX}code` },
    { key: "deleted_at", label: "Deleted At", width: 180, sortId: "deleted_at", align: "left", permission: `${PERMISSION_PREFIX}deleted_at` },
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
        title="Designation Management"
        content={snackbar.message} 
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        time={3000}
      />

      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">Trashed Designation List</SoftTypography>
          <SoftButton
            variant="gradient" 
            color="info" 
            startIcon={<Icon>add</Icon>}
            onClick={() => navigate("/designations/add")}
          >
            Add New Designation
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
                    {sortedDesignations.length > 0 ? (
                      sortedDesignations.map(desg => (
                        <TableRow key={desg.id} hover>
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
                                    {desg.id}
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
                                    {desg.name}
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
                                      {desg.code}
                                    </SoftTypography>
                                  </TableCell>
                                );
                              case "deleted_at":
                                return (
                                  <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                      minWidth: col.width,
                                      width: col.width 
                                    }}
                                  >
                                    {new Date(desg.deleted_at).toLocaleString()}
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
                                      bgcolor={desg.status ? "success.light" : "error.light"}
                                    >
                                      <SoftTypography 
                                        variant="caption" 
                                        fontWeight="bold"
                                        color={desg.status ? "success.dark" : "error.dark"}
                                      >
                                        {desg.status ? "ACTIVE" : "INACTIVE"}
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
                                    <Tooltip title="Restore Designation">
                                      <IconButton 
                                        size="small" 
                                        color="primary" 
                                        onClick={() => handleRestoreClick(desg)} 
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
                          No trashed designations found.
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

      {/* ---------- Restore Confirmation Dialog ---------- */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Confirm Restoration</DialogTitle>
        <DialogContent>
          <SoftTypography variant="body2">
            Are you sure you want to restore the designation <strong>{selectedDesignation?.name}</strong>?
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton
            color="info" 
            variant="contained" 
            onClick={handleRestoreConfirm}
            disabled={restoringId === selectedDesignation?.id}
            sx={{ 
              backgroundColor: "rgb(23, 193, 232)", 
              "&:hover": { backgroundColor: "rgba(23, 193, 232, 0.8)" }, 
              color: "#fff", 
              minWidth: 100 
            }}
          >
            {restoringId === selectedDesignation?.id ? 
              <CircularProgress size={20} color="inherit" /> : 
              "Confirm"
            }
          </SoftButton>
          <SoftButton
            variant="contained" 
            onClick={() => setRestoreDialogOpen(false)}
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

export default TrashedDesignationList;