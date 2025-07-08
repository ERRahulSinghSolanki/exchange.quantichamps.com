import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { API_URL } from "config";

const AddBranch = () => {
  const [branchName, setBranchName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [loading, setLoading] = useState(true); // Start with loading true for page load
  const [submitLoading, setSubmitLoading] = useState(false); // separate loading for submit
  const navigate = useNavigate();

  // Simulate loading on page load (replace with real fetch if needed)
  useEffect(() => {
    // For example, fetch some initial data if required
    // setLoading(false) after data ready
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 0.8 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName || !branchCode || !address) {
      setSnackbar({ open: true, message: "Please fill all fields", color: "error" });
      return;
    }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/branches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: branchName,
          code: branchCode,
          address,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error creating branch");

      setSnackbar({ open: true, message: data.message || "Branch added successfully!", color: "success" });
      setTimeout(() => navigate("/branches"), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Something went wrong", color: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress size={60} color="info" />
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
        title="Branch"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
      />
      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">
            Add Branch
          </SoftTypography>
          <SoftButton
            variant="gradient"
            color="info"
            onClick={() => navigate("/branches")}
            startIcon={<Icon>list</Icon>}
          >
            Branch List
          </SoftButton>
        </SoftBox>

        <form onSubmit={handleSubmit}>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Branch Code"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              required
            />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </SoftBox>
          <SoftBox display="flex" alignItems="center" mb={2}>
            <Switch
              checked={status}
              onChange={() => setStatus(!status)}
              color="primary"
            />
            <SoftTypography variant="body2" ml={1}>
              {status ? "Active" : "Inactive"}
            </SoftTypography>
          </SoftBox>
          <SoftButton
            type="submit"
            color="info"
            disabled={submitLoading}
            endIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitLoading ? "Processing..." : "Submit Branch"}
          </SoftButton>
        </form>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AddBranch;
