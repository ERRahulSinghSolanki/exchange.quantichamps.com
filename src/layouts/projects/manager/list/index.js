import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import Table from "examples/Tables/Table";
import { API_URL } from "config";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../../../AuthContext";     // 🔐 permissions

const PERMISSION_PREFIX = "viewmanager.";               // ⭐ prefix

const ManagerList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [managers, setManagers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [snackbar, setSnackbar] = useState({ open:false, message:"", color:"success" });
  const [pagination, setPagination] = useState({ page:1, perPage:25, total:0, lastPage:1 });
  const [pageInput, setPageInput]   = useState(1);
  const navigate = useNavigate();

  /* ---------------- fetch managers ---------------- */
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(
        `${API_URL}/manager?page=${pagination.page}&per_page=${pagination.perPage}&q=${search}`,
        { headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch managers");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Invalid data");

      setManagers(data.users.data);
      setPagination({
        page: data.users.current_page,
        perPage: data.users.per_page,
        total: data.users.total,
        lastPage: data.users.last_page,
      });
    } catch (err) {
      setSnackbar({ open:true, message:err.message, color:"error" });
      setManagers([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchManagers(); }, [pagination.page, pagination.perPage, search]);
  useEffect(() => { setPageInput(pagination.page); }, [pagination.page]);

  /* ---------------- actions (delete / restore) ---------------- */
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/manager/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) throw new Error("Error deleting manager");
      setSnackbar({ open:true, message:"Manager deleted successfully", color:"success" });
      fetchManagers();
    } catch (err) {
      setSnackbar({ open:true, message:err.message, color:"error" });
    }
  };
  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/manager/restore/${id}`, { method:"POST", headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) throw new Error("Error restoring manager");
      setSnackbar({ open:true, message:"Manager restored successfully", color:"success" });
      fetchManagers();
    } catch (err) {
      setSnackbar({ open:true, message:err.message, color:"error" });
    }
  };

  /* ---------------- column definitions ---------------- */
  const baseColumns = [
    { name:"ID",          align:"left",   permission: `${PERMISSION_PREFIX}id` },
    { name:"NAME",        align:"left",   permission: `${PERMISSION_PREFIX}name` },
    { name:"EMAIL",       align:"left",   permission: `${PERMISSION_PREFIX}email` },
    { name:"BRANCH",      align:"left",   permission: `${PERMISSION_PREFIX}branch` },
    { name:"SHIFT",       align:"left",   permission: `${PERMISSION_PREFIX}shift` },
    { name:"SHIFT_CODE",  align:"left",   permission: `${PERMISSION_PREFIX}shift_code` },
    { name:"SHIFT_TIME",  align:"left",   permission: `${PERMISSION_PREFIX}shift_time` },
    { name:"ROLE",        align:"left",   permission: `${PERMISSION_PREFIX}role` },
    { name:"STATUS",      align:"left",   permission: `${PERMISSION_PREFIX}status` },
    { name:"ACTION",      align:"center", permission: `${PERMISSION_PREFIX}action` },
  ];

  const allowedColumns = authPermissions.length === 0
    ? baseColumns
    : baseColumns.filter(c => authPermissions.includes(c.permission));

  /* ---------------- build rows ---------------- */
  const allRows = useMemo(() => managers.map((m) => {
    const shift = m.shifts?.[0] || {};
    return {
      ID:         <SoftTypography variant="button">{m.id}</SoftTypography>,
      NAME:       <SoftTypography variant="button">{m.name}</SoftTypography>,
      EMAIL:      <SoftTypography variant="button">{m.email}</SoftTypography>,
      BRANCH:     <SoftTypography variant="button">{m.branch?.name || "—"}</SoftTypography>,
      SHIFT:      <SoftTypography variant="button">{shift.type || "—"}</SoftTypography>,
      SHIFT_CODE: <SoftTypography variant="button">{shift.shift_code || "—"}</SoftTypography>,
      SHIFT_TIME: (
        <SoftTypography variant="button">
          {shift.start_time && shift.end_time ? `${shift.start_time} - ${shift.end_time}` : "—"}
        </SoftTypography>
      ),
      ROLE:   <SoftTypography variant="button">{m.role || "Manager"}</SoftTypography>,
      STATUS: (
        <SoftTypography variant="button" color={m.deleted_at ? "error" : "success"}>
          {m.deleted_at ? "Inactive" : "Active"}
        </SoftTypography>
      ),
      ACTION: (
        <SoftBox display="flex" justifyContent="center">
          <SoftButton size="small" color="info" sx={{ mx:0.5 }}
            onClick={() => navigate(`/projects/manager/edit/${m.id}`)}>Edit</SoftButton>
          {m.deleted_at ? (
            <SoftButton size="small" color="success" sx={{ mx:0.5 }}
              onClick={() => handleRestore(m.id)}>Restore</SoftButton>
          ) : (
            <SoftButton size="small" color="error" sx={{ mx:0.5 }}
              onClick={() => handleDelete(m.id)}>Delete</SoftButton>
          )}
        </SoftBox>
      ),
    };
  }), [managers]);

  const allowedRows = useMemo(() => allRows.map((r) => {
    const obj = {};
    allowedColumns.forEach((c) => { obj[c.name] = r[c.name]; });
    return obj;
  }), [allRows, allowedColumns]);

  /* ---------------- pagination helpers ---------------- */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, page:newPage }));
    }
  };

  /* ---------------- render ---------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar {...snackbar} title="Manager"
        open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open:false })} time={3000} />

      <SoftBox p={3}>
        {/* Header & controls */}
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <SoftTypography variant="h5" fontWeight="medium">Manager List</SoftTypography>
            <SoftButton variant="gradient" color="dark" onClick={() => navigate("/projects/manager/add")}>
              Add New Manager
            </SoftButton>
          </SoftBox>

          {/* Pagination controls */}
          <SoftBox display="flex" justifyContent="center" alignItems="center" gap={1} my={2}>
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(1)} disabled={pagination.page===1}>{"<<"}</SoftButton>
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(pagination.page-1)} disabled={pagination.page===1}>{"<"}</SoftButton>
            <input
              type="number" value={pageInput} min={1} max={pagination.lastPage}
              onChange={(e)=>setPageInput(e.target.value)}
              onKeyDown={(e)=>e.key==="Enter" && handlePageChange(parseInt(pageInput))}
              onBlur={()=>handlePageChange(parseInt(pageInput))}
              style={{ width:"60px", textAlign:"center", padding:"6px", border:"1px solid #ccc", borderRadius:"4px" }}
            />
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(pagination.page+1)}
              disabled={pagination.page>=pagination.lastPage}>{">"}</SoftButton>
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(pagination.lastPage)}
              disabled={pagination.page>=pagination.lastPage}>{">>"}</SoftButton>
          </SoftBox>

          {/* Search box */}
          <SoftBox mt={1} display="flex" alignItems="center" gap={1} justifyContent="center">
            <SoftTypography variant="body2">Search by Name:</SoftTypography>
            <input
              type="text" value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Enter name..."
              style={{ padding:"6px 12px", width:"250px", border:"1px solid #ccc", borderRadius:"4px" }}
            />
          </SoftBox>

          {/* showing X to Y of Z */}
          <SoftTypography variant="caption" color="text" mt={1}>
            {pagination.total>0 && <>Showing <strong>{(pagination.page-1)*pagination.perPage+1}</strong> to <strong>{Math.min(pagination.page*pagination.perPage, pagination.total)}</strong> of <strong>{pagination.total}</strong> entries</>}
          </SoftTypography>
        </SoftBox>

        {/* Main table */}
        {loading ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" py={6}><CircularProgress color="info" /></SoftBox>
        ) : managers.length===0 ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px" border="1px dashed #e0e0e0" borderRadius="4px" mt={2}>
            <SoftTypography variant="body2" color="textSecondary">No managers found</SoftTypography>
          </SoftBox>
        ) : allowedColumns.length===0 ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px" border="1px dashed #e0e0e0" borderRadius="4px" mt={2}>
            <SoftTypography variant="body2">Sorry ! You don&apos;t have permission.</SoftTypography>
          </SoftBox>
        ) : (
          <Table columns={allowedColumns} rows={allowedRows} />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default ManagerList;
