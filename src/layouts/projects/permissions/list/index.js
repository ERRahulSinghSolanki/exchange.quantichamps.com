import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftSnackbar from "components/SoftSnackbar";
import Table from "examples/Tables/Table";
import { API_URL } from "config";
import TablePagination from "@mui/material/TablePagination";


const PermissionsList = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    color: "success" 
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 25,
    total: 0
  });

  const [pageInput, setPageInput] = useState(pagination.page);

  const navigate = useNavigate();

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      
      const response = await fetch(
        `${API_URL}/permissions?page=${pagination.page}&per_page=${pagination.perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      
      // Handle multiple possible response formats
      let permissionsData = [];
      let totalCount = 0;
      
      if (Array.isArray(data)) {
        permissionsData = data;
        totalCount = data.length;
      } 
      else if (Array.isArray(data.permissions)) {
        permissionsData = data.permissions;
        totalCount = data.permissions.length;
      }
      else if (data.permissions?.data && Array.isArray(data.permissions.data)) {
        permissionsData = data.permissions.data;
        totalCount = data.permissions.total || data.permissions.data.length;
      }
      else if (data.data && Array.isArray(data.data)) {
        permissionsData = data.data;
        totalCount = data.total || data.data.length;
      }
      
      if (!Array.isArray(permissionsData)) {
        throw new Error("Invalid permissions data format received from API");
      }
      
      setPermissions(permissionsData);
      setPagination(prev => ({
        ...prev,
        total: totalCount
      }));

    } catch (err) {
      console.error("Fetch error:", err);
      setSnackbar({ 
        open: true, 
        message: err.message || "Failed to fetch permissions", 
        color: "error" 
      });
      setPermissions([]); // Ensure we always have an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [pagination.page, pagination.perPage]);
  
  useEffect(() => {
  setPageInput(pagination.page);
}, [pagination.page]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");
      
      const response = await fetch(`${API_URL}/permissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error deleting permission");
      }
      
      setSnackbar({ 
        open: true, 
        message: "Permission deleted successfully", 
        color: "success" 
      });
      
      // Refresh permissions list
      if (permissions.length === 1 && pagination.page > 1) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchPermissions();
      }
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || "Failed to delete permission", 
        color: "error" 
      });
    }
  };

  const columns = [
    { name: "id", align: "left" },
    { name: "name", align: "left" },
    { name: "guard_name", align: "left" },
    { name: "action", align: "center" },
  ];

  // Safely generate rows even if permissions is not an array
  const rows = Array.isArray(permissions) 
    ? permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        guard_name: permission.guard_name,
        action: (
          <SoftBox display="flex" justifyContent="center">
            <SoftButton 
              size="small" 
              color="info" 
              onClick={() => navigate(`/projects/permissions/edit/${permission.id}`)}
              sx={{ mx: 0.5 }}
            >
              Edit
            </SoftButton>
            <SoftButton 
              size="small" 
              color="error" 
              onClick={() => handleDelete(permission.id)}
              sx={{ mx: 0.5 }}
            >
              Delete
            </SoftButton>
          </SoftBox>
        ),
      }))
    : [];

const handlePerPageChange = (newPerPage) => {
  setPagination({ ...pagination, perPage: newPerPage, page: 1 });
};

const handlePageChange = (newPage) => {
  const totalPages = Math.ceil(pagination.total / pagination.perPage);
  if (newPage >= 1 && newPage <= totalPages) {
    setPagination({ ...pagination, page: newPage });
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
        time={3000}
      />
      <SoftBox p={3}>
      <SoftBox mb={3}>
  <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
    <SoftTypography variant="h5" fontWeight="medium">
      Permissions List
    </SoftTypography>

    <SoftButton 
      variant="gradient"
      color="dark" 
      onClick={() => navigate("/projects/permissions/add")}
    >
      <SoftTypography variant="button" color="white">
        Add New Permission
      </SoftTypography>
    </SoftButton>
  </SoftBox>

  <SoftBox display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
  <SoftButton
    variant="outlined"
    size="small"
    onClick={() => handlePageChange(1)}
    disabled={pagination.page === 1}
  >
    {"<<"}
  </SoftButton>

  <SoftButton
    variant="outlined"
    size="small"
    onClick={() => handlePageChange(pagination.page - 1)}
    disabled={pagination.page === 1}
  >
    {"<"}
  </SoftButton>

  <input
  type="number"
  value={pageInput}
  min={1}
  max={Math.ceil(pagination.total / pagination.perPage)}
  onChange={(e) => {
    setPageInput(e.target.value);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInput);
      if (!isNaN(newPage)) {
        handlePageChange(newPage);
      }
    }
  }}
  onBlur={() => {
    const newPage = parseInt(pageInput);
    if (!isNaN(newPage)) {
      handlePageChange(newPage);
    }
  }}
  style={{
    width: "60px",
    textAlign: "center",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  }}
/>


  <SoftButton
    variant="outlined"
    size="small"
    onClick={() => handlePageChange(pagination.page + 1)}
    disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
  >
    {">"}
  </SoftButton>

  <SoftButton
    variant="outlined"
    size="small"
    onClick={() =>
      handlePageChange(Math.ceil(pagination.total / pagination.perPage))
    }
    disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
  >
    {">>"}
  </SoftButton>
</SoftBox>
   
<SoftTypography variant="caption" color="text" mt={1}>
  {pagination.total > 0 && (
    <>
      Showing{" "}
      <strong>
        {(pagination.page - 1) * pagination.perPage + 1}
      </strong>{" "}
      to{" "}
      <strong>
        {Math.min(pagination.page * pagination.perPage, pagination.total)}
      </strong>{" "}
      of <strong>{pagination.total}</strong> entries
    </>
  )}
</SoftTypography>


</SoftBox>


        
        {loading ? (
          <SoftBox textAlign="center" py={4}>
            <SoftTypography variant="body2">Loading permissions...</SoftTypography>
          </SoftBox>
        ) : (
          <>
            {permissions.length > 0 ? (
              <>
                <Table 
                  columns={columns} 
                  rows={rows} 
                />
        
              </>
            ) : (
              <SoftBox textAlign="center" py={4}>
                <SoftTypography variant="body2">No permissions found</SoftTypography>
              </SoftBox>
            )}
          </>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default PermissionsList;