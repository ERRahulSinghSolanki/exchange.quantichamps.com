// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { API_URL, shouldHideInfo } from "config";

function CompleteCell({completes_count, quota, cpi }) {
  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="button" fontWeight="medium">
      {completes_count} / {quota} {""}

      {!shouldHideInfo && ( // Hide if user ID is not 1
          <SoftTypography component="span" variant="inherit" color="info">
            ({cpi})
          </SoftTypography>
        )}
      </SoftTypography>
    </SoftBox>
  );
}


// Typechecking props for the CompleteCell
CompleteCell.propTypes = {
  completes_count: PropTypes.any,
  quota: PropTypes.any,
  cpi: PropTypes.any
};

export default CompleteCell;
