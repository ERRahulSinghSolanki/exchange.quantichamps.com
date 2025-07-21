/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftInput from "components/SoftInput";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import SoftTagInput from "components/SoftTagInput";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";

// Data
import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
import UploadButton from "../UploadButton";
import SoftButton from "components/SoftButton";


function BasicInfo() {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  const [pfEsiStatus, setPfEsiStatus] = useState("");

  const handlePfEsiChange = (option) => {
    setPfEsiStatus(option.value); 
  };

  

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <SoftBox p={3}>
        <SoftTypography variant="h5">Basic Info</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField label="first name" placeholder="Alec" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="last name" placeholder="Thompson" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField type="date" label="DOB" placeholder="Date of Birth" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="email"
              placeholder="example@email.com"
              inputProps={{ type: "email" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="phone number"
              placeholder="+40 735 631 620"
              inputProps={{ type: "number" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="your location" placeholder="Sydney" />
          </Grid>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Ready to relocate
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.relocate} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Name of the person/agency that referred you" placeholder="Alec" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Education Qualification" placeholder="%" />
          </Grid>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Employement Status
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.employementStatus} />
          </Grid>
          <Grid item xs={12} md={6}> 
          <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Department
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.department} />
            </Grid>
            <Grid item xs={12} md={6}>
          <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Designation
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.designation} />
            </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Work Experience" placeholder="Year/Months" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Notice Period" placeholder="Months/Days" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Current Salary" placeholder="Your current salary" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Expected Salary" placeholder=" " />
          </Grid>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Role
                    </SoftTypography>
                     <SoftSelect
          placeholder="Select"
          options={selectData.role}
          onChange={(value) => handleRoleChange(value.value)}
        />
          </Grid>
          {selectedRole === "user" && (
        <>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Manager
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.employementStatus} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Team Leader
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.employementStatus} />
          </Grid>
        </>
      )}
       {selectedRole === "team-leader" && (
        <Grid item xs={12} md={6}>
          <SoftTypography
            component="label"
            variant="caption"
            fontWeight="bold"
            textTransform="capitalize"
          >
            Manager
          </SoftTypography>
          <SoftInput placeholder="Manager" />
        </Grid>
      )}
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Branch
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.branch} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >Shift
                    </SoftTypography>
            <SoftSelect placeholder="Select" options={selectData.shift} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >PF/ESI
                    </SoftTypography>
                    <SoftSelect
          placeholder="Select"
          options={selectData.pfesi} 
          onChange={handlePfEsiChange}
        />
            {pfEsiStatus === "no" && (
        <Grid item xs={12} sm={6}>
          <SoftTypography
            component="label"
            variant="caption"
            fontWeight="bold"
            textTransform="capitalize"
          >
            Upload Consent Form
          </SoftTypography>
          <SoftBox mt={1}>
            <SoftButton variant="outlined" color="dark" component="label">
              Upload File
              <input type="file" hidden />
            </SoftButton>
          </SoftBox>
        </Grid>
      )}
          </Grid>
          <Grid item xs={12} sm={6} ml={1}>
            <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      // ml={1}
                    >Upload your CV
                    </SoftTypography>
          <UploadButton />
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default BasicInfo;