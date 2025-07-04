import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import { API_URL } from "config";

const EditPermission = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [guardName, setGuardName] = useState("web");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // New state for button loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/permissions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch permission");
        
        const data = await response.json();
        setName(data.permission.name);
        setGuardName(data.permission.guard_name);
      } catch (err) {
        setSnackbar({ open: true, message: err.message, color: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      setSnackbar({ open: true, message: "Please enter permission name", color: "error" });
      return;
    }

    setUpdating(true); // Start loading

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/permissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          guard_name: guardName
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to update permission");
      }

      setSnackbar({ 
        open: true, 
        message: "Permission updated successfully!", 
        color: "success" 
      });
      
      setTimeout(() => navigate("/projects/permissions/list"), 1500);
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message, 
        color: "error" 
      });
    } finally {
      setUpdating(false); // Stop loading in any case
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox p={3}>
          <SoftTypography>Loading permission data...</SoftTypography>
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
        title="Permission"
        content={snackbar.message}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
      />
      <SoftBox p={3}>
        <SoftTypography variant="h5" mb={2}>Edit Permission</SoftTypography>
        <form onSubmit={handleSubmit}>
          <SoftBox mb={2}>
            <SoftInput 
              placeholder="Permission Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              fullWidth 
              required
              disabled={updating} // Disable input while updating
            />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Guard Name"
              value={guardName}
              readOnly
              fullWidth
            />
          </SoftBox>
          <SoftBox display="flex" gap={2}>
            <SoftButton 
              type="submit" 
              color="dark"
              disabled={updating} // Disable button while updating
            >
              {updating ? "Updating Permission..." : "Update Permission"}
            </SoftButton>
            <SoftButton 
              variant="outlined" 
              color="dark" 
              onClick={() => navigate("/projects/permissions/list")}
              disabled={updating} // Disable cancel button too
            >
              Cancel
            </SoftButton>
          </SoftBox>
        </form>
      </SoftBox>
    </DashboardLayout>
  );
};

export default EditPermission;