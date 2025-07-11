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

  const [formData, setFormData] = useState({});
  const [branches, setBranches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState({
    initial: true,
    form: false,
    shifts: false,
    managers: false,
    teamLeaders: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [isManagerRole, setIsManagerRole] = useState(false);
  const [isTeamLeaderRole, setIsTeamLeaderRole] = useState(false);
  const [isHRRole, setIsHRRole] = useState(false);
  const [isUserRole, setIsUserRole] = useState(false);

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
    const fetchUserData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        const res = await fetchWithAuth(`${API_URL}/users/${id}`);
        const user = res.user;

        // Format shifts for dropdown
        const formattedShifts = (res.dropdowns.shifts || []).map(shift => ({
          ...shift,
          label: `${shift.type} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`,
        }));

        // Filter out admin role
        const filteredRoles = (res.dropdowns.roles || []).filter(role => role.id !== 1);

        // Set all data
        setBranches(res.dropdowns.branches || []);
        setShifts(formattedShifts);
        setManagers((res.dropdowns.managers || []).map(m => ({ ...m, id: m.id.toString() })));
        setTeamLeaders((res.dropdowns.team_leaders || []).map(tl => ({ ...tl, id: tl.id.toString() })));
        setRoles(filteredRoles);

        // Determine if user has multiple shifts
        const userShifts = user.shifts || [];
        const hasMultipleShifts = userShifts.length > 1;

        // Set form data with current user values
        setFormData({
          name: user.name || "",
          email: user.email || "",
          branch_id: user.branch_id?.toString() || "",
          shift_id: hasMultipleShifts ? "" : userShifts[0]?.id?.toString() || "",
          shift_ids: hasMultipleShifts ? userShifts.map(s => s.id.toString()) : [],
          manager_id: user.manager_id?.toString() || "",
          team_leader_id: user.team_leader_id?.toString() || "",
          role_id: user.roles?.[0]?.id?.toString() || "",
          password: "",
          confirmPassword: "",
        });

        // Set role states
        const userRole = filteredRoles.find(r => r.id === parseInt(user.roles?.[0]?.id));
        if (userRole) {
          setIsManagerRole(userRole.name.toLowerCase() === "manager");
          setIsTeamLeaderRole(userRole.name.toLowerCase() === "team leader");
          setIsHRRole(userRole.name.toLowerCase() === "hr");
          setIsUserRole(userRole.name.toLowerCase() === "user");
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const loadShiftsAndManagers = async () => {
      if (!formData.branch_id) return;
      try {
        setLoading(prev => ({ ...prev, shifts: true, managers: true }));
        const [shiftsData, managersData] = await Promise.all([
          fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/shifts`),
          fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/managers`),
        ]);

        const formattedShifts = (shiftsData.shifts || []).map(shift => ({
          ...shift,
          label: `${shift.type} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`,
        }));

        setShifts(formattedShifts);
        setManagers((managersData || []).map(m => ({ ...m, id: m.id.toString() })));
        setTeamLeaders([]);
        
        // Update shift selections when shifts are reloaded
        if (isManagerRole || isHRRole) {
          // For HR/Manager, keep the selected shifts that still exist in the new list
          const availableShiftIds = formattedShifts.map(s => s.id.toString());
          const filteredShiftIds = formData.shift_ids?.filter(id => availableShiftIds.includes(id)) || [];
          setFormData(prev => ({ ...prev, shift_ids: filteredShiftIds }));
        } else {
          // For Team Leader/User, reset shift if it's not available in new list
          const shiftExists = formattedShifts.some(s => s.id.toString() === formData.shift_id);
          if (!shiftExists) {
            setFormData(prev => ({ ...prev, shift_id: "" }));
          }
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, shifts: false, managers: false }));
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
        setLoading(prev => ({ ...prev, teamLeaders: true }));
        const data = await fetchWithAuth(`${API_URL}/users/team-leaders/${formData.manager_id}`);
        setTeamLeaders((data || []).map(tl => ({ ...tl, id: tl.id.toString() })));
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, teamLeaders: false }));
      }
    };
    loadTeamLeaders();
  }, [formData.manager_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "role_id") {
      const selectedRole = roles.find(role => role.id === parseInt(value));
      const isNewManagerRole = selectedRole?.name.toLowerCase() === "manager";
      const isNewHRRole = selectedRole?.name.toLowerCase() === "hr";
      const isNewTeamLeaderRole = selectedRole?.name.toLowerCase() === "team leader";
      const isNewUserRole = selectedRole?.name.toLowerCase() === "user";
      
      setIsManagerRole(isNewManagerRole);
      setIsTeamLeaderRole(isNewTeamLeaderRole);
      setIsHRRole(isNewHRRole);
      setIsUserRole(isNewUserRole);
      
      // Reset shift selections when role changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        shift_id: isNewManagerRole || isNewHRRole ? "" : prev.shift_id,
        shift_ids: isNewManagerRole || isNewHRRole ? [] : prev.shift_ids
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiShiftChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, shift_ids: selectedOptions }));
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
      const payload = {
        name: formData.name,
        email: formData.email,
        branch_id: parseInt(formData.branch_id),
        manager_id: formData.manager_id ? parseInt(formData.manager_id) : null,
        team_leader_id: formData.team_leader_id ? parseInt(formData.team_leader_id) : null,
        roles: [parseInt(formData.role_id)],
      };

      // Add shifts based on role type
      if (isManagerRole || isHRRole) {
        if (formData.shift_ids.length === 0) {
          throw new Error("Please select at least one shift");
        }
        payload.shift_ids = formData.shift_ids.map(id => parseInt(id));
      } else {
        if (!formData.shift_id) {
          throw new Error("Please select a shift");
        }
        payload.shift_id = parseInt(formData.shift_id);
      }

      if (formData.password) {
        payload.password = formData.password;
      }

      await fetchWithAuth(`${API_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSnackbar({ open: true, message: "User updated successfully", color: "success" });
      setTimeout(() => navigate("/users/list"), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, color: "error" });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  // Field disabled states
  const isBranchDisabled = !formData.role_id;
  const isShiftDisabled = !formData.branch_id || loading.shifts;
  const isManagerDisabled = !formData.branch_id || !(isHRRole || isTeamLeaderRole || isUserRole) || loading.managers;
  const isTeamLeaderDisabled = !formData.manager_id || !isUserRole || loading.teamLeaders;

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
        <SoftBox component="form" onSubmit={handleSubmit} autoComplete="off" noValidate>
          {/* Name */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Name</SoftTypography>
            <SoftInput
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="off"
            />
          </SoftBox>

          {/* Email */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Email</SoftTypography>
            <SoftInput
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="off"
            />
          </SoftBox>

          {/* Role */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Role</SoftTypography>
            <select
              name="role_id"
              value={formData.role_id || ""}
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
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </SoftBox>

          {/* Branch */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Branch</SoftTypography>
            <select
              name="branch_id"
              value={formData.branch_id || ""}
              onChange={handleChange}
              required
              disabled={isBranchDisabled}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px",
                backgroundColor: isBranchDisabled ? "#f5f5f5" : "white",
              }}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </SoftBox>

          {/* Shift - Single for Team Leader/User */}
          {(isTeamLeaderRole || isUserRole) && (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold">Shift</SoftTypography>
              <select
                name="shift_id"
                value={formData.shift_id || ""}
                onChange={handleChange}
                required
                disabled={isShiftDisabled}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px",
                  backgroundColor: isShiftDisabled ? "#f5f5f5" : "white",
                }}
              >
                <option value="">Select Shift</option>
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.label}
                  </option>
                ))}
              </select>
            </SoftBox>
          )}

          {/* Shift - Multi for Manager/HR */}
          {(isManagerRole || isHRRole) && (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold">
                Shifts (Hold Ctrl/Cmd to select multiple)
              </SoftTypography>
              <select
                name="shift_ids"
                multiple
                value={formData.shift_ids || []}
                onChange={handleMultiShiftChange}
                required
                disabled={isShiftDisabled}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px",
                  minHeight: "100px",
                  backgroundColor: isShiftDisabled ? "#f5f5f5" : "white",
                }}
              >
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.label}
                  </option>
                ))}
              </select>
              {formData.shift_ids?.length > 0 && (
                <SoftTypography variant="caption" color="text">
                  Selected: {formData.shift_ids.length} shifts
                </SoftTypography>
              )}
            </SoftBox>
          )}

          {/* Manager */}
          {(isHRRole || isTeamLeaderRole || isUserRole) && (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold">Manager</SoftTypography>
              <select
                name="manager_id"
                value={formData.manager_id || ""}
                onChange={handleChange}
                required={isHRRole || isTeamLeaderRole || isUserRole}
                disabled={isManagerDisabled}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px",
                  backgroundColor: isManagerDisabled ? "#f5f5f5" : "white",
                }}
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </SoftBox>
          )}

          {/* Team Leader */}
          {isUserRole && (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold">Team Leader</SoftTypography>
              <select
                name="team_leader_id"
                value={formData.team_leader_id || ""}
                onChange={handleChange}
                required={isUserRole}
                disabled={isTeamLeaderDisabled}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d2d6da",
                  fontSize: "14px",
                  backgroundColor: isTeamLeaderDisabled ? "#f5f5f5" : "white",
                }}
              >
                <option value="">Select Team Leader</option>
                {teamLeaders.map((leader) => (
                  <option key={leader.id} value={leader.id}>
                    {leader.name}
                  </option>
                ))}
              </select>
            </SoftBox>
          )}

          {/* Password */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">New Password (Optional)</SoftTypography>
            <SoftInput
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              fullWidth
              autoComplete="new-password"
            />
          </SoftBox>

          {/* Confirm Password */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Confirm Password</SoftTypography>
            <SoftInput
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              fullWidth
              autoComplete="new-password"
            />
          </SoftBox>

          {/* Submit */}
          <SoftBox mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton color="secondary" onClick={() => navigate("/users/list")} disabled={loading.form}>
              Cancel
            </SoftButton>
            <SoftButton type="submit" color="dark" disabled={loading.form}>
              {loading.form ? "Updating..." : "Update User"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default EditUser;