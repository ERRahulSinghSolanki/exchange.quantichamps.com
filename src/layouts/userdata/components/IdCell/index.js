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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Checkbox from "@mui/material/Checkbox";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function IdCell({ EmailId, checked = false }) {
  return (
    <SoftBox display="flex" alignItems="center">
      {/* <Checkbox defaultChecked={checked} /> */}
      <SoftBox ml={1}>
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {EmailId}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}


// Typechecking props for the IdCell
IdCell.propTypes = {
  EmailId: PropTypes.string.isRequired,
  checked: PropTypes.bool,
};

export default IdCell;
