import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormField from "layouts/pages/account/components/FormField";
import SoftButton from "components/SoftButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useState } from "react";

function JobRelatedDataForm() {
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

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpen = () => setOpenConfirm(true);
  const handleClose = () => setOpenConfirm(false);

  const handleSendEmail = () => {
    // Add your send email logic here
    console.log("Email sent to shortlisted candidate.");
    handleClose();
  };

  return (
        <Card id="job-related-data"sx={{ p: 3 }}>
          <SoftBox >
          <SoftTypography variant="h5" fontWeight="bold" mb={1}>Job Related Data</SoftTypography>
          <SoftBox ml={2} >
          {renderOptions("1. Present Job Responsibility", [
            "Fully Relevant", "Partially Relevant", "Allied Area", "Not Relevant"])}
          {renderOptions("2. Job Knowledge", [
            "Very Good", "Good", "Just Sufficient", "Not Sufficient"])}
          {renderOptions("3. Job Expertise", [
            "Very Good", "Good", "Above Average", "Acceptable", "Below Average"])}
          {renderOptions("4. Approach to Problem", [
            "Logical", "Balanced", "Confused"])}
            </SoftBox>
          <SoftBox p={1}>
                    <SoftTypography variant="h6">5. Job Related Achievements</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Your achievements" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">6. Reason for leaving present job</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Write your reason" /></Grid>

          <SoftTypography variant="h5" fontWeight="bold" mt={4} mb={1}>Personal Traits</SoftTypography>
          <SoftBox ml={2} >
          {renderOptions("1. Personality In", ["Impressive", "Smart", "Good", "Average", "Not Good"])}
          {renderOptions("2. Leadership", ["Very Good", "Good", "Average", "Poor", "Not Good"])}
          {renderOptions("3. Initiative", ["Self Motivated", "Needs Prompting", "Lacks Initiative", "Impulsive"])}
          {renderOptions("4. Mannerism", ["Pleasant", "Acceptable", "Do not know etiquette"])}
          </SoftBox>
          <SoftBox p={1}>
                    <SoftTypography variant="h6">5. His/Her Strength</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Write your Strength" /></Grid>
            <SoftBox p={1}>
                    <SoftTypography variant="h6">6. His/Her Weakness</SoftTypography>
                  </SoftBox>
            <Grid item xs={12}><SoftInput placeholder="Write your Weakness" /></Grid>

            <Grid container spacing={2} mt={1} mb={2}>
            <Grid item xs={12} sm={6}>
            <FormField label="Remarks" placeholder="Write your Remarks" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Interviewed By" placeholder="Interviewer Name" />
          </Grid>
          </Grid>
          <SoftBox display="flex" justifyContent="flex-end" alignItems="right" mt={3} >
          <SoftBox p={1}>
            <SoftButton variant="gradient" color="error" size="medium" onClick={handleOpen}>Rejected</SoftButton>
          </SoftBox>
          <SoftBox mb={1} p={1}>
          <SoftButton variant="gradient" color="success" size="medium" onClick={handleOpen}>Shortlisted</SoftButton>
          </SoftBox>
          </SoftBox>
          <Dialog open={openConfirm} onClose={handleClose} width="xs" fullWidth >
        <DialogContent>
          <SoftTypography variant="body2">Send an email?</SoftTypography>
        </DialogContent>
        <DialogActions>
          <SoftButton variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </SoftButton>
          <SoftButton variant="gradient" color="info" onClick={handleSendEmail}>
            Send
          </SoftButton>
        </DialogActions>
      </Dialog>
          </SoftBox>
        </Card>
  );
}

export default JobRelatedDataForm;
