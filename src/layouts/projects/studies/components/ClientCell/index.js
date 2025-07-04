// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ProductCell({name, client_sub_account }) {
  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography variant="button" fontWeight="medium">
        {name} { client_sub_account != null ? ' | ' + client_sub_account : ''}
      </SoftTypography>
    </SoftBox>
  );
}


// Typechecking props for the ProductCell
ProductCell.propTypes = {
  name: PropTypes.string.isRequired,
  client_sub_account: PropTypes.any
};

export default ProductCell;
