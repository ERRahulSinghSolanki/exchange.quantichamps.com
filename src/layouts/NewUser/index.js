import React, { useState } from "react";

// MUI Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Soft UI Components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

// Layouts
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import pageRoutes from "page.routes";

// Custom Components
import UploadButton from "layouts/formssection/components/UploadButton";
import selectData from "layouts/formssection/components/BasicInfo/data/selectData";

function NewUserForm() {
  const [employmentStatus, setEmploymentStatus] = useState("");

  const handleEmploymentStatusChange = (value) => {
    setEmploymentStatus(value);
  };

  return (
    <PageLayout background="default">
      <DefaultNavbar 
        routes={pageRoutes} 
        transparent 
        relative 
      />
      
      <SoftBox mt={8} mb={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12} xl={10} >
            <Card sx={{ minWidth: 300 }}>
              <SoftBox p={4}>
                <SoftTypography variant="h4" fontWeight="bold" mb={1}>
                  Basic Information
                </SoftTypography>
                <SoftTypography variant="body2" color="text" mb={3}>
                  Please fill all the required fields
                </SoftTypography>
                
                <Divider />
                
                <SoftBox component="form" mt={4}>
                  {/* Row 1 */}
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          First Name
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="Alec" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Last Name
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="Thompson" fullWidth />
                    </Grid>
                  </Grid>

                  {/* Row 2 */}
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Gender
                        </SoftTypography>
                      </SoftBox>
                      <SoftSelect 
                        placeholder="Select Gender" 
                        options={selectData.gender} 
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Date of Birth
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput type="date" fullWidth />
                    </Grid>
                  </Grid>

                  {/* Row 3 */}
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Phone Number
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="+91 XXXXXXXXXX" type="tel" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Email
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="example@email.com" type="email" fullWidth />
                    </Grid>
                  </Grid>

                  {/* Row 4 */}
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Education Qualification
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="e.g. B.Tech, MBA" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Your Location
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="City/State" fullWidth />
                    </Grid>
                  </Grid>

                  {/* Row 5 */}
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Ready to Relocate
                        </SoftTypography>
                      </SoftBox>
                      <SoftSelect 
                        placeholder="Select Option" 
                        options={selectData.relocate} 
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Referrer Name / Agency
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="John Doe" fullWidth />
                    </Grid>
                  </Grid>

                  {/* Row 6 */}
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Employment Status
                        </SoftTypography>
                      </SoftBox>
                      <SoftSelect
                        placeholder="Select Status"
                        options={selectData.employementStatus}
                        value={employmentStatus}
                        onChange={handleEmploymentStatusChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Expected Salary
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="In INR" fullWidth />
                    </Grid>
                  </Grid>

                  {/* Row 7 */}
                  <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Upload Your Resume
                        </SoftTypography>
                      </SoftBox>
                      <UploadButton 
                        buttonText="Choose File" 
                        helperText="PDF/DOCX (Max 5MB)"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SoftBox mb={1}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Upload Passport Size Photo
                        </SoftTypography>
                      </SoftBox>
                      <UploadButton 
                        buttonText="Choose File" 
                        helperText="JPG/PNG (Max 2MB)"
                      />
                    </Grid>
                  </Grid>
                  {/* Row 8 - Submit Button */}
                  <Grid container>
                     <Grid item xs={12}>
                       <Divider />
                          <SoftBox mt={3} display="flex" justifyContent="flex-end">
                          <SoftButton 
                          color="info" 
                          variant="gradient" 
                          size="large"
                          sx={{ px: 6, py: 1.5 }}
                          >
                          Submit
                          </SoftButton>
                          </SoftBox>
                  </Grid>
                  </Grid>
               
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
    </PageLayout>
  );
}

export default NewUserForm;