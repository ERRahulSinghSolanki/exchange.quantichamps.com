import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Grid from "@mui/material/Grid";
import SoftButton from "components/SoftButton";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";

import { Dialog, DialogTitle, DialogContent, DialogActions,CircularProgress } from "@mui/material";


// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";


// cells
import TimelineCell from "layouts/projects/view/components/TimelineCell";
import SurveyCell from "layouts/projects/view/components/SurveyCell";

import { API_URL } from "config";


function ProductsView() {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate(); // 👈 Ye line yahan honi chahiye
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get("page") || 1;
  const [is24, setIs24]  = useState(0); // Get the project ID from the URL
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true); // New state for page loading
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState(null);
  const [suppliers, setSuppliers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

const token = localStorage.getItem("authToken");

    /* const handleBack = () => {
  navigate(`/projects/list?page=${currentPage}`);
}; */

const handleBack = () => {
  navigate(-1);
};

  const fetchProject = async (initialLoad = false) => {
    if (initialLoad) setPageLoading(true);
    try {
      const response = await fetch(`${API_URL}/surveys/${id}?Is24=${is24}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProject(data.survey);
      setUsers(data.usersData);
      setSuppliers(data.suppliersData);
      setFilteredUsers(data.usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      if (initialLoad) setPageLoading(false);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredData = users.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };
 
  useEffect(() => {
    fetchProject(true); // Initial data load with loading spinner
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();  // No loading spinner for toggling between 24 Hours and All
    }
  }, [is24]);

  if (pageLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress size={70} />
          <SoftTypography variant="h6" ml={2}>
            Loading page, please wait...
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Card>
            {loading ? (
              <SoftBox display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress size={70}/>
              </SoftBox>
            ) : error ? (
              <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
                <div>Error: {error}</div>
              </SoftBox>
            ) : (
              <SoftBox my={3} mx={3} p={2} >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    {/* this is for survey data */}
                    <SurveyCell survey={project} title="Survey Information" />
                     
                    {/* this is for users data */}
                    <SoftBox mt={4} >
                      <Grid container>
                        <Grid item xs={6}>
                          <SoftTypography fontWeight="bold" mb={2}  color="primary"  style={{ fontSize: "20px" }} >
                            Users Analysis 
                          </SoftTypography>
                        </Grid>
                         {/* 🔙 Back button yahan add kiya gaya hai */}
                        <Grid item xs={3}>
                        <SoftButton
                        onClick={handleBack}
                        variant="outlined"
                        color="secondary"
                        size="small"
                        style={{ margin: "0px 10px", width: "150px" }}
                        >
                        Back
                        </SoftButton>
                        </Grid>
                        <Grid item xs={3}>
                          {is24 == 0 ?
                          <SoftButton variant="outlined" color="primary" size="small" style={{ margin: "0px 10px",width: "150px" }} onClick={() => {setIs24(1);}}>
                            24 Hours
                          </SoftButton>
                          : <SoftButton variant="outlined" color="primary" style={{ margin: "0px 10px", width: "150px" }} size="small" onClick={ () => {setIs24(0);}}>
                          All
                          </SoftButton>}
                        </Grid>
                        <Grid item xs={3}>
                          <SoftInput 
                            size="small"
                            placeholder="Search users by name" 
                            value={searchTerm} 
                            onChange={handleSearchChange}
                            fullWidth 
                            style={{ padding: "6px 10px" }}
                          />
                        </Grid>
                      </Grid>

                      <DataTable
                        table={{
                          columns: [
                            { Header: "user_id", accessor: "user_id" },
                            { Header: "name", accessor: "name", width: "25%" },
                            { Header: "completes", accessor: "completes" },
                            { Header: "terminates", accessor: "failures" },
                            { Header: "initiates", accessor: "initiates" },
                            { Header: "overquotas", accessor: "overquotas" },
                            { Header: "s.terminates", accessor: "terminates" },
                            { Header: "qualities", accessor: "qualities" },
                          ],
                          rows: filteredUsers
                          }}
                          entriesPerPage={{
                            defaultValue: 50
                          }}
                          canSearch={false}
                          showTotalEntries={true}
                          isSorted={false}
                          isShowEntriesPageContent={false}
                      />
                    </SoftBox>

                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TimelineCell title="Timeline Section" dark />
                  </Grid>
                </Grid>
              </SoftBox>
            )  
            }
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ProductsView;