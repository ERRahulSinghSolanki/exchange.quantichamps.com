import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import Select from "react-select";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";

const EditManager = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch_id: "",
    shift_ids: [],
  });

  const [branches, setBranches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState({
    form: false,
    branches: true,
    shifts: true,
    fullPage: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const navigate = useNavigate();
  const hasBranchChanged = useRef(false);

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
        const res = await fetchWithAuth(`${API_URL}/manager/${id}`);
        const user = res.user;

        setBranches(res.dropdowns.branches);
        setShifts(res.dropdowns.shifts);

        const shiftIds = user.shifts?.map((s) => Number(s.id)) || [];

        setFormData({
          name: user.name || "",
          email: user.email || "",
          branch_id: user.branch_id?.toString() || "",
          shift_ids: shiftIds,
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        setSnackbar({ open: true, message: error.message, color: "error" });
      } finally {
        setLoading({ form: false, branches: false, shifts: false, fullPage: false });
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!formData.branch_id || !hasBranchChanged.current) return;

    const fetchShiftsForBranch = async () => {
      try {
        setLoading((prev) => ({ ...prev, shifts: true }));
        const res = await fetchWithAuth(`${API_URL}/branches/${formData.branch_id}/shifts`);
        const updatedShifts = res.shifts || [];

        setShifts(updatedShifts);
        setFormData((prev) => ({
          ...prev,
          shift_ids: [],
        }));
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to load shifts", color: "error" });
      } finally {
        setLoading((prev) => ({ ...prev, shifts: false }));
      }
    };

    fetchShiftsForBranch();
  }, [formData.branch_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "branch_id") {
      hasBranchChanged.current = true;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShiftChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      shift_ids: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, form: true }));

    if (formData.password && formData.password !== formData.confirmPassword) {
      setSnackbar({ open: true, message: "Passwords do not match", color: "error" });
      setLoading((prev) => ({ ...prev, form: false }));
      return;
    }

    try {
      const updateData = {
        ...formData,
        branch_id: parseInt(formData.branch_id),
        shift_ids: formData.shift_ids.map((id) => parseInt(id)),
      };

      if (!updateData.password) delete updateData.password;

      await fetchWithAuth(`${API_URL}/manager/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      setSnackbar({ open: true, message: "Manager updated successfully", color: "success" });
      setTimeout(() => navigate("/projects/manager/list"), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to update manager", color: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const shiftOptions = shifts.map((shift) => ({
    value: Number(shift.id),
    label: `${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} [${shift.shift_code} ${shift.start_time?.slice(0, 5)} - ${shift.end_time?.slice(0, 5)}]`,
  }));

  const selectedShiftValues = shiftOptions.filter((opt) => formData.shift_ids.includes(opt.value));

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
        title="Manager"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
        time={3000}
      />
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          Edit Manager
        </SoftTypography>

        <SoftBox component="form" onSubmit={handleSubmit} autoComplete="off">
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              Name
            </SoftTypography>
            <SoftInput name="name" value={formData.name} onChange={handleChange} required fullWidth />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              Email
            </SoftTypography>
            <SoftInput name="email" value={formData.email} onChange={handleChange} required fullWidth />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              Branch
            </SoftTypography>
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

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              Shifts
            </SoftTypography>
            <Select
              isMulti
              name="shift_ids"
              options={shiftOptions}
              value={selectedShiftValues}
              onChange={handleShiftChange}
              isDisabled={!formData.branch_id || loading.shifts}
              placeholder="Select Shifts"
              menuPlacement="auto"
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "1px solid #d2d6da",
                  borderRadius: "6px",
                  minHeight: "38px",
                  fontSize: "14px",
                  fontFamily: "'Roboto', sans-serif",
                  boxShadow: "none",
                }),
                input: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                  fontFamily: "'Roboto', sans-serif",
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                  fontFamily: "'Roboto', sans-serif",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#e5e8ec",
                  borderRadius: "4px",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  fontSize: "13px",
                  fontFamily: "'Roboto', sans-serif",
                }),
              }}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              New Password
            </SoftTypography>
            <SoftInput type="password" name="password" value={formData.password} onChange={handleChange} fullWidth />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" mb={1}>
              Confirm Password
            </SoftTypography>
            <SoftInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} fullWidth />
          </SoftBox>

          <SoftBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton variant="gradient" color="secondary" onClick={() => navigate("/projects/manager/list")} disabled={loading.form}>
              Cancel
            </SoftButton>
            <SoftButton variant="gradient" color="dark" type="submit" disabled={loading.form}>
              {loading.form ? "Updating..." : "Update Manager"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default EditManager;
