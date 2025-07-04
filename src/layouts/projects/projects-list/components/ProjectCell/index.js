// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ProjectCell({name}) {
  return (
    <SoftBox display="flex" alignItems="center">
      {/* <Checkbox value={id} /> */}
      <SoftTypography variant="button" fontWeight="medium">
        {name}
      </SoftTypography>
    </SoftBox>
  );
}


// Typechecking props for the ProjectCell
ProjectCell.propTypes = {
  name: PropTypes.any,
};

export default ProjectCell;
