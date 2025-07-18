// /**
// =========================================================
// * Soft UI Dashboard PRO React - v4.0.3
// =========================================================

// * Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
// * Copyright 2024 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// // @mui material components
// import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";

// // Soft UI Dashboard PRO React components
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftButton from "components/SoftButton";
// import SoftBadge from "components/SoftBadge";

// function FresherForm() {
//   return (
//     <Card id="2fa" sx={{ overflow: "visible" }}>
//       <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
//         <SoftTypography variant="h5">Fresher Form</SoftTypography>
//         <SoftBadge variant="contained" color="success" badgeContent="enabled" container />
//       </SoftBox>
//       <SoftBox p={3}>
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftTypography variant="body2" color="text">
//             Security keys
//           </SoftTypography>
//           <SoftBox
//             display="flex"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//           >
//             <SoftBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 No Security keys
//               </SoftTypography>
//             </SoftBox>
//             <SoftButton variant="outlined" color="dark" size="small">
//               add
//             </SoftButton>
//           </SoftBox>
//         </SoftBox>
//         <Divider />
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftTypography variant="body2" color="text">
//             SMS number
//           </SoftTypography>
//           <SoftBox
//             display="flex"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//           >
//             <SoftBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 +3012374423
//               </SoftTypography>
//             </SoftBox>
//             <SoftButton variant="outlined" color="dark" size="small">
//               edit
//             </SoftButton>
//           </SoftBox>
//         </SoftBox>
//         <Divider />
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftTypography variant="body2" color="text">
//             Authenticator app
//           </SoftTypography>
//           <SoftBox
//             display="flex"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//           >
//             <SoftBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 Not Configured
//               </SoftTypography>
//             </SoftBox>
//             <SoftButton variant="outlined" color="dark" size="small">
//               set up
//             </SoftButton>
//           </SoftBox>
//         </SoftBox>
//       </SoftBox>
//     </Card>
//   );
// }

// export default FresherForm;




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

import { useState } from "react";

// @mui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import SoftTagInput from "components/SoftTagInput";
import SoftInput from "components/SoftInput";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";

// Data
import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
import UploadButton from "../UploadButton";

function FresherForm() {
  // const [skills, setSkills] = useState(["react", "angular"]);

  return (
    <Card id="fresher-form" sx={{ overflow: "visible" }}>
      <SoftBox p={3}>
        <SoftTypography variant="h5">Fresher Form</SoftTypography>
      </SoftBox>
      <SoftBox px={3}>
        <SoftTypography variant="h6" mb={1}>Personal Details</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField label="first name" placeholder="Alec" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="last name" placeholder="Thompson" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField label="Current Address" placeholder="Enter your current address" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Permanent Address" placeholder="Enter your permanent address" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField label="Emergency Contact 1" placeholder="Enter your Aadhar number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Emergency Contact 2" placeholder="Enter your PAN Number" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField label="Aadhar Number" placeholder="Enter your Aadhar number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="PAN Number" placeholder="Enter your PAN Number" />
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox px={3}>
        <SoftTypography variant="h6" mb={1}>Account Details</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField label="bank name" placeholder="Enter your Bank name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="branch name/address" placeholder="Enter your Bank branch" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField label="account number" placeholder="Enter your Account number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Re-enter Account number" placeholder="Re-Enter your account number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="IFSC Code" placeholder="Enter your IFSC code" />
          </Grid>
        </Grid>
      </SoftBox>
      <SoftTypography variant="h6" fontWeight="bold" mb={1} ml={3}>
        Education Details
      </SoftTypography>

      {["10th", "12th", "Graduation", "Post-Graduation"].map((level, index) => (
        <SoftBox key={index} mb={2}>
          <SoftTypography variant="button" fontWeight="dark" color="text" mb={4} ml={3}>
            {level} Details
          </SoftTypography>
          {/* <Grid container spacing={2} ml={2} mr={2} >
            <Grid item xs={12} sm={6}><SoftInput label="Exam Passed" placeholder={level} /></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Board / University" placeholder="Board/University" /></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Institution Name" placeholder="Your Institiution Name"/></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Year of Passing" placeholder="Year of Passing"/></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Percentage / CGPA" placeholder="Percentage/CGPA"/></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Subject / Stream" placeholder="Subject/Stream"/></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Mode" placeholder="Mode (Full-time / Part-time)"/></Grid>
            <Grid item xs={12} sm={6}><SoftInput label="Achievements (if any)" placeholder="Achievements (if any)"/></Grid>
          </Grid> */}
          <SoftBox component="form" pb={1} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField label="Exam Passed" placeholder={level} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Board / University" placeholder="Board/University" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField label="Institution Name" placeholder="Your Institution Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Year of Passing" placeholder="Year of Passing" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Percentage/CGPA" placeholder="Percentage/CGPA" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Subject/Stream" placeholder="Subject/Stream" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Mode" placeholder="Mode (Full-time / Part-time)" />
          </Grid>
        </Grid>
      </SoftBox>
      
      {/* <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField label="bank name" placeholder="Enter your Bank name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="branch name/address" placeholder="Enter your Bank branch" />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormField label="account number" placeholder="Enter your Account number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="Re-enter Account number" placeholder="Re-Enter your account number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField label="IFSC Code" placeholder="Enter your IFSC code" />
          </Grid>
        </Grid>
      </SoftBox> */}
          {/* <SoftBox p={3}>
            <UploadButton placeholder="Upload Resume" />
            <UploadButton placeholder="Upload Photo" />
            <UploadButton placeholder="Upload Signature" />
          </SoftBox> */}
        </SoftBox>
      ))}
      <SoftBox px={3}>
        <SoftTypography variant="h6" mb={1}>Upload Documents</SoftTypography>
      </SoftBox>
      <SoftBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      my={2}
                      py={1}
                      pl={{ xs: 1, sm: 2 }}
                      pr={1}
                      ml={3}
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your Aadhar Card
                      </SoftTypography>
                      <UploadButton />
                    </SoftBox>
                    <SoftBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      my={2}
                      py={1}
                      pl={{ xs: 1, sm: 2 }}
                      pr={1}
                      ml={3}
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your PAN Card
                      </SoftTypography>
                      <UploadButton />
                    </SoftBox>
                    <SoftBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      my={2}
                      py={1}
                      pl={{ xs: 1, sm: 2 }}
                      pr={1}
                      ml={3}
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your 10th Marksheet
                      </SoftTypography>
                      <UploadButton />
                    </SoftBox>
                    <SoftBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      my={2}
                      py={1}
                      pl={{ xs: 1, sm: 2 }}
                      pr={1}
                      ml={3}
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your 12th Marksheet
                      </SoftTypography>
                      <UploadButton />
                    </SoftBox>
                    <SoftBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      my={2}
                      py={1}
                      pl={{ xs: 1, sm: 2 }}
                      pr={1}
                      ml={3}
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your Graduation Marksheet
                      </SoftTypography>
                      <UploadButton />
                    </SoftBox>
    </Card>
  );
}

export default FresherForm;
