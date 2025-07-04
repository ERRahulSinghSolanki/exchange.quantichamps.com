import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, Select, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, Typography,IconButton, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import SoftBox from "components/SoftBox";
import SearchableSelect from "components/SearchableSelect";
import CountryCodes from "components/CountryCodes";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";

import { API_URL,shouldHideInfo } from "config";

const StudiesList = () => {
   const { id } = useParams();
  
    const [studies, setStudies] = useState([]);
    const [users, setUsers] = useState([{ value: 1, label: "Admin" },{ value: 2, label: "Vendor" }]);
    const [userId, setUserId] = useState([]);
    const [totalRevenue,setTotalRevenue] = useState(0);
    const [totalCompletes,setTotalCompletes] = useState(0);
    const [status, setStatus] = useState([]);
    const [filterSurvey, setFilterSurvey] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true); // For initial page load
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [message, setMessage] = useState(null);
    const[surveys, setSurveys] = useState([]);
    const [show, setShow] = useState(false);
    const toggleSnackbar = () => setShow(!show);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalStudies, setTotalStudies] = useState(0);
    const [fromData, setFromData] = useState(0);
    const [toData, setToData] = useState(0);
    const [client_survey_id, setClient_survey_id] = useState([]);
    const [client_project_id, setClient_project_id] = useState([]);
    const [survey_name, setSurvey_name] = useState([]);
    const [survey_names, setSurvey_names] = useState([]);
    const [qsidArray, setQsidArray] = useState([]);
    const [qsid, setQsid] = useState([]);
    const [qsidNameChange, setQsidNameChange] = useState([]);
    const [clients, setClients] = useState([]);
    const [clientSubAccounts, setClientSubAccounts] = useState([]);
    const [selectedClientSubAccounts, setSelectedClientSubAccounts] = useState([]);
    const [selectedClient, setSelectedClient] = useState([]);
    const [exportLoading, setExportLoading] = useState(false); // For Excel export loading state

    const token = localStorage.getItem("authToken");
  
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

    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };
    
    const handlePreviousPage = () => {
      if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    const fetchStudies = async (currentPage, searchQuery, userId,selectedCountryCode, status, fromDate, toDate, client_survey_id, client_project_id, survey_name,filterSurvey,qsid,selectedClient, selectedClientSubAccounts,qsidNameChange) => {
      setLoading(true);
      try {
        let queryString = `per_page=20&page=${currentPage}&q=${searchQuery}`;

        if (qsidNameChange) {
            queryString += `&q=${qsidNameChange}`;
        }

        if (id && id !== "null" && id !== "undefined" && isNaN(id) === false) {
          queryString += `&survey_id=${id}`;
        }

        if (userId.length > 0) {
          userId.forEach(id => {
            queryString += `&user_id[]=${id}`;
          });
        }
        if (selectedCountryCode.length > 0) {
          selectedCountryCode.forEach(country => {
            queryString += `&location[]=${country}`;
          });
        }

        if (client_survey_id.length > 0) {
          client_survey_id.forEach(csi => {
            queryString += `&survey_id[]=${csi}`;
          });
        }
        if (client_project_id.length > 0) {
          client_project_id.forEach(cpi => {
            queryString += `&survey_id[]=${cpi}`;
          });
        }
        if (survey_name.length > 0) {
          survey_name.forEach(sn => {
            queryString += `&survey_id[]=${sn}`;
          });
        }
        if (filterSurvey.length > 0) {
          filterSurvey.forEach(sn => {
            queryString += `&survey_id[]=${sn}`;
          });
        }
        if (qsid.length > 0) {
          qsid.forEach(sn => {
            queryString += `&qsid[]=${sn}`;
          });
        }

        if (selectedClient) {
          queryString += `&client_id=${selectedClient}`;
        }
        if (selectedClientSubAccounts.length > 0) {
          selectedClientSubAccounts.forEach(subAccount => {
            queryString += `&client_sub_account[]=${subAccount}`;
          });
        }

        if (fromDate) queryString += `&start_date=${fromDate}`;
        if (toDate) queryString += `&end_date=${toDate}`;
    
        if (status.length > 0) {
          status.forEach(s => {
            queryString += `&status[]=${s}`;
          });
        }
        const response = await fetch(`${API_URL}/studies?${queryString}`, {
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

        const qsidArray = data.studies.data.map((study) => ({
          value: study.qsid,
          label: study.qsid
        }));

        const uniqueSurveysMap = new Map();
        const uniqueSurveyNamesMap = new Map();
        
        data.studies.data.forEach((study) => {
          const surveyId = study.survey.id;
          const surveyLabel = study.survey.client_project_id ?? study.survey.client_survey_id;
          const surveyName = study.survey.name;
        
          if (!uniqueSurveysMap.has(surveyId)) {
            uniqueSurveysMap.set(surveyId, { value: surveyId, label: surveyLabel });
          }
        
          if (!uniqueSurveyNamesMap.has(surveyId)) {
            uniqueSurveyNamesMap.set(surveyId, { value: surveyId, label: surveyName });
          }
        });
        
        const surveys = Array.from(uniqueSurveysMap.values());
        const surveys_names = Array.from(uniqueSurveyNamesMap.values());

        setSurveys(surveys);
        setSurvey_names(surveys_names);

        setQsidArray(qsidArray);
        setStudies(data.studies.data);
        setTotalPages(data.studies.last_page);

        setFromData(data.studies.from);
        setToData(data.studies.to);
        setTotalStudies(data.studies.total);

        setTotalCompletes(data.totalCompletes);
        setTotalRevenue(data.totalRevenue);
      } catch (err) {
        setMessage(err.message);
        setShow(true);
      } finally { 
        setLoading(false);
        setPageLoading(false);
      }
    };

    useEffect(() => {
      fetchStudies(currentPage, searchQuery, userId, selectedCountryCode,status, fromDate, toDate, client_survey_id, client_project_id, survey_name,filterSurvey, qsid,selectedClient, selectedClientSubAccounts,qsidNameChange);
    }, [currentPage, searchQuery, userId,selectedCountryCode, status, fromDate, toDate, client_project_id, client_survey_id, survey_name,filterSurvey, qsid,selectedClient, selectedClientSubAccounts,qsidNameChange]);

    const statuses = [
      {value: "0", label: "Initiate"},
      {value: "1", label: "Completed"},
      {value: "2", label: "Terminate"},
      {value: "3", label: "Quota Full"},
      {value: "4", label: "S.Terminate"},
      {value: "5", label: "Q.Terminate"}
    ]

    const countryCodes = CountryCodes().map((code) => ({
      value: code,
      label: code,
    }));

    const fetchSurveys = async (selectedFields = ['id', 'name'], inputValue = null) => {
      try {
        let queryParams = new URLSearchParams();
        queryParams.append("per_page", 20);
        queryParams.append("fields", selectedFields.join(','));
  
        if (inputValue) queryParams.append("q", inputValue);
    
        const response = await fetch(`${API_URL}/surveys?${queryParams.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        const data = await response.json();

        if (data.success === 1) {
          const surveys = data.surveys.data.map((survey) => ({
            value: survey.id,
            label: survey.client_project_id ?? survey.client_survey_id,
          }));
          const surveys_names = data.surveys.data.map((survey) => ({
            value: survey.id,
            label: survey.name
          }));
          setSurveys(surveys);
          setSurvey_names(surveys_names);
        } else {
          console.error("Failed to fetch clients:", data.message);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
  
    const getStatusLabel = (value) => {
      const statusObj = statuses.find(status => status.value === String(value));
      return statusObj ? statusObj.label : "Unknown";
    };

    const handleUsersChange = (selectedUsers) => {
      setCurrentPage(1);
      const values = selectedUsers ? selectedUsers.map(option => option.value) : [];
      setUserId(values);
    };
    
    const handleSurveyChange = (filterSurvey) => {
      setCurrentPage(1);
      const value = filterSurvey ? filterSurvey.map(option => option.value) : []; 
      setFilterSurvey(value);
    };

    const handleSurveyInputChange = (inputValue) => {
      if (inputValue.length > 5) {
        fetchSurveys(['client_survey_id', 'client_project_id', 'name'], inputValue);
      }
    }

    const handleSurveyNameChange = (client_survey_id) => {
      setCurrentPage(1);
      const value = client_survey_id ? client_survey_id.map(option => option.value) : []; 
      setClient_survey_id(value);
    };

    const handleSurveyNameInputChange = (inputValue) => {
      if (inputValue.length > 5) {
        fetchSurveys(['client_survey_id','client_project_id', 'name'],inputValue); 
      }
    }

    const handleQsidChange = (qsid) => {
      setCurrentPage(1);
      const value = qsid ? qsid.map(option => option.value) : []; 
      setQsid(value);
    };

    const handleQsidInputChange = (qsidNameChange) => {
      if (qsidNameChange.length >= 5) {
        setCurrentPage(1);
        setQsidNameChange(qsidNameChange);
      } else if (qsidNameChange.length === 0) {
        setQsidNameChange("");
      }
    };

    const handleStatusChange = (selectedStatus) => {
      setCurrentPage(1);
      const value = selectedStatus ? selectedStatus.map(option => option.value) : []; 
      setStatus(value);
    };

    const handleCountryChange = (selectedCountryCode) => {
      setCurrentPage(1);
      const values = selectedCountryCode ? selectedCountryCode.map(option => option.value) : [];
      setSelectedCountryCode(values);
    };

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
      fetchClients(); 
    }, []);

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users?per_page=250`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success === 1) {
          const userOptions = data.users.data.map((user) => ({
            value: user.id,
            label: user.name,
          }));
          setUsers(userOptions);      
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    useEffect(() => {
      fetchUsers(); 
    }, []);

    const handleClientChange = (selectedClient) => {
      setCurrentPage(1);
      const selectedClientId = selectedClient ? selectedClient.value : null;
      setSelectedClient(selectedClientId);
      if (selectedClientId) {
        fetchClientSubAccounts(selectedClientId);
      } else {
        setClientSubAccounts([]);
      }
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
      setCurrentPage(1);
      const values = selectedClientSubAccounts ? selectedClientSubAccounts.map(option => option.value) : [];
      setSelectedClientSubAccounts(values);
    };

   const filters = {
  columns: [
    ...(!shouldHideInfo
      ? [{ name: "Users", key: "users", align: "left" }]
      : []),
    { name: "Client Survey ID", key: "surveys", align: "left" },
    { name: "Quantish ID", key: "quantish_id", align: "left" },
    { name: "Country", key: "countries", align: "left" },
    { name: "Status", key: "status", align: "left" },
  ],
  rows: [
    {
      ...(shouldHideInfo
        ? {}
        : {
            users: (
              <SearchableSelect
                className="basic-multi-select"
                classNamePrefix="select"
                name="user_id"
                options={users}
                isMulti={true}
                fontSize={"10px"}
                onChange={handleUsersChange}
              />
            ),
          }),
      surveys: (
        <SearchableSelect
          className="basic-multi-select"
          classNamePrefix="select"
          name="survey_id"
          options={surveys}
          isMulti={true}
          fontSize={"10px"}
          onChange={handleSurveyChange}
          onInputChange={handleSurveyInputChange}
        />
      ),
      quantish_id: (
        <SearchableSelect
          className="basic-multi-select"
          classNamePrefix="select"
          name="quantish_id"
          options={survey_names}
          isMulti={true}
          fontSize={"10px"}
          onChange={handleSurveyNameChange}
          onBlur={handleSurveyNameInputChange}
        />
      ),
      countries: (
        <SearchableSelect
          className="basic-multi-select"
          classNamePrefix="select"
          name="country"
          options={countryCodes}
          isMulti={true}
          fontSize={"12px"}
          onChange={handleCountryChange}
        />
      ),
      status: (
        <SearchableSelect
          className="basic-select"
          classNamePrefix="select"
          name="status"
          options={statuses}
          isMulti={true}
          fontSize={"10px"}
          onChange={handleStatusChange}
        />
      ),
    },
  ],
};


    const exportData = async ({ searchQuery, userId,selectedCountryCode, status, fromDate, toDate, client_survey_id, client_project_id, survey_name,filterSurvey,qsid,selectedClient, selectedClientSubAccounts,qsidNameChange }) => {
      setExportLoading(true);
      try {
        let queryParams = [];
       
        if (selectedClient) queryParams.push(`client_id=${selectedClient}`);
        
        if (Array.isArray(userId) && userId.length > 0) {
          userId.forEach(user => {
              queryParams.push(`user_id[]=${user}`);
          });
        }

        if (selectedCountryCode.length > 0) {
          selectedCountryCode.forEach(country => {
            queryParams.push(`country_code[]=${country}`);
          });
        }
        if (selectedClientSubAccounts.length > 0) {
          selectedClientSubAccounts.forEach(subAccount => {
            queryParams.push(`client_sub_account[]=${subAccount}`);
          });
        }
  
        if (status.length > 0) {
          status.forEach(s => {
            queryParams.push(`status[]=${s}`);
          });
        }

        if (client_survey_id.length > 0) {
          client_survey_id.forEach(csi => {
           queryParams.push(`&survey_id[]=${csi}`);
          });
        }
        if (client_project_id.length > 0) {
          client_project_id.forEach(cpi => {
            queryParams.push(`&survey_id[]=${cpi}`);
          });
        }
        if (survey_name.length > 0) {
          survey_name.forEach(sn => {
            queryParams.push(`&survey_id[]=${sn}`);
          });
        }
  
        if (filterSurvey.length > 0) {
          filterSurvey.forEach(sn => {
            queryParams.push(`&survey_id[]=${sn}`);
          });
        }
        if (qsid.length > 0) {
          qsid.forEach(sn => {
            queryParams.push(`&qsid[]=${sn}`);
          });
        }

        if (fromDate)  queryParams.push(`start_date=${fromDate}`);
        if (toDate) queryParams.push(`end_date=${toDate}`);
        
        if (qsidNameChange) queryParams.push(`q=${qsidNameChange}`);
        if (searchQuery) queryParams.push(`q=${searchQuery}`);
    
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
        const response = await fetch(`${API_URL}/studies/export${queryString}`, {
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
        const contentDisposition = response.headers.get('Content-Disposition');
        const match = contentDisposition?.match(/filename="(.+)"/);
        const now = new Date();
  
        const formattedDate = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0') + '_' + 
        String(now.getHours()).padStart(2, '0') + '-' + 
        String(now.getMinutes()).padStart(2, '0') + '-' + 
        String(now.getSeconds()).padStart(2, '0'); 
  
        const filename = `quantish_studies_${formattedDate}.xlsx`;
  
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
        setExportLoading(false);
      }
    };
    
    const handleDownload = () => {
      exportData({currentPage, searchQuery, userId,selectedCountryCode, status, fromDate, toDate, client_survey_id, client_project_id, survey_name,filterSurvey,qsid,selectedClient, selectedClientSubAccounts,qsidNameChange});
    };

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
        <SoftSnackbar color="primary" icon="notifications" title="Soft UI Dashboard" dateTime="" content={message ?? ''} open={show} close={toggleSnackbar}/>

        <div style={{ display: "flex", gap: "10px" }}>
          <Card style={{ flex: 1, borderRadius: "0px", padding: "10px" }}>
            <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
              {filters.columns.map((filter) => (
                <div key={filter.name} style={{ flex: 1 }}>
                  <Typography variant="body2" gutterBottom style={{ fontSize: "12px" }}>
                    {filter.name.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  {filters.rows[0][filter.key]}
                </div>
              ))}
            </div>
            
            <div style={{ overflowX: "auto" }}>
              {loading ? (
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress size={50} />
                </SoftBox>
              ) : (
                <>
                  <SoftBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    style={{ width: "100%", fontSize: "13px" }}
                  >
                    <SoftBox fontWeight="small" style={{ width: "100%" }}>
                      Showing {fromData} to {toData} of {totalStudies} entries
                    </SoftBox>

                    <SoftBox display="flex" justifyContent="end" alignItems="center" p={1} style={{ width: "100%" }}>
                      <SoftPagination item onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                        <Icon sx={{ fontWeight: "bold" }}>first_page</Icon>
                      </SoftPagination>

                      <SoftPagination item onClick={handlePreviousPage} disabled={currentPage === 1}>
                        <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                      </SoftPagination>

                      <span
                        style={{
                          margin: "0 5px",
                          width: "120px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span width="5rem" mx={1} style={{ fontSize: "9px" }}>
                          <SoftInput
                            inputProps={{ type: "number", min: 1, max: totalPages }}
                            value={currentPage}
                            onChange={handleInputChange}
                          />
                        </span>
                        /<span>{totalPages}</span>
                      </span>

                      <SoftPagination item onClick={handleNextPage} disabled={currentPage === totalPages}>
                        <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                      </SoftPagination>

                      <SoftPagination item onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                        <Icon sx={{ fontWeight: "bold" }}>last_page</Icon>
                      </SoftPagination>
                    </SoftBox>
                  </SoftBox>

                  <SoftBox style={{ width: "100%", fontSize: "13px" }}>
                    {!shouldHideInfo && (
                      <>
                        <span style={{ color: "rgb(23, 193, 232)" }}>Revenue:</span> {totalRevenue} |{" "}
                        <span style={{ color: "rgb(23, 193, 232)" }}>Completes:</span> {totalCompletes}
                      </>
                    )}
                  </SoftBox>

                  <Table style={{ width: "100%" }}>
                    <TableHead style={{ padding: "0px",display: "contents" }}>
                    <TableRow style={{ backgroundColor: "#5c91c5", color: "#fff", width: "100%" }}>
                    {["Client Survey ID","Client Project ID","Quantish ID","User",...(!shouldHideInfo ? ["Client"] : []), "Respondent ID",...(!shouldHideInfo ? ["Survey CPI"] : []), "LOI", "Status", "Supplier ID",  "Location", "IP Address", "Start Date", "End Date", ].map((header) => (
                      <TableCell key={header} style={{ color: "#fff", fontSize: "8.5px", textAlign: "center" }}>
                        {header}
                      </TableCell>
                    ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {studies.map((study, rowIndex) => {
                      const client = clients.find(c => c.value === study.survey.client_id);

                      return (
                        <TableRow key={rowIndex}>                    
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.survey.client_survey_id}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.survey.client_project_id}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.survey.name}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                          {study.user.name}
                          </TableCell>

                          {!shouldHideInfo && (
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                          {client ? `${client.label} | ${study.survey.client_sub_account}` : "Unknown"}
                          </TableCell>)}
                        
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.qsid}
                          </TableCell>
                          {!shouldHideInfo && (
                            <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                              {study.survey.cpi}
                            </TableCell>
                          )}
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.loi}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {getStatusLabel(study.status)}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.supplier_id}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.location}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {study.ip_address}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {new Date(study.created_at).toLocaleString("en-GB").replace(",", "").replace(/\//g, "-")}
                          </TableCell>
                          <TableCell style={{ fontSize: "9px", textAlign: "center" }}>
                            {new Date(study.updated_at).toLocaleString("en-GB").replace(",", "").replace(/\//g, "-")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  </Table>
                </>
              )}
            </div>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
            <Card style={{ padding: "5px", width: "200px",height: "100%", borderRadius: "0px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="p" style={{ fontSize: "12px" }}>Count of SessionId</Typography>
                  <IconButton 
                    color="primary" 
                    onClick={handleDownload}
                    disabled={exportLoading}
                  >
                    {exportLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <DownloadIcon />
                    )}
                  </IconButton>
                </div>

                <Typography variant="h4" color="primary" style={{ fontSize: "20px",textAlign:"center" }}>
                  {totalStudies}
                </Typography>
              </div>
              
              <div>
                <Typography variant="p" style={{ fontSize: "12px"}}>Start Date</Typography>
                <SoftInput type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>

              <div>
                <Typography variant="p" style={{ fontSize: "12px"}}>End Date</Typography>
                <SoftInput type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>

              <div>
                <Typography variant="p" style={{ fontSize: "12px"}}>Type here</Typography>
                <SoftInput type="text" value={searchQuery} placeholder="Type here" onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              <div>
                <Typography variant="p" style={{ fontSize: "12px" }}>Respondent ID</Typography>
                <SearchableSelect
                  className="basic-select"
                  classNamePrefix="select"
                  name="status"
                  options={qsidArray}
                  isMulti={true}
                  fontSize={"10px"}
                  onChange={handleQsidChange}
                  onInputChange={handleQsidInputChange}
                />
              </div>
              {!shouldHideInfo && (
                <>
                  <div style={{ marginTop: "12px" }}>
                    <Typography variant="p" style={{ fontSize: "12px" }}>Clients</Typography>
                    <SearchableSelect
                      className="basic-select"
                      classNamePrefix="select"
                      name="client"
                      options={clients}
                      isMulti={false}
                      fontSize={"10px"}
                      onChange={handleClientChange}
                    />
                  </div>

                  <div style={{ marginTop: "12px" }}>
                    <Typography variant="p" style={{ fontSize: "12px" }}>Clients Accounts Name</Typography>
                    <SearchableSelect
                      className="basic-multi-select"
                      classNamePrefix="select"
                      name="subClients"
                      options={clientSubAccounts}
                      isMulti={true}
                      fontSize={"10px"}
                      onChange={handleClientSubAccountsChange}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
};

export default StudiesList;