import React, { useState } from "react";
import { Card, Grid, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

const salaryComponents = [
  "Basic Salary",
  "PF",
  "HRA",
  "Dearness Allowance",
  "Conveyance Allowance",
  "Education Allowance",
  "Uniform Allowance",
  "Telephone Allowance",
  "CCA",
  "Bonus",
  "Medical",
  "LTA",
  "Other benefits, if any",
];

// List of currencies with their symbols
const selectData = {
  currencies: [
    { value: "USD", label: "USD", symbol: "$" },
    { value: "INR", label: "INR", symbol: "₹" },
    { value: "EUR", label: "EUR", symbol: "€" },
    { value: "GBP", label: "GBP", symbol: "£" },
    { value: "JPY", label: "JPY", symbol: "¥" },
    { value: "AUD", label: "AUD", symbol: "A$" },
    { value: "CAD", label: "CAD", symbol: "C$" },
  ],
};

function SalaryStructure() {
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [currencySymbol, setCurrencySymbol] = useState("₹");

  const handleCurrencyChange = (event) => {
    const selectedCurrencyValue = event.target.value;
    setSelectedCurrency(selectedCurrencyValue);
    const selectedCurrencyData = selectData.currencies.find(
      (currency) => currency.value === selectedCurrencyValue
    );
    setCurrencySymbol(selectedCurrencyData.symbol);
  };

  return (
    <Card id="salary-structure" sx={{ padding: 4 }}>
      <SoftBox mb={3}>
        <SoftTypography variant="h5" fontWeight="bold">
          Salary Structure
        </SoftTypography>
      </SoftBox>

      {/* Currency Dropdown */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4} >
          <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
            Currency
          </SoftTypography>
          <FormControl fullWidth>
            
            {/* <InputLabel>Currency</InputLabel> */}
            <Select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              label="Currency"
            >
              {selectData.currencies.map((currency) => (
                <MenuItem key={currency.value} value={currency.value}>
                  {currency.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Header Row */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={4}>
          <SoftTypography variant="caption" fontWeight="bold">
            Components
          </SoftTypography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <SoftTypography variant="caption" fontWeight="bold">
            Monthly
          </SoftTypography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <SoftTypography variant="caption" fontWeight="bold">
            Annual
          </SoftTypography>
        </Grid>
      </Grid>

      {/* Component Rows */}
      {salaryComponents.map((component, index) => (
        <Grid container spacing={2} alignItems="center" key={index} mb={1}>
          <Grid item xs={12} sm={4}>
            <SoftTypography variant="body2">{component}</SoftTypography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <SoftInput
              type="number"
              placeholder={`${currencySymbol} 0`}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <SoftInput
              type="number"
              placeholder={`${currencySymbol} 0`}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}

      {/* Total Row */}
      <Grid container spacing={2} alignItems="center" mt={3}>
        <Grid item xs={12} sm={4}>
          <SoftTypography variant="body2" fontWeight="bold">
            Total
          </SoftTypography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <SoftInput
            type="number"
            placeholder={`${currencySymbol} 0`}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <SoftInput
            type="number"
            placeholder={`${currencySymbol} 0`}
            fullWidth
          />
        </Grid>
      </Grid>
    </Card>
  );
}

export default SalaryStructure;
