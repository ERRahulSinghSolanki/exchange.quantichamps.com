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
import { useAuth } from "../../../../AuthContext";          // 🔐 permissions

const PERMISSION_PREFIX = "viewbranch.";                   // ⭐ prefix

const BranchList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [branches, setBranches]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [snackbar, setSnackbar]   = useState({ open: false, message: "", color: "success" });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate();

  /* ---------------- sorting ---------------- */
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder]     = useState("asc");
  const handleRequestSort = (prop) => {
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc"); setOrderBy(prop);
  };

  /* ---------------- fetch branches ---------------- */
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/branches`, { headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed to fetch branches"); }
      const { data } = await res.json();
      setBranches(data || []);
    } catch (err) {
      setSnackbar({ open:true, message:err.message || "Error loading branches", color:"error" });
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchBranches(); }, []);

  /* ---------------- delete handlers ---------------- */
  const handleDeleteClick   = (branch) => { setSelectedBranch(branch); setDeleteDialogOpen(true); };
  const handleEditClick     = (branch) => navigate(`/projects/branches/edit/${branch.id}`);
  const handleDeleteConfirm = async () => {
    try {
      setDeletingId(selectedBranch.id);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/branches/${selectedBranch.id}`, {
        method:"DELETE", headers:{ Authorization:`Bearer ${token}` }
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Delete failed"); }
      setSnackbar({ open:true, message:"Branch deleted successfully", color:"success" });
      fetchBranches();
    } catch (err) {
      setSnackbar({ open:true, message:err.message || "Delete failed", color:"error" });
    } finally { setDeletingId(null); setDeleteDialogOpen(false); setSelectedBranch(null); }
  };

  /* ---------------- sort branches ---------------- */
  const sortedBranches = useMemo(() => {
    if (!branches) return [];
    return [...branches].sort((a,b) => {
      let A=a[orderBy], B=b[orderBy];
      if (A===null||A===undefined) A=""; if (B===null||B===undefined) B="";
      if (typeof A==="string") A=A.toLowerCase(); if (typeof B==="string") B=B.toLowerCase();
      if (A<B) return order==="asc" ? -1 : 1;
      if (A>B) return order==="asc" ? 1  : -1;
      return 0;
    });
  }, [branches, orderBy, order]);

  /* ---------------- column definitions ---------------- */
  const baseColumns = useMemo(() => [
    { key:"name",    label:"Name",    width:150, sortId:"name",   align:"left",   permission:`${PERMISSION_PREFIX}name` },
    { key:"code",    label:"Code",    width:100, sortId:"code",   align:"left",   permission:`${PERMISSION_PREFIX}code` },
    { key:"address", label:"Address", width:250, sortId:"address",align:"left",   permission:`${PERMISSION_PREFIX}address` },
    { key:"status",  label:"Status",  width:100, sortId:"status", align:"left",   permission:`${PERMISSION_PREFIX}status` },
    { key:"actions", label:"Actions", width:150, sortId:null,     align:"center", permission:`${PERMISSION_PREFIX}actions` },
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
        color={snackbar.color} icon="notifications" title="Branch Management"
        content={snackbar.message} open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open:false })} time={3000}
      />

      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">Branch List</SoftTypography>
          <SoftButton
            variant="gradient" color="info" startIcon={<Icon>add</Icon>}
            onClick={() => navigate("/projects/branches/add")}
          >
            Add New Branch
          </SoftButton>
        </SoftBox>

        <Card sx={{ overflow:"visible" }}>
          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress size={50} color="info" />
            </SoftBox>
          ) : (
            <>
              <TableContainer sx={{ width:"100%", overflowX:"auto" }}>
                <Table sx={{ tableLayout:"fixed", width:"100%" }}>
                  {/* ---------- header ---------- */}
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

                  {/* ---------- body ---------- */}
                  <TableBody>
                    {sortedBranches.length > 0 ? (
                      sortedBranches.map(branch => (
                        <TableRow key={branch.id} hover>
                          {allowedColumns.map(col => {
                            switch (col.key) {
                              case "name":
                                return (
                                  <TableCell key={col.key} sx={{ minWidth:col.width, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontWeight:500 }}>
                                    {branch.name}
                                  </TableCell>
                                );
                              case "code":
                                return (
                                  <TableCell key={col.key} sx={{ minWidth:col.width }}>
                                    <SoftTypography variant="button" fontWeight="medium">{branch.code}</SoftTypography>
                                  </TableCell>
                                );
                              case "address":
                                return <TableCell key={col.key} sx={{ minWidth:col.width }}>{branch.address}</TableCell>;
                              case "status":
                                return (
                                  <TableCell key={col.key} sx={{ minWidth:col.width }}>
                                    <SoftBox display="inline-flex" alignItems="center" px={1.5} py={0.5} borderRadius={1}
                                      bgcolor={branch.status ? "success.light" : "error.light"}>
                                      <SoftTypography variant="caption" fontWeight="bold"
                                        color={branch.status ? "success.dark" : "error.dark"}>
                                        {branch.status ? "ACTIVE" : "INACTIVE"}
                                      </SoftTypography>
                                    </SoftBox>
                                  </TableCell>
                                );
                              case "actions":
                                return (
                                  <TableCell key={col.key} align="center" sx={{ minWidth:col.width }}>
                                    <Tooltip title="Edit Branch">
                                      <IconButton size="small" onClick={() => handleEditClick(branch)} aria-label="edit">
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Branch">
                                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(branch)} aria-label="delete">
                                        <DeleteIcon fontSize="small" />
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
                          No branches found.
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
            Are you sure you want to delete the branch <strong>{selectedBranch?.name}</strong>?
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton
            color="info" variant="contained" onClick={handleDeleteConfirm}
            disabled={deletingId === selectedBranch?.id}
            sx={{ backgroundColor:"rgb(23, 193, 232)", "&:hover":{ backgroundColor:"rgba(23, 193, 232, 0.8)" }, color:"#fff", minWidth:100 }}
          >
            {deletingId === selectedBranch?.id ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </SoftButton>
          <SoftButton
            variant="contained" onClick={() => setDeleteDialogOpen(false)}
            sx={{ backgroundColor:"red", "&:hover":{ backgroundColor:"darkred" }, color:"#fff", minWidth:100 }}
          >
            Cancel
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default BranchList;
