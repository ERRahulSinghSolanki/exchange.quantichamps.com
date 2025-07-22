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

const AddDesignation = () => {
  const [designationName, setDesignationName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [loading, setLoading] = useState(true); // Start with loading true for page load
  const [submitLoading, setSubmitLoading] = useState(false); // separate loading for submit
  const navigate = useNavigate();

  // Simulate loading on page load (replace with real fetch if needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 0.8 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!designationName) {
      setSnackbar({ open: true, message: "Please fill the designation name", color: "error" });
      return;
    }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/designations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: designationName,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error creating designation");

      setSnackbar({ open: true, message: data.message || "Designation added successfully!", color: "success" });
      setTimeout(() => navigate("/designations"), 1500);
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
        title="Designation"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
      />
      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography variant="h4" fontWeight="bold">
            Add Designation
          </SoftTypography>
          <SoftButton
            variant="gradient"
            color="info"
            onClick={() => navigate("/designations")}
            startIcon={<Icon>list</Icon>}
          >
            Designation List
          </SoftButton>
        </SoftBox>

        <form onSubmit={handleSubmit}>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Designation Name"
              value={designationName}
              onChange={(e) => setDesignationName(e.target.value)}
              required
            />
          </SoftBox>
          <SoftButton
            type="submit"
            color="info"
            disabled={submitLoading}
            endIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitLoading ? "Processing..." : "Submit Designation"}
          </SoftButton>
        </form>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AddDesignation;