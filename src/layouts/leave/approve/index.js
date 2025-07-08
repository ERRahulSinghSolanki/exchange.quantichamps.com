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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../AuthContext";     // 🔐 permissions

const PERMISSION_PREFIX = "leaveapproval.";           // ⭐

const LeaveApprovalTable = () => {
  const { permissions: authPermissions = [] } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [pagination, setPagination] = useState({ page: 1, perPage: 10, total: 0 });
  const [pageInput, setPageInput] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ id: null, action: null, comment: "" });
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                Fetch data                                  */
  /* -------------------------------------------------------------------------- */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(
        `${API_URL}/leave/leave-requests?page=${pagination.page}&per_page=${pagination.perPage}`,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      const raw = Array.isArray(json?.data) ? json.data : json.leaves?.data || [];

      const formatted = raw.map((l) => ({
        id: l.id,
        start_date: new Date(l.start_date).toLocaleDateString(),
        end_date: new Date(l.end_date).toLocaleDateString(),
        day: l.day,
        type: l.type,
        reason: l.reason || "N/A",
        status: l.status || "pending",
        role: l.role || "N/A",
        user: {
          name: l.user?.name || "N/A",
          branch: l.user?.branch || "N/A",
          shift: l.user?.shift || "N/A",
        },
      }));

      setLeaves(formatted);
      setPagination((p) => ({ ...p, total: json.total || formatted.length }));
    } catch (err) {
      console.error("Fetch error:", err);
      setSnackbar({ open: true, message: err.message || "Failed to fetch leave requests", color: "error" });
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, [pagination.page, pagination.perPage]);
  useEffect(() => { setPageInput(pagination.page); }, [pagination.page]);

  /* -------------------------------------------------------------------------- */
  /*                        Modal approve / reject                              */
  /* -------------------------------------------------------------------------- */
  const openModal = (id, action) => { setModalData({ id, action, comment: "" }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalData({ id: null, action: null, comment: "" }); };

  const handleApproveReject = async () => {
    try {
      setProcessingId(modalData.id);
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_URL}/leave/approve-reject/${modalData.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: modalData.action, comment: modalData.comment }),
      });
      if (!res.ok) throw new Error("Error updating leave status");

      setSnackbar({ open: true, message: `Leave request ${modalData.action} successfully`, color: "success" });
      fetchLeaves(); closeModal();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to update leave status", color: "error" });
    } finally { setProcessingId(null); }
  };

  /* -------------------------------------------------------------------------- */
  /*                   Column definitions with permissions                      */
  /* -------------------------------------------------------------------------- */
  const baseColumns = useMemo(() => [
    { name: "id",          align: "left",   permission: `${PERMISSION_PREFIX}id` },
    { name: "name",        align: "left",   permission: `${PERMISSION_PREFIX}name` },
    { name: "role",        align: "left",   permission: `${PERMISSION_PREFIX}role` },
    { name: "branch",      align: "left",   permission: `${PERMISSION_PREFIX}branch` },
    { name: "shift",       align: "left",   permission: `${PERMISSION_PREFIX}shift` },
    { name: "start_date",  align: "left",   permission: `${PERMISSION_PREFIX}start_date` },
    { name: "end_date",    align: "left",   permission: `${PERMISSION_PREFIX}end_date` },
    { name: "day",         align: "left",   permission: `${PERMISSION_PREFIX}day` },
    { name: "type",        align: "left",   permission: `${PERMISSION_PREFIX}type` },
    { name: "reason",      align: "left",   permission: `${PERMISSION_PREFIX}reason` },
    { name: "status",      align: "left",   permission: `${PERMISSION_PREFIX}status` },
    { name: "action",      align: "center", permission: `${PERMISSION_PREFIX}action` },
  ], []);

  const allowedColumns = useMemo(() => (
    authPermissions.length === 0 ? baseColumns : baseColumns.filter(c => authPermissions.includes(c.permission))
  ), [baseColumns, authPermissions]);

  /* -------------------------------------------------------------------------- */
  /*                            Build row objects                               */
  /* -------------------------------------------------------------------------- */
  const allRows = useMemo(() => leaves.map((l) => ({
    id:         <SoftTypography variant="button">{l.id}</SoftTypography>,
    name:       <SoftTypography variant="button">{l.user.name}</SoftTypography>,
    role:       <SoftTypography variant="button">{l.role}</SoftTypography>,
    branch:     <SoftTypography variant="button">{l.user.branch}</SoftTypography>,
    shift:      <SoftTypography variant="button">{l.user.shift}</SoftTypography>,
    start_date: <SoftTypography variant="button">{l.start_date}</SoftTypography>,
    end_date:   <SoftTypography variant="button">{l.end_date}</SoftTypography>,
    day:        <SoftTypography variant="button">{l.day}</SoftTypography>,
    type:       <SoftTypography variant="button">{l.type}</SoftTypography>,
    reason:     <SoftTypography variant="button">{l.reason}</SoftTypography>,
    status: (
      <SoftTypography variant="button" color={
        l.status === "approved" ? "success" : l.status === "rejected" ? "error" : "warning"
      }>
        {l.status}
      </SoftTypography>
    ),
    action: (
      <SoftBox display="flex" justifyContent="center">
        {l.status === "pending" ? (
          <>
            <SoftButton size="small" color="success" sx={{ mx: 0.5 }}
              onClick={() => openModal(l.id, "approved")} disabled={processingId === l.id}>
              Approve
            </SoftButton>
            <SoftButton size="small" color="error" sx={{ mx: 0.5 }}
              onClick={() => openModal(l.id, "rejected")} disabled={processingId === l.id}>
              Reject
            </SoftButton>
          </>
        ) : (
          <SoftTypography variant="caption" color="text">Action completed</SoftTypography>
        )}
      </SoftBox>
    ),
  })), [leaves, processingId]);

  const allowedRows = useMemo(() => allRows.map((r) => {
    const obj = {};
    allowedColumns.forEach((c) => { obj[c.name] = r[c.name]; });
    return obj;
  }), [allRows, allowedColumns]);

  /* -------------------------------------------------------------------------- */
  /*                              Pagination helper                             */
  /* -------------------------------------------------------------------------- */
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.perPage);
    if (newPage >= 1 && newPage <= totalPages) setPagination({ ...pagination, page: newPage });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color} icon="notifications" title="Leave Approval"
        content={snackbar.message} open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })} time={3000}
      />

      {/* Approve / Reject modal */}
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{modalData.action === "approved" ? "Approve" : "Reject"} Leave Request</DialogTitle>
        <DialogContent>
          <SoftTypography variant="body2" mb={2}>
            {modalData.action === "approved"
              ? "Are you sure you want to approve this leave request?"
              : "Are you sure you want to reject this leave request?"}
          </SoftTypography>
          <TextField
            fullWidth multiline rows={3} label="Comments (Optional)" variant="outlined" sx={{ mt: 2 }}
            value={modalData.comment}
            onChange={(e) => setModalData({ ...modalData, comment: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={closeModal} color="dark">Cancel</SoftButton>
          <SoftButton
            onClick={handleApproveReject}
            color={modalData.action === "approved" ? "success" : "error"}
            disabled={processingId === modalData.id}
          >
            {processingId === modalData.id ? <CircularProgress size={20} color="inherit" /> :
              modalData.action === "approved" ? "Confirm Approve" : "Confirm Reject"}
          </SoftButton>
        </DialogActions>
      </Dialog>

      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          Leave Approval Requests
        </SoftTypography>

        {/* Pagination controls */}
        <SoftBox display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
          <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(1)} disabled={pagination.page===1}>{"<<"}</SoftButton>
          <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(pagination.page-1)} disabled={pagination.page===1}>{"<"}</SoftButton>
          <input
            type="number" value={pageInput} min={1} max={Math.ceil(pagination.total/pagination.perPage)}
            onChange={(e)=>setPageInput(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter"&&handlePageChange(parseInt(pageInput))}
            onBlur={()=>handlePageChange(parseInt(pageInput))}
            style={{ width:"60px", textAlign:"center", padding:"6px", border:"1px solid #ccc", borderRadius:"4px" }}
          />
          <SoftButton variant="outlined" size="small" onClick={()=>handlePageChange(pagination.page+1)}
            disabled={pagination.page>=Math.ceil(pagination.total/pagination.perPage)}>{">"}</SoftButton>
          <SoftButton variant="outlined" size="small" onClick={()=>handlePageChange(Math.ceil(pagination.total/pagination.perPage))}
            disabled={pagination.page>=Math.ceil(pagination.total/pagination.perPage)}>{">>"}</SoftButton>
        </SoftBox>

        <SoftTypography variant="caption" color="text" mt={1}>
          {pagination.total>0 && <>Showing <strong>{(pagination.page-1)*pagination.perPage+1}</strong> to <strong>{Math.min(pagination.page*pagination.perPage,pagination.total)}</strong> of <strong>{pagination.total}</strong> entries</>}
        </SoftTypography>

        {loading ? (
          <SoftBox display="flex" justifyContent="center" py={6}><CircularProgress color="info" /></SoftBox>
        ) : leaves.length===0 ? (
          <SoftBox textAlign="center" py={4}><SoftTypography variant="body2">No leave requests found</SoftTypography></SoftBox>
        ) : allowedColumns.length===0 ? (
          <SoftBox textAlign="center" py={4}><SoftTypography variant="body2">Sorry ! You don&apos;t have permission.</SoftTypography></SoftBox>
        ) : (
          <Table columns={allowedColumns} rows={allowedRows} />
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default LeaveApprovalTable;
