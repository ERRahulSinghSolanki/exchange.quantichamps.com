import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";

const EditDesignation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [designation, setDesignation] = useState({ name: "" });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    color: "success" 
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch designation data
  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/designations/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch designation");
        }

        setDesignation({
          name: data.data.name
        });

      } catch (error) {
        setSnackbar({ 
          open: true, 
          message: error.message || "Error loading designation", 
          color: "error" 
        });
        
        if (error.message.includes("not found")) {
          navigate("/designations");
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchDesignation();
  }, [id, navigate]);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!designation.name.trim()) {
      setSnackbar({
        open: true,
        message: "Designation name is required",
        color: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/designations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: designation.name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update designation");
      }

      setSnackbar({ 
        open: true, 
        message: data.message || "Designation updated successfully", 
        color: "success" 
      });

      setTimeout(() => navigate("/designations"), 1500);

    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message || "Update failed", 
        color: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (pageLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress size={40} color="info" />
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      {/* Notification Snackbar */}
      <SoftSnackbar
        open={snackbar.open}
        color={snackbar.color}
        icon="notifications"
        title="Designation"
        content={snackbar.message}
        onClose={() => setSnackbar({...snackbar, open: false})}
        time={3000}
      />

      {/* Main Content */}
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="bold" mb={3}>
          Edit Designation
        </SoftTypography>

        <form onSubmit={handleUpdate}>
          <SoftBox mb={3}>
            <SoftTypography 
              variant="caption" 
              fontWeight="bold" 
              display="block" 
              mb={1}
            >
              Designation Name
            </SoftTypography>
            <SoftInput
              placeholder="Enter designation name"
              value={designation.name}
              onChange={(e) => setDesignation({...designation, name: e.target.value})}
              fullWidth
            />
          </SoftBox>

          <SoftBox mt={4}>
            <SoftButton 
              type="submit" 
              color="info" 
              variant="gradient"
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Designation"
              )}
            </SoftButton>
          </SoftBox>
        </form>
      </SoftBox>
    </DashboardLayout>
  );
};

export default EditDesignation;