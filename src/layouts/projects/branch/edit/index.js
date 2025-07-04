import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import { API_URL } from "config";

const EditBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState({ name: "", code: "", address: "", status: "active" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", color: "success" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // ✅ Page load spinner state

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/branches/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setBranch({
          name: data.data.name,
          code: data.data.code,
          address: data.data.address,
          status: data.data.status === 1 ? "active" : "inactive",
        });
      } catch {
        setSnackbar({ open: true, message: "Error loading branch", color: "error" });
      } finally {
        setPageLoading(false); // ✅ Hide spinner when done
      }
    };
    fetchBranch();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!branch.name.trim() || !branch.address.trim()) {
      setSnackbar({
        open: true,
        message: "Branch Name and Location are required.",
        color: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${API_URL}/branches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...branch,
          status: branch.status === "active" ? 1 : 0,
        }),
      });
      setSnackbar({ open: true, message: "Branch updated", color: "success" });
      setTimeout(() => navigate("/projects/branches"), 1500);
    } catch {
      setSnackbar({ open: true, message: "Update failed", color: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftSnackbar
        {...snackbar}
        open={snackbar.open}
        close={() => setSnackbar({ ...snackbar, open: false })}
      />

      {pageLoading ? (
        // ✅ Full-page spinner during initial load
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress size={40} color="info" />
        </SoftBox>
      ) : (
        <SoftBox p={3}>
          <SoftTypography variant="h5" mb={2}>Edit Branch</SoftTypography>
          <form onSubmit={handleUpdate}>
            <SoftBox mb={2}>
              <SoftInput
                placeholder="Branch Name"
                value={branch.name}
                onChange={(e) => setBranch({ ...branch, name: e.target.value })}
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                placeholder="Branch Code"
                value={branch.code}
                readOnly // ✅ Read-only
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                placeholder="Location"
                value={branch.address}
                onChange={(e) => setBranch({ ...branch, address: e.target.value })}
              />
            </SoftBox>
            <SoftBox display="flex" alignItems="center" mb={2}>
              <Switch
                checked={branch.status === "active"}
                onChange={() =>
                  setBranch({
                    ...branch,
                    status: branch.status === "active" ? "inactive" : "active",
                  })
                }
              />
              <SoftTypography variant="body2" ml={1}>
                {branch.status === "active" ? "Active" : "Inactive"}
              </SoftTypography>
            </SoftBox>
            <SoftButton type="submit" color="info" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Update Branch"}
            </SoftButton>
          </form>
        </SoftBox>
      )}
    </DashboardLayout>
  );
};

export default EditBranch;
