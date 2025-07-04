import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import Select from "react-select";
import { API_URL } from "config";

const AddTeamLeader = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [3],
    branch_id: "",
    shift_ids: [],
    manager_id: ""
  });

  const [branches, setBranches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState({
    form: false,
    branches: false,
    shifts: false,
    managers: false
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
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return response.json();
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(prev => ({ ...prev, branches: true }));
        const branchesData = await fetchWithAuth(`${API_URL}/branches`);
        if (Array.isArray(branchesData.data)) {
          setBranches(branchesData.data);
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, branches: false }));
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchShifts = async () => {
      if (!formData.branch_id) return;

      try {
        setLoading(prev => ({ ...prev, shifts: true }));
        const data = await fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/shifts`);
        if (Array.isArray(data.shifts)) {
          setShifts(data.shifts);
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, shifts: false }));
      }
    };
    fetchShifts();
  }, [formData.branch_id]);

  useEffect(() => {
    const fetchManagers = async () => {
      if (!formData.branch_id) {
        setManagers([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, managers: true }));
        const data = await fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/managers`);
        if (Array.isArray(data)) {
          setManagers(data);
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading(prev => ({ ...prev, managers: false }));
      }
    };
    fetchManagers();
  }, [formData.branch_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      shift_ids: selectedOption ? [selectedOption.value] : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, form: true }));

    try {
      const teamLeaderData = {
        ...formData,
        branch_id: parseInt(formData.branch_id),
        shift_ids: formData.shift_ids.map(id => parseInt(id)),
        manager_id: parseInt(formData.manager_id),
        roles: [3],
      };

      await fetchWithAuth(`${API_URL}/teamleader`, {
        method: "POST",
        body: JSON.stringify(teamLeaderData),
      });

      setSnackbar({ open: true, message: "Team Leader added successfully", color: "success" });
      setTimeout(() => navigate("/projects/teamleader/list"), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, color: "error" });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const shiftOptions = shifts.map(shift => ({
    value: shift.id,
    label: `${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} [${shift.shift_code} ${shift.start_time} - ${shift.end_time}]`,
  }));

  const selectedShift = shiftOptions.find(option => formData.shift_ids[0] === option.value) || null;

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
          Add New Team Leader
        </SoftTypography>

        <SoftBox component="form" onSubmit={handleSubmit} autoComplete="off">
          {/* Name */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Name</SoftTypography>
            <SoftInput name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required fullWidth />
          </SoftBox>

          {/* Email */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Email</SoftTypography>
            <SoftInput type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required fullWidth />
          </SoftBox>

          {/* Password */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Password</SoftTypography>
            <SoftInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required fullWidth />
          </SoftBox>

          {/* Confirm Password */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Confirm Password</SoftTypography>
            <SoftInput type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Confirm Password" required fullWidth />
          </SoftBox>

          {/* Branch */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Branch</SoftTypography>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
              disabled={loading.branches}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px",
                backgroundColor: loading.branches ? "#f0f0f0" : "white",
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

          {/* Shift */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Shift</SoftTypography>
            <Select
              name="shift_ids"
              options={shiftOptions}
              value={selectedShift}
              onChange={handleShiftChange}
              isDisabled={!formData.branch_id || loading.shifts}
              placeholder="Select Shift"
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "1px solid #d2d6da",
                  borderRadius: "6px",
                  fontSize: "14px",
                  minHeight: "38px",
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                  color: "#999",
                }),
                input: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                }),
              }}
            />
          </SoftBox>

          {/* Manager */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Manager</SoftTypography>
            <select
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              required
              disabled={!formData.branch_id || loading.managers}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d2d6da",
                fontSize: "14px",
                backgroundColor: loading.managers ? "#f0f0f0" : "white",
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

          {/* Role */}
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold">Role</SoftTypography>
            <SoftInput value="Team Leader" readOnly fullWidth style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }} />
          </SoftBox>

          {/* Submit */}
          <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton variant="gradient" color="secondary" onClick={() => navigate("/projects/teamleader/list")} disabled={loading.form}>
              Cancel
            </SoftButton>
            <SoftButton variant="gradient" color="dark" type="submit" disabled={loading.form}>
              {loading.form ? "Adding..." : "Add Team Leader"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AddTeamLeader;
