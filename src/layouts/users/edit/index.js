// ✅ FULL UPDATED CODE BELOW

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import { CircularProgress } from "@mui/material";
import { API_URL } from "config";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch_id: "",
    manager_id: "",
    team_leader_id: "",
    shift_id: "",
    role_id: "", // ✅ Add role_id
  });

  const [branches, setBranches] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [roles, setRoles] = useState([]); // ✅ Add roles list

  const [loading, setLoading] = useState({
    form: false,
    initial: true,
    shifts: false,
    managers: false,
    teamLeaders: false,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        const res = await fetchWithAuth(`${API_URL}/users/${id}`);
        const user = res.user;

        const formattedShifts = (res.dropdowns.shifts || []).map(shift => ({
          ...shift,
          label: `${shift.type} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`,
        }));

        const allRoles = (res.dropdowns.roles || []).filter(r => r.name.toLowerCase() !== "admin");

        setRoles(allRoles);
        setBranches(res.dropdowns.branches || []);
        setShifts(formattedShifts);
        setManagers((res.dropdowns.managers || []).map(m => ({ ...m, id: m.id.toString() })));
        setTeamLeaders((res.dropdowns.team_leaders || []).map(tl => ({ ...tl, id: tl.id.toString() })));

        setFormData({
          name: user.name || "",
          email: user.email || "",
          branch_id: user.branch_id?.toString() || "",
          manager_id: (user.manager_id ?? res.dropdowns.managers[0]?.id)?.toString() || "",
          team_leader_id: user.team_leader_id?.toString() || "",
          shift_id: user.shift_id?.toString() || "",
          role_id: user.roles?.[0]?.id?.toString() || "", // ✅ Set current role
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };
    fetchData();
  }, [id]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "branch_id") {
      setFormData(prev => ({
        ...prev,
        branch_id: value,
        shift_id: "",
        manager_id: "",
        team_leader_id: "",
      }));

      setLoading(prev => ({ ...prev, shifts: true, managers: true }));

      try {
        const [shiftRes, managerRes] = await Promise.all([
          fetchWithAuth(`${API_URL}/branches/${value}/shifts`),
          fetchWithAuth(`${API_URL}/branches/${value}/managers`),
        ]);

        const formattedShifts = (shiftRes.shifts || []).map(shift => ({
          ...shift,
          label: `${shift.type} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`,
        }));

        setShifts(formattedShifts);
        setManagers((managerRes || []).map(m => ({ ...m, id: m.id.toString() })));
        setTeamLeaders([]);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, shifts: false, managers: false }));
      }

    } else if (name === "shift_id") {
      setFormData(prev => ({
        ...prev,
        shift_id: value,
        team_leader_id: "",
      }));

      setLoading(prev => ({ ...prev, teamLeaders: true }));

      try {
        const res = await fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/shifts/${value}/team-leaders`);
        setTeamLeaders((res.team_leaders || []).map(tl => ({ ...tl, id: tl.id.toString() })));
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, teamLeaders: false }));
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
        team_leader_id: parseInt(formData.team_leader_id),
        shift_id: parseInt(formData.shift_id),
        roles: [parseInt(formData.role_id)], // ✅ Send role to backend
      };

      if (!updateData.password) delete updateData.password;

      await fetchWithAuth(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      setSnackbar({ open: true, message: "User updated successfully", color: "success" });
      setTimeout(() => navigate("/users/list"), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, color: "error" });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  if (loading.initial) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox p={3} display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </SoftBox>
      </DashboardLayout>
    );
  }

  const dropdowns = [
    { label: "Branch", name: "branch_id", options: branches, loading: false },
    { label: "Shift", name: "shift_id", options: shifts, loading: loading.shifts, labelKey: "label" },
    { label: "Manager", name: "manager_id", options: managers, loading: loading.managers, labelKey: "name" },
    { label: "Team Leader", name: "team_leader_id", options: teamLeaders, loading: loading.teamLeaders, labelKey: "name" }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftSnackbar
        color={snackbar.color}
        icon="notifications"
        title="User"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
        time={3000}
      />

      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          Edit User
        </SoftTypography>

        <SoftBox component="form" onSubmit={handleSubmit} autoComplete="off">
          {["name", "email"].map((field) => (
            <SoftBox mb={2} key={field}>
              <SoftTypography variant="caption" fontWeight="bold" mb={1}>
                {field}
              </SoftTypography>
              <SoftInput
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                fullWidth
              />
            </SoftBox>
          ))}

          {/* ✅ ROLE DROPDOWN */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              Role
            </SoftTypography>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px",
              }}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={String(role.id)}>
                  {role.name}
                </option>
              ))}
            </select>
          </SoftBox>

          {/* OTHER DROPDOWNS */}
          {dropdowns.map(({ label, name, options, labelKey = "name", loading }) => (
            <SoftBox mb={2} key={name}>
              <SoftTypography variant="caption" fontWeight="bold" mb={1}>
                {label}
              </SoftTypography>
              <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={name !== "team_leader_id"}
                disabled={name !== "branch_id" && (loading || !formData.branch_id)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px",
                  backgroundColor: loading ? "#f0f0f0" : "white",
                }}
              >
                <option value="">Select {label}</option>
                {options.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item[labelKey]}
                  </option>
                ))}
              </select>
            </SoftBox>
          ))}

          {["password", "confirmPassword"].map((field) => (
            <SoftBox mb={2} key={field}>
              <SoftTypography variant="caption" fontWeight="bold" mb={1}>
                {field === "password" ? "New Password" : "Confirm Password"}
              </SoftTypography>
              <SoftInput
                type="password"
                name={field}
                autoComplete="new-password"
                value={formData[field]}
                onChange={handleChange}
                fullWidth
              />
            </SoftBox>
          ))}

          <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton
              variant="gradient"
              color="secondary"
              onClick={() => navigate("/users/list")}
              disabled={loading.form}
            >
              Cancel
            </SoftButton>
            <SoftButton variant="gradient" color="dark" type="submit" disabled={loading.form}>
              {loading.form ? "Updating..." : "Update User"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default EditUser;
