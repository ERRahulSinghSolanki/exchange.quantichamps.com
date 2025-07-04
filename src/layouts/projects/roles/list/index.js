// src/pages/admin/RolesList.jsx
// --------------------------------------------------------------
// • Column‑level permissions  →  "viewroles.<key>"
// --------------------------------------------------------------

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout    from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar    from "examples/Navbars/DashboardNavbar";
import SoftBox            from "components/SoftBox";
import SoftTypography     from "components/SoftTypography";
import SoftButton         from "components/SoftButton";
import SoftSnackbar       from "components/SoftSnackbar";
import Table              from "examples/Tables/Table";
import { CircularProgress } from "@mui/material";

import { API_URL } from "config";
import { useAuth } from "../../../../AuthContext";    // admin → pages → src

/* ───────────────────────────────────────────────────────────── */
const RolesList = () => {
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
  const userHas = useCallback((colKey) => permSet.has(`viewroles.${colKey}`), [permSet]);

  /* ---------- state ---------- */
  const [roles, setRoles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [pagination, setPag]    = useState({ page: 1, perPage: 25, total: 0 });
  const [pageInput, setPageInput] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });

  const navigate = useNavigate();

  /* ---------- fetch ---------- */
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/allroles?page=${pagination.page}&per_page=${pagination.perPage}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP error – ${res.status}`);
      const data = await res.json();

      let rolesData = [], totalCount = 0;
      if (Array.isArray(data)) { rolesData = data; totalCount = data.length; }
      else if (data.roles?.data) { rolesData = data.roles.data; totalCount = data.roles.total ?? rolesData.length; }
      else if (Array.isArray(data.roles)) { rolesData = data.roles; totalCount = rolesData.length; }
      else if (Array.isArray(data.data)) { rolesData = data.data; totalCount = data.total ?? rolesData.length; }

      setRoles(rolesData);
      setPag((p) => ({ ...p, total: totalCount }));
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to fetch roles", color: "error" });
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.perPage]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);
  useEffect(() => { setPageInput(pagination.page); }, [pagination.page]);

  /* ---------- table columns ---------- */
  const allColumns = [
    { key: "id",          label: "id",          align: "left"   },
    { key: "name",        label: "name",        align: "left"   },
    { key: "guard_name",  label: "guard_name",  align: "left"   },
    { key: "permissions", label: "Perms",       align: "center" },
    { key: "action",      label: "Action",      align: "center" },
  ];

  const visibleColumns = useMemo(
    () => allColumns.filter((col) => userHas(col.key)),
    [allColumns, userHas]
  );

  const rows = roles.map((role) => {
    const base = {
      id:          role.id,
      name:        role.name,
      guard_name:  role.guard_name,
      permissions: role.permissions?.length ?? 0,
      action: (
        <SoftBox display="flex" justifyContent="center">
          <SoftButton
            size="small"
            color="info"
            onClick={() => navigate(`/projects/roles/view/${role.id}`)}
          >
            View Permissions
          </SoftButton>
        </SoftBox>
      ),
    };
    // return only keys user can see
    return Object.fromEntries(Object.entries(base).filter(([k]) => userHas(k)));
  });

  /* ---------- pagination helpers ---------- */
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.perPage));
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPag((p) => ({ ...p, page: newPage }));
  };
  const handlePerPageChange = (per) => setPag({ ...pagination, perPage: per, page: 1 });

  /* ---------- render ---------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color}
        icon="notifications"
        title="Role"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar((s) => ({ ...s, open: false }))}
        time={3000}
      />

      <SoftBox p={3}>
        {/* header */}
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <SoftTypography variant="h5" fontWeight="medium">Roles List</SoftTypography>
            <SoftButton variant="gradient" color="dark" onClick={() => navigate("/projects/roles/add")}>
              <SoftTypography variant="button" color="white">Add New Role</SoftTypography>
            </SoftButton>
          </SoftBox>

          {/* pagination controls */}
          <SoftBox display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(1)} disabled={pagination.page === 1}>{"<<"}</SoftButton>
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>{"<"}</SoftButton>
            <input
              type="number"
              value={pageInput}
              min={1}
              max={totalPages}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { const n = parseInt(pageInput, 10); !Number.isNaN(n) && handlePageChange(n); } }}
              onBlur={() => { const n = parseInt(pageInput, 10); !Number.isNaN(n) && handlePageChange(n); }}
              style={{ width: "60px", textAlign: "center", padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= totalPages}>{">"}</SoftButton>
            <SoftButton variant="outlined" size="small" onClick={() => handlePageChange(totalPages)} disabled={pagination.page >= totalPages}>{">>"}</SoftButton>
          </SoftBox>

          <SoftTypography variant="caption" color="text" mt={1}>
            {pagination.total > 0 && (
              <>
                Showing <strong>{(pagination.page - 1) * pagination.perPage + 1}</strong> to{" "}
                <strong>{Math.min(pagination.page * pagination.perPage, pagination.total)}</strong> of{" "}
                <strong>{pagination.total}</strong> entries
              </>
            )}
          </SoftTypography>
        </SoftBox>

        {/* table / loader */}
        {loading || !isAuthReady ? (
          <SoftBox textAlign="center" py={4}><CircularProgress /></SoftBox>
        ) : roles.length && visibleColumns.length ? (
          <Table
            columns={visibleColumns.map(({ key, label, align }) => ({ name: key, label, align }))}
            rows={rows}
          />
        ) : (
          <SoftBox textAlign="center" py={4}>
            <SoftTypography variant="body2">
              {visibleColumns.length === 0 ? "You do not have permission to view any columns." : "No roles found"}
            </SoftTypography>
          </SoftBox>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default RolesList;
