// ✅ Updated EditTeamLeader Page with proper shift formatting and safe shift handling
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";

const EditTeamLeader = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch_id: "",
    manager_id: "",
    shift_id: "",
  });

  const [branches, setBranches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState({
    form: false,
    branches: false,
    fullPage: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const navigate = useNavigate();

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return response.json();
  };

  const fetchManagers = async (branchId, selectedManagerId = null) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/branches/${branchId}/managers`);
      setManagers(res);
      setFormData(prev => ({
        ...prev,
        manager_id: selectedManagerId ?? "",
      }));
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load managers", color: "error" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}/teamleader/${id}`);
        const leader = res.user;

        setBranches(res.dropdowns.branches);
        setShifts(res.dropdowns.shifts || []);

        setFormData({
          name: leader.name || "",
          email: leader.email || "",
          branch_id: leader.branch_id?.toString() || "",
          manager_id: leader.manager_id?.toString() || "",
          shift_id: leader.shift_id?.toString() || "",
          password: "",
          confirmPassword: "",
        });

        if (leader.branch_id) {
          await fetchManagers(leader.branch_id, leader.manager_id);
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading({ branches: false, form: false, fullPage: false });
      }
    };
    fetchData();
  }, [id]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "branch_id") {
      setFormData(prev => ({ ...prev, branch_id: value, shift_id: "", manager_id: "" }));
      try {
        const shiftRes = await fetchWithAuth(`${API_URL}/branches/${value}/shifts`);
        setShifts(shiftRes.shifts || []);
        await fetchManagers(value);
      } catch (err) {
        setSnackbar({ open: true, message: "Error fetching data", color: "error" });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, form: true }));

    if (formData.password && formData.password !== formData.confirmPassword) {
      setSnackbar({ open: true, message: "Passwords do not match", color: "error" });
      setLoading(prev => ({ ...prev, form: false }));
      return;
    }

    try {
      const updateData = {
        ...formData,
        branch_id: parseInt(formData.branch_id),
        manager_id: parseInt(formData.manager_id),
        shift_id: parseInt(formData.shift_id),
      };
      if (!updateData.password) delete updateData.password;

      await fetchWithAuth(`${API_URL}/teamleader/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      setSnackbar({ open: true, message: "Team Leader updated successfully", color: "success" });
      setTimeout(() => navigate("/projects/teamleader/list"), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to update team leader", color: "error" });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const formatShiftOption = (shift) =>
    `${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} [${shift.shift_code} ${shift.start_time?.slice(0, 5)} - ${shift.end_time?.slice(0, 5)}]`;

  if (loading.fullPage) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="70vh">
          <CircularProgress />
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftSnackbar
        color={snackbar.color}
        icon="notifications"
        title="Team Leader"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
        time={3000}
      />
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          Edit Team Leader
        </SoftTypography>

        <SoftBox component="form" onSubmit={handleSubmit} autoComplete="off">
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>Name</SoftTypography>
            <SoftInput name="name" value={formData.name} onChange={handleChange} required fullWidth />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>Email</SoftTypography>
            <SoftInput name="email" value={formData.email} onChange={handleChange} required fullWidth />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>Branch</SoftTypography>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d2d6da", fontSize: "14px" }}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>Manager</SoftTypography>
            <select
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d2d6da", fontSize: "14px" }}
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>{manager.name}</option>
              ))}
            </select>
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>Shift</SoftTypography>
            <select
              name="shift_id"
              value={formData.shift_id}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d2d6da", fontSize: "14px" }}
            >
              <option value="">Select Shift</option>
              {Array.isArray(shifts) && shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>{formatShiftOption(shift)}</option>
              ))}
            </select>
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>New Password</SoftTypography>
            <SoftInput type="password" name="password" value={formData.password} onChange={handleChange} fullWidth />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>Confirm Password</SoftTypography>
            <SoftInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} fullWidth />
          </SoftBox>

          <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton variant="gradient" color="secondary" onClick={() => navigate("/projects/teamleader/list")} disabled={loading.form}>
              Cancel
            </SoftButton>
            <SoftButton variant="gradient" color="dark" type="submit" disabled={loading.form}>
              {loading.form ? "Updating..." : "Update Team Leader"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default EditTeamLeader;
