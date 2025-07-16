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

  //  const passwordRequirements = [
  //     "One special characters",
  //     "Min 6 characters",
  //     "One number (2 are recommended)",
  //     "Change it often",
  //   ];
  

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
          {/* <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <SoftBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                >
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Gender
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect placeholder="Male" options={selectData.gender} />
                </SoftBox>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={5}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          birth date
                        </SoftTypography>
                      </SoftBox>
                      <SoftSelect placeholder="February" options={selectData.birthDate} />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftSelect placeholder={1} options={selectData.days} />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftSelect placeholder={2021} options={selectData.years} />
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <FormField
              label="email"
              placeholder="example@email.com"
              inputProps={{ type: "email" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="confirmation email"
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
          <Grid item xs={12} sm={6}>
            <FormField label="Department" placeholder="HR" />
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
          {/* <ChangePassword /> */}
          {/* <SoftBox mt={3} mb={1}>
        <SoftTypography variant="h5">Change Password</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormField
              label="current password"
              placeholder="Current Password"
              inputProps={{ type: "password", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormField
              label="new password"
              placeholder="New Password"
              inputProps={{ type: "password", autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              label="confirm new password"
              placeholder="Confirm Password"
              inputProps={{ type: "password", autoComplete: "" }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          flexWrap="wrap"
        >
          <SoftBox mt={2}>
            <SoftButton variant="gradient" color="dark" size="small">
              update password
            </SoftButton>
          </SoftBox>
        </SoftBox>
        </Grid>
      </SoftBox> */}
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default BasicInfo;
