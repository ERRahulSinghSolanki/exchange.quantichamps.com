// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ProductCell({country_code, language_code,client_survey_status }) {
  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="button" color="secondary" fontWeight="medium" sx={{ cursor: "pointer",fontSize: "13.5px"}}>
      {country_code} {language_code}{' '}
      {client_survey_status ? (<span style={{ color: '#18c1e8' }}>({client_survey_status})</span>) : ('')}
      </SoftTypography>
    </SoftBox>
  );
}

// Typechecking props for the ProductCell
ProductCell.propTypes = {
  country_code: PropTypes.any,
  language_code: PropTypes.any,
  client_survey_status: PropTypes.any
};

export default ProductCell;
