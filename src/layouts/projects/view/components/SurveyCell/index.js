// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function SurveyCell({ survey, title }) {
  const labelStyle = {
    marginRight: "5px",
    minWidth: "155px",
    display: "inline-block",
    color: "#17c1e8",
  };

  const typographyStyle = {
    fontSize: "15.5px",
  };

  return (
    <SoftBox>
      <SoftTypography fontWeight="bold" mb={1} color="primary" style={{ fontSize: "20px" }}>
        {title}
      </SoftTypography>
      <Grid container>
        <Grid item xs={12} md={6}>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Quest Code :</span> {survey.name}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Quota :</span> {survey.quota}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>CPI :</span> {survey.cpi}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>LOI :</span> {survey.loi}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>IR :</span> {survey.ir}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Pre screener :</span> {survey.enable_pre_screener ? "Yes" : "No"}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Status :</span> {survey.status === "A" ? "Active" : survey.status}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Created at :</span> {new Date(survey.created_at).toLocaleString()}
          </SoftTypography>

          {/* ✅ New fields added here */}
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>N :</span> {survey.n_quota ?? "N/A"}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>RemainingN :</span> {survey.remaining_quota ?? "N/A"}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Global Buyer Conversion :</span> {survey.buyer_conversion ?? "N/A"}
          </SoftTypography>
        </Grid>

        <Grid item xs={12} md={6}>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Account Name :</span> {survey.client.name} | {survey.client_sub_account}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Client Survey ID :</span> {survey.client_survey_id}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Country Code :</span> {survey.country_code} | {survey.language_code}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Collect PII :</span> {survey.collect_pii ? "Yes" : "No"}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Evaluation :</span> {survey.evaluation}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Device :</span> {survey.device === "A" ? "All devices" : survey.device}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Industry :</span> {survey.industry}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Study type :</span> {survey.study_type}
          </SoftTypography>
          <SoftTypography fontWeight="bold" style={typographyStyle}>
            <span style={labelStyle}>Updated at :</span> {new Date(survey.updated_at).toLocaleString()}
          </SoftTypography>
        </Grid>
      </Grid>
    </SoftBox>
  );
}

// Typechecking props for the SurveyCell
SurveyCell.propTypes = {
  survey: PropTypes.any,
  title: PropTypes.any,
};

export default SurveyCell;
