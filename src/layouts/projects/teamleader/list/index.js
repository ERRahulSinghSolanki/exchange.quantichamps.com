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
import { useAuth } from "../../../../AuthContext";        // 🔐 permissions

const PERMISSION_PREFIX = "viewteamleader.";             // ⭐ prefix

const TeamLeaderList = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [snackbar, setSnackbar]       = useState({ open:false, message:"", color:"success" });
  const [pagination, setPagination]   = useState({ page:1, perPage:25, total:0, lastPage:1 });
  const [pageInput, setPageInput]     = useState(1);
  const navigate = useNavigate();

  /* ---------------- fetch data ---------------- */
  const fetchTeamLeaders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(
        `${API_URL}/teamleader?page=${pagination.page}&per_page=${pagination.perPage}&q=${search}`,
        { headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` } }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success === 1 && data.users && Array.isArray(data.users.data)) {
        setTeamLeaders(data.users.data);
        setPagination({
          page: data.users.current_page,
          perPage: data.users.per_page,
          total: data.users.total,
          lastPage: data.users.last_page,
        });
      } else {
        throw new Error("Invalid team leaders data format");
      }
    } catch (err) {
      setSnackbar({ open:true, message:err.message || "Failed to fetch team leaders", color:"error" });
      setTeamLeaders([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTeamLeaders(); }, [pagination.page, pagination.perPage, search]);
  useEffect(() => { setPageInput(pagination.page); }, [pagination.page]);

  /* ---------------- delete / restore ---------------- */
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/teamleader/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Error deleting team leader"); }

      setSnackbar({ open:true, message:"Team leader deleted successfully", color:"success" });
      if (teamLeaders.length === 1 && pagination.page > 1) {
        setPagination((p) => ({ ...p, page:p.page-1 }));
      } else { fetchTeamLeaders(); }
    } catch (err) {
      setSnackbar({ open:true, message:err.message || "Failed to delete team leader", color:"error" });
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/teamleader/restore/${id}`, { method:"POST", headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Error restoring team leader"); }

      setSnackbar({ open:true, message:"Team leader restored successfully", color:"success" });
      fetchTeamLeaders();
    } catch (err) {
      setSnackbar({ open:true, message:err.message || "Failed to restore team leader", color:"error" });
    }
  };

  /* ---------------- column list ---------------- */
  const baseColumns = [
    { name:"ID",         align:"left",   permission:`${PERMISSION_PREFIX}id` },
    { name:"NAME",       align:"left",   permission:`${PERMISSION_PREFIX}name` },
    { name:"EMAIL",      align:"left",   permission:`${PERMISSION_PREFIX}email` },
    { name:"BRANCH",     align:"left",   permission:`${PERMISSION_PREFIX}branch` },
    { name:"SHIFT",      align:"left",   permission:`${PERMISSION_PREFIX}shift` },
    { name:"SHIFT_CODE", align:"left",   permission:`${PERMISSION_PREFIX}shift_code` },
    { name:"SHIFT_TIME", align:"left",   permission:`${PERMISSION_PREFIX}shift_time` },
    { name:"ROLE",       align:"left",   permission:`${PERMISSION_PREFIX}role` },
    { name:"STATUS",     align:"left",   permission:`${PERMISSION_PREFIX}status` },
    { name:"ACTION",     align:"center", permission:`${PERMISSION_PREFIX}action` },
  ];

  const allowedColumns = authPermissions.length === 0
    ? baseColumns
    : baseColumns.filter(c => authPermissions.includes(c.permission));

  /* ---------------- build rows ---------------- */
  const allRows = useMemo(() => teamLeaders.map((leader) => {
    const shift = leader.shifts?.[0] || {};
    return {
      ID:         <SoftTypography variant="button">{leader.id}</SoftTypography>,
      NAME:       <SoftTypography variant="button">{leader.name}</SoftTypography>,
      EMAIL:      <SoftTypography variant="button">{leader.email}</SoftTypography>,
      BRANCH:     <SoftTypography variant="button">{leader.branch?.name || "—"}</SoftTypography>,
      SHIFT:      <SoftTypography variant="button">{shift.type || "—"}</SoftTypography>,
      SHIFT_CODE: <SoftTypography variant="button">{shift.shift_code || "—"}</SoftTypography>,
      SHIFT_TIME: (
        <SoftTypography variant="button">
          {shift.start_time && shift.end_time ? `${shift.start_time} - ${shift.end_time}` : "—"}
        </SoftTypography>
      ),
      ROLE:   <SoftTypography variant="button">{leader.role || "Team Leader"}</SoftTypography>,
      STATUS: (
        <SoftTypography variant="button" color={leader.deleted_at ? "error" : "success"}>
          {leader.deleted_at ? "Inactive" : "Active"}
        </SoftTypography>
      ),
      ACTION: (
        <SoftBox display="flex" justifyContent="center">
          <SoftButton size="small" color="info" sx={{ mx:0.5 }}
            onClick={() => navigate(`/projects/teamleader/edit/${leader.id}`)}>Edit</SoftButton>
          {leader.deleted_at ? (
            <SoftButton size="small" color="success" sx={{ mx:0.5 }}
              onClick={() => handleRestore(leader.id)}>Restore</SoftButton>
          ) : (
            <SoftButton size="small" color="error" sx={{ mx:0.5 }}
              onClick={() => handleDelete(leader.id)}>Delete</SoftButton>
          )}
        </SoftBox>
      ),
    };
  }), [teamLeaders]);

  const allowedRows = useMemo(() => allRows.map(r => {
    const obj={}; allowedColumns.forEach(c => obj[c.name]=r[c.name]); return obj;
  }), [allRows, allowedColumns]);

  /* ---------------- pagination helper ---------------- */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination(p => ({ ...p, page:newPage }));
    }
  };

  /* ---------------- render ---------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        {...snackbar} title="Team Leader"
        open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open:false })} time={3000}
      />

      <SoftBox p={3}>
        {/* Header + controls */}
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <SoftTypography variant="h5" fontWeight="medium">Team Leaders List</SoftTypography>
            <SoftButton variant="gradient" color="dark" onClick={() => navigate("/projects/teamleaders/add")}>
              Add New Team Leader
            </SoftButton>
          </SoftBox>

          {/* Pagination */}
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

          {/* Search */}
          <SoftBox mt={1} display="flex" alignItems="center" gap={1} justifyContent="center">
            <SoftTypography variant="body2">Search by Name:</SoftTypography>
            <input
              type="text" value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Enter name..."
              style={{ padding:"6px 12px", width:"250px", border:"1px solid #ccc", borderRadius:"4px" }}
            />
          </SoftBox>

          {/* Showing X of Y */}
          <SoftTypography variant="caption" color="text" mt={1}>
            {pagination.total>0 && <>Showing <strong>{(pagination.page-1)*pagination.perPage+1}</strong> to <strong>{Math.min(pagination.page*pagination.perPage, pagination.total)}</strong> of <strong>{pagination.total}</strong> entries</>}
          </SoftTypography>
        </SoftBox>

        {/* Main content */}
        {loading ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" py={6}><CircularProgress color="info" /></SoftBox>
        ) : teamLeaders.length===0 ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px" border="1px dashed #e0e0e0" borderRadius="4px" mt={2}>
            <SoftTypography variant="body2" color="textSecondary">No team leaders found</SoftTypography>
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

export default TeamLeaderList;
