import React, { useState } from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";

const SearchableSelect = ({
  className,
  classNamePrefix,
  name,
  options,
  isMulti,
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isRtl = false,
  isSearchable = true,
  fontSize,
  width = "100%",
  defaultValue = null,
  onChange,
  onInputChange
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (onInputChange) {
      onInputChange(newValue);
    }
  };

  return (
    <Select
      className={className}
      classNamePrefix={classNamePrefix}
      closeMenuOnSelect={false}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isRtl={isRtl}
      isSearchable={isSearchable}
      name={name}
      options={options}
      isMulti={isMulti}
      menuPortalTarget={document.body}
      defaultValue={defaultValue} // Pass defaultValue here
      onChange={onChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      styles={{
        container: (provided) => ({
          ...provided,
          width: width, // Default to 100%, can be customized
          height: "20px", // Default to 30px, can be customized
          fontSize: fontSize, // Default to 15px, can be customized
        }),
        menu: (provided) => ({
          ...provided,
          width: width, // Dropdown menu width
          fontSize: fontSize, // Dropdown menu font size
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999, // Ensure dropdown stays on top of other elements
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          display: 'none', // Hide the dropdown icon
        }),
        control: (provided) => ({
          ...provided,
        }),
      }}
    />
  );
};

// Prop-Types validation
SearchableSelect.propTypes = {
  className: PropTypes.string.isRequired,
  classNamePrefix: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isMulti: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool,
  isRtl: PropTypes.bool,
  isSearchable: PropTypes.bool,
  fontSize: PropTypes.string,
  width: PropTypes.string,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.object, // Single default value for non-multi-select
    PropTypes.array,  // Array of default values for multi-select
  ]),
};

export default SearchableSelect;
