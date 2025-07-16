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

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Settings page components
import BaseLayout from "layouts/pages/account/components/BaseLayout";
import Sidenav from "layouts/formssection/components/Sidenav";
import Header from "layouts/formssection/components/Header";
import BasicInfo from "layouts/formssection/components/BasicInfo";
import JobRelatedDataForm from "layouts/formssection/components/JobRelatedDataForm";
import FresherForm from "layouts/formssection/components/FresherForm";
import WorkExForm from "layouts/formssection/components/WorkExForm";
import SalaryStructure from "layouts/formssection/components/SalaryStructure";
import Sessions from "layouts/formssection/components/Sessions";
import DeleteAccount from "layouts/formssection/components/DeleteAccount";
import ChangeUserPassword from "layouts/formssection/components/ChangeUserPassword";

function FormSection() {
  return (
    <BaseLayout>
      <SoftBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid>
          <Grid item xs={12} lg={9}>
            <SoftBox mb={3}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                  <Header />
                </Grid> */}
                <Grid item xs={12}>
                  <BasicInfo />
                </Grid>
                <Grid item xs={12}>
                  <ChangeUserPassword />
                </Grid>
                <Grid item xs={12}>
                  <JobRelatedDataForm />
                </Grid>
                <Grid item xs={12}>
                  <FresherForm />
                </Grid>
                <Grid item xs={12}>
                  <WorkExForm />
                </Grid>
                <Grid item xs={12}>
                  <SalaryStructure />
                </Grid>
                {/* <Grid item xs={12}>
                  <Sessions />
                </Grid>
                <Grid item xs={12}>
                  <DeleteAccount />
                </Grid> */}
              </Grid>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </BaseLayout>
  );
}

export default FormSection;
