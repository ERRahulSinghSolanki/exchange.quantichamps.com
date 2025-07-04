import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import { API_URL } from "config";

const AddPermission = () => {
  const [name, setName] = useState("");
  const [guardName, setGuardName] = useState("web");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setSnackbar({ open: true, message: "Please enter permission name", color: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          guard_name: guardName,
        }),
      });

      if (!response.ok) throw new Error("Error creating permission");

      setSnackbar({ open: true, message: "Permission added successfully!", color: "success" });
      setTimeout(() => navigate("/projects/permissions/list"), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to create permission", color: "error" });
    }
  };

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
        <SoftTypography variant="h5" mb={2}>Add New Permission</SoftTypography>
        <form onSubmit={handleSubmit}>
          <SoftBox mb={2}>
            <SoftInput 
              placeholder="Permission Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              fullWidth 
            />
          </SoftBox>
          <SoftBox mb={2}>
            <SoftInput
              placeholder="Guard Name"
              value={guardName}
              onChange={(e) => setGuardName(e.target.value)}
              fullWidth
            />
          </SoftBox>
          <SoftBox display="flex" gap={2}>
            <SoftButton type="submit" color="dark">Create Permission</SoftButton>
            <SoftButton 
              variant="outlined" 
              color="dark" 
              onClick={() => navigate("/projects/permissions/list")}
            >
              Cancel
            </SoftButton>
          </SoftBox>
        </form>
      </SoftBox>
    </DashboardLayout>
  );
};

export default AddPermission;