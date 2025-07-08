import { useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftButton from "components/SoftButton";
import FormField from "layouts/pages/account/components/FormField";
import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import { API_URL } from "config";

function BasicInfo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    role: "user",
    gender: null,
    birthMonth: null,
    birthDay: null,
    birthYear: null,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // For SoftSelect, onChange returns selected option object directly
  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      role: ""
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Emails do not match";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          roles: [formData.role]
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid response from server");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create user");

      window.location.reload();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <SoftBox p={3}>
        <SoftTypography variant="h5">Basic Info</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField 
              label="first name" 
              placeholder="Alec"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField 
              label="last name" 
              placeholder="Thompson"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <SoftBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                >
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      I&apos;m
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect 
                    placeholder="Male" 
                    options={selectData.gender} 
                    name="gender"
                    value={selectData.gender.find(opt => opt.value === formData.gender) || null}
                    onChange={selectedOption => handleSelectChange("gender", selectedOption)}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={5}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          birth date
                        </SoftTypography>
                      </SoftBox>
                      <SoftSelect 
                        placeholder="February" 
                        options={selectData.birthDate} 
                        name="birthMonth"
                        value={selectData.birthDate.find(opt => opt.value === formData.birthMonth) || null}
                        onChange={selectedOption => handleSelectChange("birthMonth", selectedOption)}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftSelect 
                        placeholder={1} 
                        options={selectData.days} 
                        name="birthDay"
                        value={selectData.days.find(opt => opt.value === formData.birthDay) || null}
                        onChange={selectedOption => handleSelectChange("birthDay", selectedOption)}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftSelect 
                        placeholder={2021} 
                        options={selectData.years} 
                        name="birthYear"
                        value={selectData.years.find(opt => opt.value === formData.birthYear) || null}
                        onChange={selectedOption => handleSelectChange("birthYear", selectedOption)}
                      />
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="email"
              placeholder="example@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              inputProps={{ type: "email" }}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="confirmation email"
              placeholder="example@email.com"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              inputProps={{ type: "email" }}
              error={!!errors.confirmEmail}
              helperText={errors.confirmEmail}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="address" placeholder="Sydney, A" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="phone number"
              placeholder="+40 735 631 620"
              inputProps={{ type: "number" }}
            />
          </Grid>

          {/* Role Dropdown */}
          <Grid item xs={12} md={6}>
            <SoftBox
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              height="100%"
            >
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Role
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                name="role"
                value={
                  [
                    { value: "user", label: "User" },
                    { value: "team_leader", label: "Team Leader" },
                    { value: "manager", label: "Manager" }
                  ].find(option => option.value === formData.role) || null
                }
                onChange={(selectedOption) =>
                  handleSelectChange("role", selectedOption)
                }
                options={[
                  { value: "user", label: "User" },
                  { value: "team_leader", label: "Team Leader" },
                  { value: "manager", label: "Manager" },
                ]}
                error={!!errors.role}
                helperText={errors.role}
              />
            </SoftBox>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <SoftBox display="flex" justifyContent="flex-end" mt={2}>
              <SoftButton
                variant="gradient"
                color="dark"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </SoftButton>
            </SoftBox>
            {submitError && (
              <SoftTypography variant="caption" color="error" mt={1}>
                {submitError}
              </SoftTypography>
            )}
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default BasicInfo;
