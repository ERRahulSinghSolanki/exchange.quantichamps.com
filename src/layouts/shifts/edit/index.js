import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import axios from "axios";
import { API_URL } from "config";

function EditShift() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    branch_id: "",
    type: "day",
    start_time: "",
    end_time: "",
    has_flexible_break: true,
    break_duration: "60",
    shift_code: "",
    grace_time: "",
    expected_hours: "480",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [timeError, setTimeError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
    icon: "check",
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const [branchRes, shiftRes] = await Promise.all([
          axios.get(`${API_URL}/branches`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/shifts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBranches(branchRes.data?.data || []);
        const shift = shiftRes.data?.data;
        if (shift) {
          setFormData({
            branch_id: shift.branch_id || "",
            type: shift.type || "day",
            start_time: shift.start_time || "",
            end_time: shift.end_time || "",
            has_flexible_break: shift.has_flexible_break ?? true,
            break_duration: shift.break_duration?.toString() || "60",
            shift_code: shift.shift_code || "",
            grace_time: shift.grace_time?.toString() || "",
            expected_hours: shift.expected_hours?.toString() || "480",
            is_active: shift.is_active ?? true,
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          color: "error",
          icon: "error",
        });
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const { start_time, end_time, break_duration, expected_hours } = formData;

    if (!start_time || !end_time || !expected_hours || !break_duration) {
      setTimeError("");
      return;
    }

    const [startH, startM] = start_time.split(":").map(Number);
    const [endH, endM] = end_time.split(":").map(Number);

    let start = startH * 60 + startM;
    let end = endH * 60 + endM;

    if (end < start) end += 24 * 60;

    const breakMins = parseInt(break_duration || "0", 10);
    const expectedMins = parseInt(expected_hours || "0", 10);

    const actualWorkingMins = end - start - breakMins;

    if (breakMins !== 60) {
      setTimeError("Break duration must be exactly 60 minutes.");
    } else if (actualWorkingMins !== expectedMins) {
      setTimeError(
        `Expected working minutes must equal shift duration - break. Currently ${actualWorkingMins} mins, but expected is ${expectedMins} mins.`
      );
    } else {
      setTimeError("");
    }
  }, [
    formData.start_time,
    formData.end_time,
    formData.break_duration,
    formData.expected_hours,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("authToken");

    const { start_time, end_time, break_duration, expected_hours } = formData;

    const [startH, startM] = start_time.split(":").map(Number);
    const [endH, endM] = end_time.split(":").map(Number);

    let start = startH * 60 + startM;
    let end = endH * 60 + endM;

    if (end < start) end += 24 * 60;

    const breakMins = parseInt(break_duration || "0", 10);
    const expectedMins = parseInt(expected_hours || "0", 10);

    const actualWorkingMins = end - start - breakMins;

    if (breakMins !== 60 || actualWorkingMins !== expectedMins) {
      setSnackbar({
        open: true,
        message: `Break must be 60 mins and working duration = expected (${expectedMins} mins).`,
        color: "error",
        icon: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/shifts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update shift.");
      }

      setSnackbar({
        open: true,
        message: "Shift updated successfully!",
        color: "success",
        icon: "check",
      });
      setTimeout(() => navigate("/shifts"), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update shift.",
        color: "error",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  if (pageLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4">Edit Shift</SoftTypography>
          <SoftButton color="info" onClick={() => navigate("/shifts")}>
            Go to Shift List
          </SoftButton>
        </SoftBox>

        <SoftBox maxWidth="600px" ml="0">
          <form onSubmit={handleSubmit}>
            <SoftBox mb={2}>
              <select
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
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
              <SoftTypography variant="caption">Shift Type</SoftTypography>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
              >
                <option value="day">Day</option>
                <option value="night">Night</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </SoftBox>

            <SoftBox mb={2} display="flex" gap={2}>
              <SoftInput
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
              <SoftInput
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </SoftBox>

            {timeError && (
              <SoftTypography variant="caption" color="error" mb={2}>
                {timeError}
              </SoftTypography>
            )}

            <SoftBox mb={2}>
              <SoftInput
                name="break_duration"
                type="number"
                placeholder="Break Duration (must be 60 mins)"
                value={formData.break_duration}
                onChange={handleChange}
              />
            </SoftBox>

            <SoftBox mb={2} display="flex" alignItems="center">
              <Switch
                checked={formData.has_flexible_break}
                onChange={handleChange}
                name="has_flexible_break"
              />
              <SoftTypography variant="button" ml={1}>
                Flexible Break
              </SoftTypography>
            </SoftBox>

            <SoftBox mb={2}>
              <SoftInput
                name="shift_code"
                placeholder="Shift Code"
                value={formData.shift_code}
                onChange={handleChange}
              />
            </SoftBox>

            <SoftBox mb={2}>
              <SoftInput
                name="grace_time"
                placeholder="Grace Time (in minutes)"
                value={formData.grace_time}
                onChange={handleChange}
              />
            </SoftBox>

            <input type="hidden" name="expected_hours" value={formData.expected_hours} />

            <SoftBox mb={2} display="flex" alignItems="center">
              <Switch
                checked={formData.is_active}
                onChange={handleChange}
                name="is_active"
              />
              <SoftTypography variant="button" ml={1}>
                Active
              </SoftTypography>
            </SoftBox>

            <SoftBox mt={3}>
              <SoftButton
                type="submit"
                color="info"
                fullWidth
                disabled={loading || !!timeError}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Shift"
                )}
              </SoftButton>
            </SoftBox>
          </form>
        </SoftBox>
      </SoftBox>

      <SoftSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        message={snackbar.message}
        color={snackbar.color}
        icon={<Icon>{snackbar.icon}</Icon>}
      />
    </DashboardLayout>
  );
}

export default EditShift;
