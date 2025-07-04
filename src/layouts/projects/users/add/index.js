import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import { API_URL } from "config";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    branch_id: "",
    shift_id: null,
    shift_ids: [],
    manager_id: "",
    team_leader_id: "",
    roles: [],
  });

  const [branches, setBranches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [isManagerRole, setIsManagerRole] = useState(false);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return response.json();
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [branchesData, rolesData] = await Promise.all([
          fetchWithAuth(`${API_URL}/branches`),
          fetchWithAuth(`${API_URL}/roles`),
        ]);
        
        setBranches(branchesData.data || []);
        
        // Filter out Admin role (assuming Admin has ID 1)
        const filteredRoles = rolesData.roles ? rolesData.roles.filter(role => role.id !== 1) : [];
        setAvailableRoles(filteredRoles);
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load initial data", color: "error" });
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadShiftsAndManagers = async () => {
      if (!formData.branch_id) return;
      try {
        const [shiftsData, managersData] = await Promise.all([
          fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/shifts`),
          fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/managers`),
        ]);
        setShifts(shiftsData.shifts || []);
        setManagers(managersData);
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load shifts/managers", color: "error" });
      }
    };
    loadShiftsAndManagers();
  }, [formData.branch_id]);

  useEffect(() => {
    const loadTeamLeaders = async () => {
      if (!formData.manager_id) {
        setTeamLeaders([]);
        return;
      }
      try {
        const data = await fetchWithAuth(`${API_URL}/users/team-leaders/${formData.manager_id}`);
        setTeamLeaders(data);
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load team leaders", color: "error" });
      }
    };
    loadTeamLeaders();
  }, [formData.manager_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (e) => {
    const shiftId = e.target.value ? parseInt(e.target.value) : null;
    setFormData((prev) => ({ ...prev, shift_id: shiftId }));
  };

  const handleMultiShiftChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setFormData((prev) => ({ ...prev, shift_ids: selectedOptions }));
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = parseInt(e.target.value);
    const isManager = availableRoles.find(role => role.id === selectedRoleId)?.name.toLowerCase() === 'manager';
    setIsManagerRole(isManager);
    setFormData((prev) => ({ ...prev, roles: [selectedRoleId] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        branch_id: parseInt(formData.branch_id),
        manager_id: parseInt(formData.manager_id),
        team_leader_id: parseInt(formData.team_leader_id),
      };

      // For manager role, use shift_ids, otherwise use shift_id
      if (isManagerRole) {
        payload.shift_ids = formData.shift_ids.map(id => parseInt(id));
        delete payload.shift_id;
      } else {
        payload.shift_id = parseInt(formData.shift_id);
        delete payload.shift_ids;
      }

      await fetchWithAuth(`${API_URL}/users`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSnackbar({ open: true, message: "User added successfully", color: "success" });
      setTimeout(() => navigate("/projects/users/list"), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, color: "error" });
    } finally {
      setLoading(false);
    }
  };

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
          Add New User
        </SoftTypography>
        <SoftBox component="form" onSubmit={handleSubmit} autoComplete="off">
          {/* Name */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Name</SoftTypography>
            <SoftInput type="text" name="name" value={formData.name} onChange={handleChange} required fullWidth />
          </SoftBox>

          {/* Email */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Email</SoftTypography>
            <SoftInput type="email" name="email" value={formData.email} onChange={handleChange} required fullWidth />
          </SoftBox>

          {/* Password */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Password</SoftTypography>
            <SoftInput type="password" name="password" value={formData.password} onChange={handleChange} required fullWidth />
          </SoftBox>

          {/* Confirm Password */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Confirm Password</SoftTypography>
            <SoftInput type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required fullWidth />
          </SoftBox>

          {/* Role - Moved above Branch */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Role</SoftTypography>
            <select
              name="roles"
              value={formData.roles[0] || ""}
              onChange={handleRoleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px"
              }}
            >
              <option value="">Select Role</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </SoftBox>

          {/* Branch */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Branch</SoftTypography>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px"
              }}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </SoftBox>

          {/* Shift Selection - Conditional based on role */}
          {isManagerRole ? (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold">Shifts (Multiple select for Manager)</SoftTypography>
              <select
                name="shift_ids"
                multiple
                value={formData.shift_ids}
                onChange={handleMultiShiftChange}
                disabled={!formData.branch_id}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px",
                  minHeight: "100px"
                }}
              >
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {`${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`}
                  </option>
                ))}
              </select>
              <SoftTypography variant="caption" color="text">Hold Ctrl/Cmd to select multiple shifts</SoftTypography>
            </SoftBox>
          ) : (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold">Shift</SoftTypography>
              <select
                name="shift_id"
                value={formData.shift_id || ""}
                onChange={handleShiftChange}
                disabled={!formData.branch_id}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px"
                }}
              >
                <option value="">Select Shift</option>
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {`${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`}
                  </option>
                ))}
              </select>
            </SoftBox>
          )}

          {/* Manager */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Manager</SoftTypography>
            <select
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px"
              }}
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>{manager.name}</option>
              ))}
            </select>
          </SoftBox>

          {/* Team Leader */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Team Leader</SoftTypography>
            <select
              name="team_leader_id"
              value={formData.team_leader_id}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px"
              }}
            >
              <option value="">Select Team Leader</option>
              {teamLeaders.map((tl) => (
                <option key={tl.id} value={tl.id}>{tl.name}</option>
              ))}
            </select>
          </SoftBox>

          {/* Submit */}
          <SoftBox mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton color="secondary" onClick={() => navigate("/projects/users/list")}>Cancel</SoftButton>
            <SoftButton type="submit" color="dark" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AddUser;