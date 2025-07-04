import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { Card, Table, TableHead, TableBody, TableRow, TableCell, Typography, IconButton, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SearchableSelect from "components/SearchableSelect";
import CountryCodes from "components/CountryCodes";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import SoftPagination from "components/SoftPagination";
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";
import { API_URL } from "config";
import { useAuth } from "../../../AuthContext"; 

const StudiesList = () => {
  /* ---------- PERMISSION SETUP ---------- */const { permissions: ctxPerms = [], isAuthReady } = useAuth();
const storedPerms = useMemo(() => {
  try { 
    return JSON.parse(localStorage.getItem("permissions") || "[]"); 
  } catch { 
    return (localStorage.getItem("permissions") || "").split(",").filter(Boolean); 
  }
}, []);

const permSet = useMemo(() => {
  const permissions = ctxPerms.length ? ctxPerms : storedPerms;
  return new Set(
    permissions.map(p => typeof p === "string" ? p : p.name)
  );
}, [ctxPerms, storedPerms]);

// Permission check functions
const userHas = useCallback(
  (colKey) => permSet.has(`viewstudies.${colKey}`),
  [permSet]
);

const userCanSearch = useCallback(
  (fieldKey) => permSet.has(`searchstudies.${fieldKey}`),
  [permSet]
);

const userCanExport = useCallback(
  () => permSet.has("exportstudies"),
  [permSet]
);

  /* ---------- STATE VARIABLES ---------- */
  const { id } = useParams();
  const [studies, setStudies] = useState([]);
  const [users, setUsers] = useState([{ value: 1, label: "Admin" }, { value: 2, label: "Vendor" }]);
  const [userId, setUserId] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCompletes, setTotalCompletes] = useState(0);
  const [status, setStatus] = useState([]);
  const [filterSurvey, setFilterSurvey] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [show, setShow] = useState(false);
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
  const [exportLoading, setExportLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  /* ---------- COLUMN DEFINITIONS WITH PERMISSIONS ---------- */
  const columnDefs = [
    { key: "client_survey_id", label: "Client Survey ID" },
    { key: "client_project_id", label: "Client Project ID" },
    { key: "survey_name", label: "Survey Name" },
    { key: "user", label: "User" },
    { key: "client", label: "Client" },
    { key: "respondent_id", label: "Respondent ID" },
    { key: "survey_cpi", label: "Survey CPI" },
    { key: "loi", label: "LOI" },
    { key: "status", label: "Status" },
    { key: "supplier_id", label: "Supplier ID" },
    { key: "location", label: "Location" },
    { key: "ip_address", label: "IP Address" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" }
  ];

  const visibleColumns = useMemo(
    () => columnDefs.filter((c) => userHas(c.key)),
    [columnDefs, userHas]
  );

  /* ---------- FILTER OPTIONS ---------- */
  const statuses = [
    { value: "0", label: "Initiate" },
    { value: "1", label: "Completed" },
    { value: "2", label: "Terminate" },
    { value: "3", label: "Quota Full" },
    { value: "4", label: "S.Terminate" },
    { value: "5", label: "Q.Terminate" }
  ];

  const countryCodes = CountryCodes().map((code) => ({
    value: code,
    label: code,
  }));

  /* ---------- HANDLER FUNCTIONS ---------- */
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

  const toggleSnackbar = () => setShow(!show);

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
  };

  const handleSurveyNameChange = (client_survey_id) => {
    setCurrentPage(1);
    const value = client_survey_id ? client_survey_id.map(option => option.value) : [];
    setClient_survey_id(value);
  };

  const handleSurveyNameInputChange = (inputValue) => {
    if (inputValue.length > 5) {
      fetchSurveys(['client_survey_id', 'client_project_id', 'name'], inputValue);
    }
  };

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

  const handleClientSubAccountsChange = (selectedClientSubAccounts) => {
    setCurrentPage(1);
    const values = selectedClientSubAccounts ? selectedClientSubAccounts.map(option => option.value) : [];
    setSelectedClientSubAccounts(values);
  };

  /* ---------- API FUNCTIONS ---------- */
  const fetchStudies = async () => {
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
        console.error("Failed to fetch surveys:", data.message);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
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
        console.error("Failed to fetch client subaccounts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching client subaccounts:", error);
    }
  };

  const exportData = async () => {
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
          queryParams.push(`survey_id[]=${csi}`);
        });
      }

      if (client_project_id.length > 0) {
        client_project_id.forEach(cpi => {
          queryParams.push(`survey_id[]=${cpi}`);
        });
      }

      if (survey_name.length > 0) {
        survey_name.forEach(sn => {
          queryParams.push(`survey_id[]=${sn}`);
        });
      }

      if (filterSurvey.length > 0) {
        filterSurvey.forEach(sn => {
          queryParams.push(`survey_id[]=${sn}`);
        });
      }

      if (qsid.length > 0) {
        qsid.forEach(sn => {
          queryParams.push(`qsid[]=${sn}`);
        });
      }

      if (fromDate) queryParams.push(`start_date=${fromDate}`);
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
    exportData();
  };

  /* ---------- EFFECT HOOKS ---------- */
  useEffect(() => {
    fetchStudies();
  }, [currentPage, searchQuery, userId, selectedCountryCode, status, fromDate, toDate, 
      client_survey_id, client_project_id, survey_name, filterSurvey, qsid, 
      selectedClient, selectedClientSubAccounts, qsidNameChange]);

  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  /* ---------- FILTERS CONFIGURATION ---------- */
  const filters = {
    columns: [
      userCanSearch("users") && { name: "Users", key: "users", align: "left" },
      userCanSearch("client_survey_id") && { name: "Client Survey ID", key: "surveys", align: "left" },
      userCanSearch("quantish_id") && { name: "Quantish ID", key: "quantish_id", align: "left" },
      userCanSearch("countries") && { name: "Country", key: "countries", align: "left" },
      userCanSearch("status") && { name: "Status", key: "status", align: "left" }
    ].filter(Boolean),
    rows: [{
      ...(userCanSearch("users") ? {
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
        )
      } : {}),
      ...(userCanSearch("client_survey_id") ? {
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
        )
      } : {}),
      ...(userCanSearch("quantish_id") ? {
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
        )
      } : {}),
      ...(userCanSearch("countries") ? {
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
        )
      } : {}),
      ...(userCanSearch("status") ? {
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
        )
      } : {})
    }]
  };

  /* ---------- RENDER SECTION ---------- */
  if (pageLoading || !isAuthReady) {
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
      <SoftSnackbar
        color="primary"
        icon="notifications"
        title="Soft UI Dashboard"
        content={message ?? ''}
        open={show}
        close={toggleSnackbar}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        {/* Main Content Card */}
        <Card style={{ flex: 1, borderRadius: "0px", padding: "10px" }}>
          {/* Search Filters Row */}
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
            {filters.columns.map((filter) => (
              <div key={filter.name} style={{ flex: 1 }}>
                <Typography variant="body2" gutterBottom style={{ fontSize: "12px" }}>
                  {filter.name}
                </Typography>
                {filters.rows[0][filter.key]}
              </div>
            ))}
          </div>

          {/* Studies Table */}
          <div style={{ overflowX: "auto" }}>
            {loading ? (
              <SoftBox display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress size={50} />
              </SoftBox>
            ) : (
              <>
                {/* Pagination Controls */}
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

                {/* Revenue Info (with permission check) */}
                {userHas("revenue_info") && (
                  <SoftBox style={{ width: "100%", fontSize: "13px" }}>
                    <span style={{ color: "rgb(23, 193, 232)" }}>Revenue:</span> {totalRevenue} |{" "}
                    <span style={{ color: "rgb(23, 193, 232)" }}>Completes:</span> {totalCompletes}
                  </SoftBox>
                )}

                {/* Studies Table */}
                <Table style={{ width: "100%" }}>
                  <TableHead style={{ padding: "0px", display: "contents" }}>
                    <TableRow style={{ backgroundColor: "#5c91c5", color: "#fff", width: "100%" }}>
                      {visibleColumns.map((column) => (
                        <TableCell key={column.key} style={{ color: "#fff", fontSize: "8.5px", textAlign: "center" }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studies.map((study, rowIndex) => {
                      const client = clients.find(c => c.value === study.survey.client_id);
                      return (
                        <TableRow key={rowIndex}>
                          {visibleColumns.map((column) => {
                            let content;
                            switch (column.key) {
                              case "client_survey_id":
                                content = study.survey.client_survey_id;
                                break;
                              case "client_project_id":
                                content = study.survey.client_project_id;
                                break;
                              case "survey_name":
                                content = study.survey.name;
                                break;
                              case "user":
                                content = study.user.name;
                                break;
                              case "client":
                                content = client ? `${client.label} | ${study.survey.client_sub_account}` : "Unknown";
                                break;
                              case "respondent_id":
                                content = study.qsid;
                                break;
                              case "survey_cpi":
                                content = study.survey.cpi;
                                break;
                              case "loi":
                                content = study.loi;
                                break;
                              case "status":
                                content = getStatusLabel(study.status);
                                break;
                              case "supplier_id":
                                content = study.supplier_id;
                                break;
                              case "location":
                                content = study.location;
                                break;
                              case "ip_address":
                                content = study.ip_address;
                                break;
                              case "start_date":
                                content = new Date(study.created_at).toLocaleString("en-GB").replace(",", "").replace(/\//g, "-");
                                break;
                              case "end_date":
                                content = new Date(study.updated_at).toLocaleString("en-GB").replace(",", "").replace(/\//g, "-");
                                break;
                              default:
                                content = "";
                            }
                            return (
                              <TableCell key={column.key} style={{ fontSize: "9px", textAlign: "center" }}>
                                {content}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </Card>

        {/* Sidebar Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
          <Card style={{ padding: "5px", width: "200px", height: "100%", borderRadius: "0px" }}>
            {/* Export Button with Permission Check */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="p" style={{ fontSize: "12px" }}>Count of SessionId</Typography>
                {userCanExport() && (
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
                )}
              </div>
              <Typography variant="h4" color="primary" style={{ fontSize: "20px", textAlign: "center" }}>
                {totalStudies}
              </Typography>
            </div>

            {/* Date Range Filters with Permission Check */}
            {userCanSearch("date_range") && (
              <>
                <div>
                  <Typography variant="p" style={{ fontSize: "12px" }}>Start Date</Typography>
                  <SoftInput type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div>
                  <Typography variant="p" style={{ fontSize: "12px" }}>End Date</Typography>
                  <SoftInput type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </>
            )}

            {/* General Search with Permission Check */}
            {userCanSearch("general_search") && (
              <div>
                <Typography variant="p" style={{ fontSize: "12px" }}>Type here</Typography>
                <SoftInput type="text" value={searchQuery} placeholder="Type here" onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            )}

            {/* Respondent ID Filter with Permission Check */}
            {userCanSearch("respondent_id") && (
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
            )}

            {/* Client Filters with Permission Check */}
            {userCanSearch("clients") && (
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