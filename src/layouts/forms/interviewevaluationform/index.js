// InterviewEvaluationForm.jsx

import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
// import SoftTextarea from "components/SoftTextarea";
import SoftButton from "components/SoftButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

function InterviewEvaluationForm() {
  const renderOptions = (label, options) => (
    <SoftBox mb={1}>
      <SoftTypography fontWeight="bold" variant="button" mb={1}>
        {label}
      </SoftTypography>
      <Grid container spacing={1}>
        {options.map((opt, idx) => (
          <Grid item xs={12} sm={3} key={idx}>
            <FormControlLabel control={<Checkbox />} label={opt} />
          </Grid>
        ))}
      </Grid>
    </SoftBox>
  );

  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <Card sx={{ p: 6 }}>
          <SoftTypography variant="h5" mb={3} fontWeight="bold">
            Interview Evaluation Form
          </SoftTypography>

          <Grid item xs={12} sm={9}  mb={2} pb={3} px={1} >
          
            <SoftBox p={1}>
                    <SoftTypography variant="h6">Name</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput placeholder="Name" /></Grid>
                        <SoftBox p={1}>
                    <SoftTypography variant="h6">Age</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput placeholder="Age" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">Qualification</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput placeholder="Qualification" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">Experience (years)</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput placeholder="Experience (years)" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">Present Employer</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4} ><SoftInput placeholder="Present Employer" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">Notice Period</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput placeholder="Notice Period" /></Grid>
          </Grid>

          <SoftTypography variant="h6" fontWeight="bold" mt={3} mb={1}>Job Related Data</SoftTypography>
          <SoftBox ml={2} >
          {renderOptions("1) Present Job Responsibility", [
            "Fully Relevant", "Partially Relevant", "Allied Area", "Not Relevant"])}
          {renderOptions("2) Job Knowledge", [
            "Very Good", "Good", "Just Sufficient", "Not Sufficient"])}
          {renderOptions("3) Job Expertise", [
            "Very Good", "Good", "Above Average", "Acceptable", "Below Average"])}
          {renderOptions("4) Approach to Problem", [
            "Logical", "Balanced", "Confused"])}
            </SoftBox>

          {/* <SoftInput placeholder="5) Job Related Achievements" multiline rows={2} fullWidth mb={2} /> */}
          {/* <SoftInput placeholder="6) Reason for leaving present job" multiline rows={2} fullWidth mb={3} /> */}
          <SoftBox p={1}>
                    <SoftTypography variant="h6">5. Job Related Achievements</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Your achievements" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">6. Reason for leaving present job</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Write your reason" /></Grid>
            

          <SoftTypography variant="h6" fontWeight="bold" mt={4} mb={1}>Personal Traits</SoftTypography>
          <SoftBox ml={2} >
          {renderOptions("1) Personality In", ["Impressive", "Smart", "Good", "Average", "Not Good"])}
          {renderOptions("2) Leadership", ["Very Good", "Good", "Average", "Poor", "Not Good"])}
          {renderOptions("3) Initiative", ["Self Motivated", "Needs Prompting", "Lacks Initiative", "Impulsive"])}
          {renderOptions("4) Mannerism", ["Pleasant", "Acceptable", "Do not know etiquette"])}
          </SoftBox>

          {/* <SoftInput label="5) His/Her Strength" fullWidth mb={2} />
          <SoftInput label="6) His/Her Weakness" fullWidth mb={3} /> */}
          {/* <Grid container spacing={2} mb={2}> */}
          <SoftBox p={1}>
                    <SoftTypography variant="h6">5. His/Her Strength</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Write your Strength" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">6. His/Her Weakness</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Write your Weakness" /></Grid>
            {/* </Grid> */}


          <Grid container spacing={2} mt={2}>
            <SoftBox p={3}>
                    <SoftTypography variant="h6">Salary Drawn</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput label="Salary Drawn" fullWidth /></Grid>
            <SoftBox p={3}>
                    <SoftTypography variant="h6">Salary Expected</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput label="Salary Expected" fullWidth /></Grid>
            <SoftBox p={3}>
                    <SoftTypography variant="h6">Notice Period</SoftTypography>
                  </SoftBox>
            <Grid item xs={12} sm={4}><SoftInput label="Notice Period" fullWidth /></Grid>
          </Grid>

          {/* <SoftInput label="Remarks about suitability" multiline rows={3} fullWidth mb={2} />
          <SoftInput label="Interviewed By" fullWidth mb={2} /> */}

          <SoftBox p={1}>
                    <SoftTypography variant="h6">Remarks about suitability</SoftTypography>
                  </SoftBox>
          <Grid item xs={12} sm={4}><SoftInput placeholder="Remarks" fullWidth /></Grid>
          <SoftBox p={1}>
                    <SoftTypography variant="h6">Interviewed By</SoftTypography>
                  </SoftBox>
          <Grid item xs={12} sm={4}><SoftInput placeholder="Interviewer Name" fullWidth /></Grid>

          <SoftBox textAlign="right" mt={3}>
            <SoftButton variant="gradient" color="info">Submit</SoftButton>
          </SoftBox>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
}

export default InterviewEvaluationForm;
