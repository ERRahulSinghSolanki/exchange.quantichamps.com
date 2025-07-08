// src/pages/admin/AddRole.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import { CircularProgress } from "@mui/material";
import { API_URL } from "config";

const AddRole = () => {
  const navigate = useNavigate();

  /* ───── UI state ───── */
  const [name, setName] = useState("");
  const [pageLoading, setPageLoading] = useState(true); // full‑page spinner
  const [saving, setSaving] = useState(false);          // button spinner

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
  });

  /* fake page‑load spinner (feel‑good UX) */
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  /* ───── form submit ───── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setSnackbar({ open: true, message: "Please enter role name", color: "error" });
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), guard_name: "web" }),
      });

      if (!res.ok) throw new Error();

      setSnackbar({ open: true, message: "Role created successfully!", color: "success" });
      setTimeout(() => navigate("/roles/list"), 1500);
    } catch {
      setSaving(false);
      setSnackbar({ open: true, message: "Failed to create role", color: "error" });
    }
  };

  /* ───── render ───── */
  if (pageLoading)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={10} display="flex" justifyContent="center">
          <CircularProgress />
        </SoftBox>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snackbar.color}
        icon="notifications"
        title="Role"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
        time={2500}
      />

      <SoftBox p={3}>
        <SoftTypography variant="h5" mb={2}>
          Add New Role
        </SoftTypography>

        <form onSubmit={handleSubmit}>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Role Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              autoFocus
              disabled={saving}
            />
          </SoftBox>

          <SoftBox display="flex" gap={2}>
            <SoftButton type="submit" color="dark" disabled={saving}>
              {saving ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Creating…
                </>
              ) : (
                "Create Role"
              )}
            </SoftButton>

            <SoftButton
              variant="outlined"
              color="dark"
              onClick={() => navigate("/roles/list")}
              disabled={saving}
            >
              Cancel
            </SoftButton>
          </SoftBox>
        </form>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AddRole;
