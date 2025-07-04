// import { useState } from "react";

// // @mui core components
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";

// // Soft UI Dashboard PRO React components
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftSelect from "components/SoftSelect";
// import SoftTagInput from "components/SoftTagInput";

// // Settings page components
// import FormField from "layouts/pages/account/components/FormField";

// // Data
// import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";

// const JobApllicationForm = () => {
//     return (
//         <Card id="basic-info" sx={{ overflow: "visible" }}>
//       <SoftBox p={3}>
//         <SoftTypography variant="h5">Basic Info</SoftTypography>
//       </SoftBox>
//       <SoftBox component="form" pb={3} px={3}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//             <FormField label="first name" placeholder="Alec" />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormField label="last name" placeholder="Thompson" />
//           </Grid>
//           <Grid item xs={12}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={4}>
//                 <SoftBox
//                   display="flex"
//                   flexDirection="column"
//                   justifyContent="flex-end"
//                   height="100%"
//                 >
//                   <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
//                     <SoftTypography
//                       component="label"
//                       variant="caption"
//                       fontWeight="bold"
//                       textTransform="capitalize"
//                     >
//                       I&apos;m
//                     </SoftTypography>
//                   </SoftBox>
//                   <SoftSelect placeholder="Male" options={selectData.gender} />
//                 </SoftBox>
//               </Grid>
//               <Grid item xs={12} sm={8}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} sm={5}>
//                     <SoftBox
//                       display="flex"
//                       flexDirection="column"
//                       justifyContent="flex-end"
//                       height="100%"
//                     >
//                       <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
//                         <SoftTypography
//                           component="label"
//                           variant="caption"
//                           fontWeight="bold"
//                           textTransform="capitalize"
//                         >
//                           birth date
//                         </SoftTypography>
//                       </SoftBox>
//                       <SoftSelect placeholder="February" options={selectData.birthDate} />
//                     </SoftBox>
//                   </Grid>
//                   <Grid item xs={12} sm={4}>
//                     <SoftBox
//                       display="flex"
//                       flexDirection="column"
//                       justifyContent="flex-end"
//                       height="100%"
//                     >
//                       <SoftSelect placeholder={1} options={selectData.days} />
//                     </SoftBox>
//                   </Grid>
//                   <Grid item xs={12} sm={3}>
//                     <SoftBox
//                       display="flex"
//                       flexDirection="column"
//                       justifyContent="flex-end"
//                       height="100%"
//                     >
//                       <SoftSelect placeholder={2021} options={selectData.years} />
//                     </SoftBox>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormField
//               label="email"
//               placeholder="example@email.com"
//               inputProps={{ type: "email" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormField
//               label="confirmation email"
//               placeholder="example@email.com"
//               inputProps={{ type: "email" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormField label="your location" placeholder="Sydney, A" />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormField
//               label="phone number"
//               placeholder="+40 735 631 620"
//               inputProps={{ type: "number" }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormField label="language" placeholder="English" />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <SoftBox display="flex" flexDirection="column" justifyContent="flex-end" height="100%">
//               <SoftTagInput
//                 tags={skills}
//                 placeholder=" "
//                 onChange={(newSkill) => setSkills(newSkill)}
//                 removeOnBackspace
//               />
//             </SoftBox>
//           </Grid>
//         </Grid>
//       </SoftBox>
//     </Card>
//     );
// };

// export default JobApllicationForm;



// ApplicantDetailsForm.jsx

import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

function ApplicationForm() {
  return (
    <SoftBox py={3} maxWidth="1200px"
  width="100%"
  mx="auto"
  ml={35}>
      <Card sx={{ p: 3 }}>
        <SoftTypography variant="h5" fontWeight="bold" mb={3}>
          Applicant Information Form
        </SoftTypography>

        {/* Personal Details */}
        <SoftTypography variant="h6" fontWeight="bold" mb={2}>
          Personal Details
        </SoftTypography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}><SoftInput label="Post applied for" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Department" /></Grid>
          <Grid item xs={12}><SoftInput label="Full Name (Block Letters)" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Contact No." /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Residence No." /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Total Experience" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Notice Period" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Present Salary" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Expected Salary" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Date of Interview" /></Grid>
          <Grid item xs={12} sm={6}><SoftInput label="Mail Id" /></Grid>
          <Grid item xs={12}><SoftInput label="Person/Placement that referred you" /></Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Education Details */}
        <SoftTypography variant="h6" fontWeight="bold" mb={2}>
          Education Details
        </SoftTypography>
        <Grid container spacing={2} mb={2}>
          {["10th", "12th"].map((label, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={2}><SoftInput label={`Exam Passed (${label})`} /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Subject" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Specialization" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="School / College / University" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Marks Obtained (%)" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Year of Passing" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Full Time / Part Time" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Achievement" /></Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Employment History */}
        <SoftTypography variant="h6" fontWeight="bold" mb={2}>
          Employment History
        </SoftTypography>
        <Grid container spacing={2}>
          {["Present Employer", "Previous Employer I", "Previous Employer II", "Previous Employer III", "Previous Employer IV"].map((label, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={2}><SoftInput label={`Details (${label})`} /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Company" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Location" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Duration (From-To)" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Designation" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Reporting Officer" /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="No. of Years of Exp." /></Grid>
              <Grid item xs={12} sm={2}><SoftInput label="Reason for Leaving" /></Grid>
            </React.Fragment>
          ))}
        </Grid>

        <SoftBox textAlign="right" mt={4}>
          <SoftButton variant="gradient" color="info">Submit</SoftButton>
        </SoftBox>
      </Card>
    </SoftBox>
  );
}

export default ApplicationForm;
