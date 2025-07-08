/* FULL CODE UPDATED WITH SEPARATE "Search by Name" LABEL ABOVE INPUT */

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
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../AuthContext";

const PERMISSION_PREFIX = "viewuser.";

const UsersList = () => {
  const { permissions: authPermissions = [] } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [pagination, setPagination] = useState({ page: 1, perPage: 25, total: 0 });
  const [pageInput, setPageInput] = useState(1);
  const [searchName, setSearchName] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`${API_URL}/users?page=${pagination.page}&per_page=${pagination.perPage}&q=${searchName}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      let usersData = [], totalCount = 0;

      if (data.users?.data) {
        usersData = data.users.data;
        totalCount = data.users.total;
      } else if (Array.isArray(data.data)) {
        usersData = data.data;
        totalCount = data.total;
      }

      setUsers(usersData);
      setPagination((p) => ({ ...p, total: totalCount }));
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to fetch users", color: "error" });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.perPage, searchName]);

  useEffect(() => {
    setPageInput(pagination.page);
  }, [pagination.page]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error deleting user");
      setSnackbar({ open: true, message: "User deleted successfully", color: "success" });
      if (users.length === 1 && pagination.page > 1)
        setPagination((p) => ({ ...p, page: p.page - 1 }));
      else fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to delete user", color: "error" });
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      const res = await fetch(`${API_URL}/users/restore/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error restoring user");
      setSnackbar({ open: true, message: "User restored successfully", color: "success" });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to restore user", color: "error" });
    }
  };

  const baseColumns = [
    { name: "id", align: "left", width: "5%", permission: `${PERMISSION_PREFIX}id` },
    { name: "name", align: "left", width: "12%", permission: `${PERMISSION_PREFIX}name` },
    { name: "email", align: "left", width: "18%", permission: `${PERMISSION_PREFIX}email` },
    { name: "branch", align: "left", width: "10%", permission: `${PERMISSION_PREFIX}branch` },
    { name: "shift", align: "left", width: "10%", permission: `${PERMISSION_PREFIX}shift` },
    { name: "shift_code", align: "left", width: "10%", permission: `${PERMISSION_PREFIX}shift_code` },
    { name: "shift_time", align: "left", width: "12%", permission: `${PERMISSION_PREFIX}shift_time` },
    { name: "role", align: "left", width: "10%", permission: `${PERMISSION_PREFIX}role` },
    { name: "status", align: "left", width: "8%", permission: `${PERMISSION_PREFIX}status` },
    { name: "action", align: "center", width: "10%", permission: `${PERMISSION_PREFIX}action` },
  ];

  const allowedColumns = authPermissions.length === 0 ? baseColumns : baseColumns.filter((c) => authPermissions.includes(c.permission));

  const allRows = useMemo(() => users.map((user) => {
    const shift = user.shifts?.[0];
    return {
      id: <SoftTypography variant="button" fontWeight="medium">{user.id}</SoftTypography>,
      name: <SoftTypography variant="button" fontWeight="medium">{user.name}</SoftTypography>,
      email: <SoftTypography variant="button" fontWeight="medium">{user.email}</SoftTypography>,
      branch: <SoftTypography variant="button" fontWeight="medium">{user.branch?.name || "-"}</SoftTypography>,
      shift: <SoftTypography variant="button" fontWeight="medium">{shift?.type || "-"}</SoftTypography>,
      shift_code: <SoftTypography variant="button" fontWeight="medium">{shift?.shift_code || "-"}</SoftTypography>,
      shift_time: <SoftTypography variant="button" fontWeight="medium">{shift?.start_time && shift?.end_time ? `${shift.start_time} - ${shift.end_time}` : "-"}</SoftTypography>,
      role: <SoftTypography variant="button" fontWeight="medium">{user.role || "-"}</SoftTypography>,
      status: <SoftTypography variant="button" fontWeight="medium" color={user.deleted_at ? "error" : "success"}>{user.deleted_at ? "Inactive" : "Active"}</SoftTypography>,
      action: (
        <SoftBox display="flex" justifyContent="center">
          <SoftButton size="small" color="info" sx={{ mx: 0.5 }} onClick={() => navigate(`/users/edit/${user.id}`)}>Edit</SoftButton>
          {user.deleted_at ? (
            <SoftButton size="small" color="success" sx={{ mx: 0.5 }} onClick={() => handleRestore(user.id)}>Restore</SoftButton>
          ) : (
            <SoftButton size="small" color="error" sx={{ mx: 0.5 }} onClick={() => handleDelete(user.id)}>Delete</SoftButton>
          )}
        </SoftBox>
      ),
    };
  }), [users]);

  const allowedRows = useMemo(() => allRows.map((r) => {
    const obj = {};
    allowedColumns.forEach((c) => (obj[c.name] = r[c.name]));
    return obj;
  }), [allRows, allowedColumns]);

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.perPage);
    if (newPage >= 1 && newPage <= totalPages) setPagination((p) => ({ ...p, page: newPage }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftSnackbar color={snackbar.color} icon="notifications" title="User" content={snackbar.message} open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} time={3000} />
      <SoftBox p={3}>
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <SoftTypography variant="h5" fontWeight="medium">User List</SoftTypography>
            <SoftButton variant="gradient" color="dark" onClick={() => navigate("/users/add")}>Add New User</SoftButton>
          </SoftBox>

          <SoftBox display="flex" justifyContent="center" alignItems="center" my={2} gap={1}>
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(1)} disabled={pagination.page === 1}>{"<<"}</SoftButton>
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>{"<"}</SoftButton>
            <input type="number" value={pageInput} min={1} max={Math.ceil(pagination.total / pagination.perPage)} onChange={(e) => setPageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handlePageChange(parseInt(pageInput))} onBlur={() => handlePageChange(parseInt(pageInput))} style={{ width: "60px", textAlign: "center", padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}>{">"}</SoftButton>
            <SoftButton size="small" variant="outlined" onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.perPage))} disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}>{">>"}</SoftButton>
          </SoftBox>

          <SoftBox display="flex" justifyContent="center" flexDirection="column" alignItems="center" mb={3}>
            <SoftTypography variant="button" fontWeight="bold" mb={1}>Search by Name</SoftTypography>
            <TextField variant="outlined" size="small" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Enter name..." />
          </SoftBox>

          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" py={6}>
              <CircularProgress color="info" />
            </SoftBox>
          ) : users.length === 0 ? (
            <SoftBox textAlign="center" py={4}>
              <SoftTypography variant="body2">No users found</SoftTypography>
            </SoftBox>
          ) : allowedColumns.length === 0 ? (
            <SoftBox textAlign="center" py={4}>
              <SoftTypography variant="body2">Sorry! You don&apos;t have permission.</SoftTypography>
            </SoftBox>
          ) : (
            <Table columns={allowedColumns} rows={allowedRows} />
          )}
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default UsersList;
