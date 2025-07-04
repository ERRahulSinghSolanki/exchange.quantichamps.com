/* eslint-disable */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

// @mui material
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Typography } from "@mui/material";

// soft‑ui components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftPagination from "components/SoftPagination";
import SoftInput from "components/SoftInput";
import SoftSnackbar from "components/SoftSnackbar";
import SearchableSelect from "components/SearchableSelect";
import CountryCodes from "components/CountryCodes";

// layout & table components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import ProjectCell from "layouts/projects/projects-list/components/ProjectCell";
import ClientCell from "layouts/projects/projects-list/components/ClientCell";
import InfoCell from "layouts/projects/projects-list/components/InfoCell";
import ActionCell from "layouts/projects/projects-list/components/ActionCell";
import LinkCell from "layouts/projects/projects-list/components/LinkCell";
import CompleteCell from "layouts/projects/projects-list/components/CompleteCell";

import { API_URL, shouldHideInfo } from "config";
import sampleCsv from "assets/files/Survey-Import-Format.xlsx";
import { useAuth } from "../../../AuthContext";          // 🔐 permissions

const PERMISSION_PREFIX = "viewprojects.";                // ⭐ prefix

function ProductsList() {
  /* ------------------------------------------------------------------ */
  /*                              state                                 */
  /* ------------------------------------------------------------------ */
  const { permissions: authPermissions = [] } = useAuth();

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
  const toggleSnackbar = () => setShow(!show);

  /* ------------------------------------------------------------------ */
  /*                         fetch / utilities                          */
  /* ------------------------------------------------------------------ */

  // ... (सारी fetch logic और दूसरे हैंडलर जस‑की‑तस, मैंने नहीं बदली) ...

  /* ------------------------------------------------------------------ */
  /*                     Column definitions (with permission)           */
  /* ------------------------------------------------------------------ */
  const baseProjectColumns = useMemo(() => {
    const cols = [
      { name: "quantish_code", align: "center", permission: `${PERMISSION_PREFIX}quantish_code` },
      { name: "survey_id",     align: "left",   permission: `${PERMISSION_PREFIX}survey_id` },
      ...(
        !shouldHideInfo
          ? [{ name: "account_name", align: "left", permission: `${PERMISSION_PREFIX}account_name` }]
          : []
      ),
      { name: "country",        align: "left",   permission: `${PERMISSION_PREFIX}country` },
      { name: "completes_cpi",  align: "center", permission: `${PERMISSION_PREFIX}completes_cpi` },
      { name: "link",           align: "center", permission: `${PERMISSION_PREFIX}link` },
      { name: "created",        align: "center", permission: `${PERMISSION_PREFIX}created` },
      { name: "date",           align: "center", permission: `${PERMISSION_PREFIX}date` },
      { name: "action",         align: "center", permission: `${PERMISSION_PREFIX}action` },
    ];
    return cols;
  }, []);

  const allowedProjectColumns = useMemo(() => (
    authPermissions.length === 0
      ? baseProjectColumns
      : baseProjectColumns.filter(c => authPermissions.includes(c.permission))
  ), [baseProjectColumns, authPermissions]);

  /* ---------------- filter table column perms (filters panel) -------- */
  const baseFilterColumns = [
    { name: "Country Codes",        key:"country",     align:"left", permission:`${PERMISSION_PREFIX}filter_country` },
    ...(!shouldHideInfo ? [{ name:"Clients",          key:"client",      align:"left", permission:`${PERMISSION_PREFIX}filter_clients`}]:[]),
    ...(!shouldHideInfo ? [{ name:"Clients Accounts Name", key:"subClients", align:"left", permission:`${PERMISSION_PREFIX}filter_subclients`}]:[]),
    { name:"Status",                key:"status",      align:"left", permission:`${PERMISSION_PREFIX}filter_status` },
    { name:"Date Filter By Column", key:"dateFilter",  align:"left", permission:`${PERMISSION_PREFIX}filter_datecolumn` },
    { name:"From Date",             key:"fromDate",    align:"left", permission:`${PERMISSION_PREFIX}filter_fromdate` },
    { name:"To Date",               key:"toDate",      align:"left", permission:`${PERMISSION_PREFIX}filter_todate` },
  ];

  const allowedFilterColumns = authPermissions.length === 0
    ? baseFilterColumns
    : baseFilterColumns.filter(c => authPermissions.includes(c.permission));

  const filterTableData = useMemo(() => ({
    columns: allowedFilterColumns,
    rows: [
      {
        country: (
          <SearchableSelect
            className="basic-multi-select" classNamePrefix="select"
            name="country" options={CountryCodes().map(c=>({value:c,label:c}))}
            isMulti fontSize="10px" onChange={handleCountryChange}
          />
        ),
        client: (
          <SearchableSelect className="basic-select" classNamePrefix="select"
            name="client" options={clients} isMulti={false}
            fontSize="10px" onChange={handleClientChange}
          />
        ),
        subClients: (
          <SearchableSelect className="basic-multi-select" classNamePrefix="select"
            name="subClients" options={clientSubAccounts} isMulti fontSize="10px"
            onChange={handleClientSubAccountsChange}
          />
        ),
        status: (
          <SearchableSelect className="basic-select" classNamePrefix="select"
            name="status" options={[
              {value:"OPEN",label:"OPEN"},
              {value:"PAUSED",label:"PAUSED"},
              {value:"CLOSED",label:"CLOSED"},
            ]} isMulti fontSize="10px" onChange={handleStatusFilter}
          />
        ),
        dateFilter: (
          <SearchableSelect className="basic-select" classNamePrefix="select"
            name="dateFilter" defaultValue={{value:"Created",label:"Date Column"}}
            options={[
              {value:"Created",label:"Date Column"},
              {value:"Client",label:"Created Column"},
            ]} isMulti={false} fontSize="10px" onChange={handleDateFilter}
          />
        ),
        fromDate: (
          <SoftInput type="datetime-local" sx={{ fontSize:"10px" }}
            value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
        ),
        toDate: (
          <SoftInput type="datetime-local" sx={{ fontSize:"10px" }}
            value={toDate} onChange={(e)=>setToDate(e.target.value)} />
        ),
      },
    ],
  }), [allowedFilterColumns, clients, clientSubAccounts, fromDate, toDate]);

  /* ------------------------------------------------------------------ */
  /*                       render component                             */
  /* ------------------------------------------------------------------ */

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Snackbar */}
      <SoftSnackbar color="primary" icon="notifications" title="Soft UI Dashboard"
        content={message ?? ""} open={show} close={toggleSnackbar} />

      {/* Filters */}
      <Card sx={{ borderRadius: 0 }}>
        <div style={{ display:"flex", gap:"5px", marginBottom:"10px", flexWrap:"wrap", padding:"10px" }}>
          {filterTableData.columns.map(col => (
            <div key={col.name} style={{ flex:1 }}>
              <Typography variant="body2" gutterBottom sx={{ fontSize:"12px" }}>
                {col.name.replace(/([A-Z])/g," $1").trim()}
              </Typography>
              {filterTableData.rows[0][col.key]}
            </div>
          ))}
        </div>
      </Card>

      {/* Main card */}
      <SoftBox my={2}>
        <Card sx={{ borderRadius:0 }}>
          {/* header */}
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" p={1}>
            <SoftBox lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">All Surveys</SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              {/* Import/Export/Search buttons unchanged */}
              {/* ... */}
            </Stack>
          </SoftBox>

          {/* showing entries + pagination controls (unchanged) */}
          {/* ... */}

          {/* table */}
          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
              <CircularProgress color="info" size={60} />
              <SoftTypography variant="h6" color="text" ml={2}>Loading surveys...</SoftTypography>
            </SoftBox>
          ) : projects.length === 0 ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
              <SoftTypography variant="h6" color="textSecondary">No surveys found</SoftTypography>
            </SoftBox>
          ) : allowedProjectColumns.length === 0 ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
              <SoftTypography variant="h6">Sorry ! You don't have permission.</SoftTypography>
            </SoftBox>
          ) : (
            <Table columns={allowedProjectColumns} rows={projects} />
          )}
        </Card>
      </SoftBox>

      <Footer />

      {/* File‑upload modal (unchanged) */}
      {/* ... */}
    </DashboardLayout>
  );
}

export default ProductsList;
