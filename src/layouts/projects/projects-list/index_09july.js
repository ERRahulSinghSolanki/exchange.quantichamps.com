import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import SearchableSelect from "components/SearchableSelect";
import CountryCodes from "components/CountryCodes";

import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Typography } from "@mui/material";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// ProductsList page components
import ProjectCell from "layouts/projects/projects-list/components/ProjectCell";
import ClientCell from "layouts/projects/projects-list/components/ClientCell";
import InfoCell from "layouts/projects/projects-list/components/InfoCell";
import ActionCell from "layouts/projects/projects-list/components/ActionCell";
import LinkCell from "layouts/projects/projects-list/components/LinkCell";
import CompleteCell from "layouts/projects/projects-list/components/CompleteCell";

import { API_URL } from "config";
import sampleCsv from "assets/files/Survey-Import-Format.xlsx";

function ProductsList() {
  const { permissions } = useAuth();
  const [projects, setProjects] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCompletes, setTotalCompletes] = useState(0);
  const [loading, setLoading] = useState(true);  
  const [isExporting, setIsExporting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromURL = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState([]);
  const [selectedClientSubAccounts, setSelectedClientSubAccounts] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientSubAccounts, setClientSubAccounts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [fromData, setFromData] = useState(0);
  const [toData, setToData] = useState(0);
  const [clientSurveyCreated, setClientSurveyCreated] = useState("Created");
  const [clientSurveyStatus, setClientSurveyStatus] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const token = localStorage.getItem("authToken");
  const location = useLocation();
  const navigate = useNavigate();

  // Permission check helper function
  const hasPermission = (permission) => {
    return permissions?.includes(permission);
  };

  const toggleSnackbar = () => setShow(!show);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileUpload = async (event) => {
    if (!hasPermission("viewprojects.import")) {
      setMessage("You don't have permission to import surveys");
      setShow(true);
      return;
    }
    
    const file = event.target.files[0];
    if (file) {
      setIsImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_URL}/surveys/import`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
  
        const data = await response.json();
  
        if (data.success === 1) {
          setMessage("File uploaded successfully!");
          setShow(true);
          fetchProjects(currentPage, searchQuery, clientSurveyCreated, selectedCountryCode, selectedClient, selectedClientSubAccounts, fromDate, toDate, clientSurveyStatus);
        } else {
          setMessage("Upload failed: " + data.message);
          setShow(true);
        }
      } catch (error) {
        setMessage("Error uploading file: " + error.message);
        setShow(true);
      } finally {
        setIsImporting(false);
        handleCloseModal();
      }
    }
    handleCloseModal();
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = sampleCsv;
    link.download = "Sample File.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchChange = (event) => {
    if (!hasPermission("viewprojects.search")) {
      setMessage("You don't have permission to search surveys");
      setShow(true);
      return;
    }
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      setCurrentPage('');
      return;
    }
    const pageNumber = Number(value);
    
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const fetchProjects = async (currentPage, searchQuery, clientSurveyCreated, selectedCountryCode, selectedClient, selectedClientSubAccounts, fromDate, toDate, clientSurveyStatus) => {
    setLoading(true);
    try {
      let queryString = `per_page=50&page=${currentPage}`;
      
      if (hasPermission("viewprojects.search") && searchQuery) {
        queryString += `&q=${searchQuery}`;
      }

      if(clientSurveyCreated == "Client"){
        if (fromDate) queryString += `&client_survey_created_start=${fromDate}`;
        if (toDate) queryString += `&client_survey_created_end=${toDate}`;
      }else{
        if (fromDate) queryString += `&start_date=${fromDate}`;
        if (toDate) queryString += `&end_date=${toDate}`;
      }
      
      if (hasPermission("viewprojects.filter_countries") && selectedCountryCode.length > 0) {
        selectedCountryCode.forEach(country => {
          queryString += `&country_code[]=${country}`;
        });
      }
      
      if (hasPermission("viewprojects.filter_clients") && selectedClient) {
        queryString += `&client_id=${selectedClient}`;
      }
      
      if (hasPermission("viewprojects.filter_sub_accounts") && selectedClientSubAccounts.length > 0) {
        selectedClientSubAccounts.forEach(subAccount => {
          queryString += `&client_sub_account[]=${subAccount}`;
        });
      }

      if (hasPermission("viewprojects.filter_status") && clientSurveyStatus.length > 0) {
        clientSurveyStatus.forEach(s => {
          queryString += `&client_survey_status[]=${s}`;
        });
      }

      const response = await fetch(`${API_URL}/surveys?${queryString}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      
      if (data.success !== 1) {
        throw new Error(`${data.message}`);
      }

      const transformedData = data.surveys.data.map(item => ({
        quantish_code: (
          <span
            style={{ cursor: "pointer", color: "#17c1e8"}}
            onClick={() => navigate(`/studies/${item.id}`)}
          >
            {item.name}
          </span>
        ),
        survey_id: hasPermission("viewprojects.survey_id") ? (item.client_project_id ?? item.client_survey_id) : "****",
        account_name: hasPermission("viewprojects.client_info") ? (
          <ClientCell name={item.client.name} client_sub_account={item.client_sub_account} client_survey_id={item.client_survey_id} />
        ) : null,
        country: hasPermission("viewprojects.country_info") ? (
          <InfoCell country_code={item.country_code} language_code={item.language_code} client_survey_status={item.client_survey_status} />
        ) : "****",
        completes_cpi: hasPermission("viewprojects.completes_cpi") ? (
          <CompleteCell completes_count={item.completes_count} quota={item.quota} cpi={item.cpi} />
        ) : "****",
        link: hasPermission("viewprojects.links") ? (
          <LinkCell survey_id={item.id} quest_code={item.name} />
        ) : null,
        created: hasPermission("viewprojects.dates") ? item.client_survey_created : "****",
        date: hasPermission("viewprojects.dates") ? new Date(item.updated_at).toLocaleString("en-GB").replace(",", "").replace(/\//g, "-") : "****",
        action: hasPermission("viewprojects.actions") ? (
          <ActionCell id={item.id} quest_code={item.name} />
        ) : null,
      }));

      setProjects(transformedData);
      setTotalPages(data.surveys.last_page);
      setFromData(data.surveys.from);
      setToData(data.surveys.to);
      setTotalSurveys(data.surveys.total);
      setTotalCompletes(data.totalCompletes);
      setTotalRevenue(data.totalRevenue);
    } catch (err) {
      setMessage(err.message);
      setShow(true);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects(currentPage, searchQuery, clientSurveyCreated, selectedCountryCode, selectedClient, selectedClientSubAccounts, fromDate, toDate, clientSurveyStatus);
  }, [currentPage, searchQuery, clientSurveyCreated, selectedCountryCode, selectedClient, selectedClientSubAccounts, fromDate, toDate, clientSurveyStatus]);

  useEffect(() => {
    const pageFromState = location.state?.page;
    if (pageFromState) {
      setCurrentPage(pageFromState);
    }
  }, [location.state]);

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", currentPage);
      return newParams;
    });
  }, [currentPage]);

  // Define columns based on permissions
  const dataTableData = {
    columns: [
      { name: "quantish_code", align: "center" },
      hasPermission("viewprojects.survey_id") && { name: "survey_id", align: "left" },
      hasPermission("viewprojects.client_info") && { name: "account_name", align: "left" },
      hasPermission("viewprojects.country_info") && { name: "country", align: "left" },
      hasPermission("viewprojects.completes_cpi") && { name: "completes_cpi", align: "center" },
      hasPermission("viewprojects.links") && { name: "link", align: "center" },
      hasPermission("viewprojects.dates") && { name: "created", align: "center" },
      hasPermission("viewprojects.dates") && { name: "date", align: "center" },
      hasPermission("viewprojects.actions") && { name: "action", align: "center" },
    ].filter(Boolean), // Remove falsy values
    rows: projects,
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
  };

  const countryCodes = CountryCodes().map((code) => ({
    value: code,
    label: code,
  }));

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/clients?per_page=250`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success === 1) {
        const clientOptions = data.clients.data.map((client) => ({
          value: client.id,
          label: client.name,
        }));
        setClients(clientOptions);      
      } else {
        console.error("Failed to fetch clients:", data.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    if (hasPermission("viewprojects.filter_clients")) {
      fetchClients();
    }
  }, []);

  const handleCountryChange = (selectedCountryCode) => {
    if (!hasPermission("viewprojects.filter_countries")) {
      setMessage("You don't have permission to filter by country");
      setShow(true);
      return;
    }
    setCurrentPage(1);
    const values = selectedCountryCode ? selectedCountryCode.map(option => option.value) : [];
    setSelectedCountryCode(values);
  };

  const handleClientChange = (selectedClient) => {
    if (!hasPermission("viewprojects.filter_clients")) {
      setMessage("You don't have permission to filter by client");
      setShow(true);
      return;
    }
    setCurrentPage(1);
    const selectedClientId = selectedClient ? selectedClient.value : null;
    setSelectedClient(selectedClientId);
    if (selectedClientId && hasPermission("viewprojects.filter_sub_accounts")) {
      fetchClientSubAccounts(selectedClientId);
    } else {
      setClientSubAccounts([]);
    }
  };

  const handleStatusFilter = (clientSurveyStatus) => {
    if (!hasPermission("viewprojects.filter_status")) {
      setMessage("You don't have permission to filter by status");
      setShow(true);
      return;
    }
    setCurrentPage(1);
    const values = clientSurveyStatus ? clientSurveyStatus.map(option => option.value) : [];
    setClientSurveyStatus(values);
  };

  const fetchClientSubAccounts = async (id) => {
    try {
      const response = await fetch(`${API_URL}/surveys/subaccounts?client_id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success === 1) {
        const subAccountsOptions = data.subAccounts.map((val) => ({
          value: val,
          label: val,
        }));
        setClientSubAccounts(subAccountsOptions);
      } else {
        console.error("Failed to fetch clients:", data.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleClientSubAccountsChange = (selectedClientSubAccounts) => {
    if (!hasPermission("viewprojects.filter_sub_accounts")) {
      setMessage("You don't have permission to filter by sub accounts");
      setShow(true);
      return;
    }
    setCurrentPage(1);
    const values = selectedClientSubAccounts ? selectedClientSubAccounts.map(option => option.value) : [];
    setSelectedClientSubAccounts(values);
  };

  const handleDateFilter = (clientSurveyCreated) => {
    if (!hasPermission("viewprojects.filter_dates")) {
      setMessage("You don't have permission to filter by date");
      setShow(true);
      return;
    }
    setCurrentPage(1);
    const filterDate = clientSurveyCreated ? clientSurveyCreated.value : null;
    setClientSurveyCreated(filterDate);
  };

  const dateOption = [
    {value: "Created", label: "Date Column"},
    {value: "Client", label: "Created Column"}
  ];

  const statuses = [
    {value: "OPEN", label: "OPEN"},
    {value: "PAUSED", label: "PAUSED"},
    {value: "CLOSED", label: "CLOSED"}
  ];

  // Define filter columns based on permissions
  const filterTableData = {
    columns: [
      hasPermission("viewprojects.filter_countries") && { name: "Country Codes", key:"country", align: "left" },
      hasPermission("viewprojects.filter_clients") && { name: "Clients", key:"client", align: "left" },
      hasPermission("viewprojects.filter_sub_accounts") && { name: "Clients Accounts Name", key:"subClients", align: "left" },
      hasPermission("viewprojects.filter_status") && { name: "Status", key:"status", align: "left" },
      hasPermission("viewprojects.filter_dates") && { name: "Date Filter By Column", key:"dateFilter", align: "left" },
      hasPermission("viewprojects.filter_dates") && { name: "From Date", key:"fromDate", align: "left" },
      hasPermission("viewprojects.filter_dates") && { name: "To Date", key:"toDate", align: "left" },
    ].filter(Boolean),
    rows: [
      {
        country: hasPermission("viewprojects.filter_countries") && (
          <SearchableSelect
            className="basic-multi-select"
            classNamePrefix="select"
            name="country"
            options={countryCodes}
            isMulti={true}
            fontSize={"10px"}
            onChange={handleCountryChange}
          />
        ),
        client: hasPermission("viewprojects.filter_clients") && (
          <SearchableSelect
            className="basic-select"
            classNamePrefix="select"
            name="client"
            options={clients}
            isMulti={false}
            fontSize={"10px"}
            onChange={handleClientChange}
          />
        ),
        subClients: hasPermission("viewprojects.filter_sub_accounts") && (
          <SearchableSelect
            className="basic-multi-select"
            classNamePrefix="select"
            name="subClients"
            options={clientSubAccounts}
            isMulti={true}
            fontSize={"10px"}
            onChange={handleClientSubAccountsChange}
          />
        ),
        status: hasPermission("viewprojects.filter_status") && (
          <SearchableSelect
            className="basic-select"
            classNamePrefix="select"
            name="client"
            options={statuses}
            isMulti={true}
            fontSize={"10px"}
            onChange={handleStatusFilter}
          />
        ),
        dateFilter: hasPermission("viewprojects.filter_dates") && (
          <SearchableSelect
            className="basic-select"
            classNamePrefix="select"
            name="client"
            defaultValue={dateOption[0]}
            options={dateOption}
            isMulti={false}
            fontSize={"10px"}
            onChange={handleDateFilter}
          />
        ),
        fromDate: hasPermission("viewprojects.filter_dates") && (
          <SoftInput type="datetime-local" sx={{ fontSize: "10px" }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        ),
        toDate: hasPermission("viewprojects.filter_dates") && (
          <SoftInput type="datetime-local" sx={{ fontSize: "10px" }} value={toDate} onChange={(e) => { setToDate(e.target.value); }} />
        )
      }
    ],
  };

  const exportData = async ({ searchQuery, clientSurveyCreated, selectedCountryCode = [], selectedClient, selectedClientSubAccounts = [], fromDate, toDate, clientSurveyStatus = [] }) => {
    if (!hasPermission("viewprojects.export")) {
      setMessage("You don't have permission to export surveys");
      setShow(true);
      return;
    }
    
    try {
      setIsExporting(true);
      let queryParams = [];

      if (selectedClient) queryParams.push(`client_id=${selectedClient}`);

      if (Array.isArray(selectedCountryCode) && selectedCountryCode.length > 0) {
          selectedCountryCode.forEach(country => {
              queryParams.push(`country_code[]=${country}`);
          });
      }

      if (Array.isArray(selectedClientSubAccounts) && selectedClientSubAccounts.length > 0) {
          selectedClientSubAccounts.forEach(subAccount => {
              queryParams.push(`client_sub_account[]=${subAccount}`);
          });
      }

      if (Array.isArray(clientSurveyStatus) && clientSurveyStatus.length > 0) {
          clientSurveyStatus.forEach(s => {
              queryParams.push(`client_survey_status[]=${s}`);
          });
      }

      if (clientSurveyCreated && clientSurveyCreated === "Client") {
          if (fromDate) queryParams.push(`client_survey_created_start=${fromDate}`);
          if (toDate) queryParams.push(`client_survey_created_end=${toDate}`);
      } else {
          if (fromDate) queryParams.push(`start_date=${fromDate}`);
          if (toDate) queryParams.push(`end_date=${toDate}`);
      }

      if (searchQuery) queryParams.push(`q=${searchQuery}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const response = await fetch(`${API_URL}/surveys/export${queryString}`, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const now = new Date();
      const formattedDate = now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + '_' +
          String(now.getHours()).padStart(2, '0') + '-' +
          String(now.getMinutes()).padStart(2, '0') + '-' +
          String(now.getSeconds()).padStart(2, '0');

      const filename = `quantish_survey_${formattedDate}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setMessage(err.message);
      setShow(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    exportData({searchQuery, clientSurveyCreated, selectedCountryCode, selectedClient, selectedClientSubAccounts, fromDate, toDate});
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar 
        color="primary" 
        icon="notifications" 
        title="Soft UI Dashboard" 
        content={message ?? ''} 
        open={show} 
        close={toggleSnackbar}
      />

      {(hasPermission("viewprojects.filter_countries") || hasPermission("viewprojects.filter_clients") || 
       hasPermission("viewprojects.filter_sub_accounts") || hasPermission("viewprojects.filter_status") || 
       hasPermission("viewprojects.filter_dates")) && (
        <Card style={{borderRadius: "0px"}}>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap", padding: "10px" }}>
            {filterTableData.columns.map((filter) => (
              <div key={filter.name} style={{ flex: 1 }}>
                <Typography variant="body2" gutterBottom style={{ fontSize: "12px" }}>
                  {filter.name.replace(/([A-Z])/g, ' $1').trim()}
                </Typography>
                {filterTableData.rows[0][filter.key]}
              </div>
            ))}
          </div>
        </Card>
      )}

      <SoftBox my={2}>
        <Card style={{borderRadius: "0px"}}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={1}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                All Surveys
              </SoftTypography>             
            </SoftBox>
            <Stack spacing={1} direction="row">
              {hasPermission("viewprojects.import") && (
                <SoftButton 
                  variant="outlined" 
                  color="info" 
                  size="small" 
                  onClick={handleOpenModal}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <CircularProgress size={20} color="info" sx={{ mr: 1 }} />
                      Importing...
                    </>
                  ) : "Import"}
                </SoftButton>
              )}
              {hasPermission("viewprojects.export") && (
                <SoftButton 
                  variant="outlined" 
                  color="info" 
                  size="small" 
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <CircularProgress size={20} color="info" sx={{ mr: 1 }} />
                      Exporting...
                  </>
                  ) : "Export"}
                </SoftButton>
              )}
              {hasPermission("viewprojects.search") && (
                <SoftInput 
                  value={searchQuery} 
                  onChange={handleSearchChange}  
                  placeholder="Type here..." 
                />
              )}
            </Stack>
          </SoftBox>    

          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={1} style={{ width: "100%", fontSize: "16px" }}>
            <SoftBox fontWeight="small" style={{ width: "100%"}}>
              <span style={{color: "rgb(23, 193, 232)"}}>Showing</span> {fromData} to {toData} of {totalSurveys} <span style={{color: "rgb(23, 193, 232)"}}>entries</span>
            </SoftBox>

            <SoftBox display="flex" justifyContent="end" alignItems="center" p={1} style={{ width: "100%", fontSize: "16px" }}>
              <SoftPagination item onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                <Icon sx={{ fontWeight: "bold" }}>first_page</Icon>
              </SoftPagination>

              <SoftPagination item onClick={handlePreviousPage} disabled={currentPage === 1}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </SoftPagination>
              
              <span style={{ margin: "0 5px", width: "120px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>   
                <span width="5rem" mx={1}>
                  <SoftInput
                    inputProps={{ type: "number", min: 1, max: totalPages }}
                    value={currentPage}
                    onChange={handleInputChange}
                  />
                </span>
                /
                <span>{totalPages}</span>
              </span>

              <SoftPagination item onClick={handleNextPage} disabled={currentPage === totalPages}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </SoftPagination>

              <SoftPagination item onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                <Icon sx={{ fontWeight: "bold" }}>last_page</Icon>
              </SoftPagination>
            </SoftBox>
          </SoftBox>

          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
              <CircularProgress color="info" size={60}/>
             <SoftTypography variant="h6" color="text" ml={2}>
                Loading surveys...
              </SoftTypography>
            </SoftBox>
          ) : projects.length > 0 ? (
            <Table columns={dataTableData.columns} rows={dataTableData.rows} />
          ) : (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
              <SoftTypography variant="h6" color="textSecondary">
                No surveys found
              </SoftTypography>
            </SoftBox>
          )}
        </Card>
      </SoftBox>

      <Footer />

      {/* Improved Modal for file upload */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <SoftTypography variant="h5" fontWeight="bold">
            Upload Survey File
          </SoftTypography>
          <SoftTypography variant="caption" color="text">
            Supported formats: .xlsx, .csv
          </SoftTypography>
        </DialogTitle>
        
        <DialogContent dividers>
          <SoftBox 
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "rgba(23, 193, 232, 0.04)"
              }
            }}
            onClick={() => document.getElementById("file-upload-input").click()}
          >
            <input
              id="file-upload-input"
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.csv"
              style={{ display: "none" }}
            />
            
            <Icon fontSize="large" color="primary">cloud_upload</Icon>
            <SoftTypography variant="h6" mt={1}>
              Click to select file or drag & drop
            </SoftTypography>
            <SoftTypography variant="caption" color="textSecondary">
              Max file size: 10MB
            </SoftTypography>
          </SoftBox>
          
          <SoftBox mt={2} textAlign="center">
            <SoftButton 
              variant="text" 
              color="info" 
              size="small"
              onClick={handleDownloadSample}
              startIcon={<Icon>download</Icon>}
            >
              Download Sample Format
            </SoftButton>
          </SoftBox>
        </DialogContent>
        
        <DialogActions>
          <SoftButton onClick={handleCloseModal} color="secondary">
            Cancel
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ProductsList;