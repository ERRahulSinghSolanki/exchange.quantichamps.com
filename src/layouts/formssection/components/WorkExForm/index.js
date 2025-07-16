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

// import { useState } from "react";

// // @mui material components
// import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";
// import Switch from "@mui/material/Switch";
// import Tooltip from "@mui/material/Tooltip";
// import Divider from "@mui/material/Divider";

// // Soft UI Dashboard PRO React components
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftAvatar from "components/SoftAvatar";
// import SoftInput from "components/SoftInput";
// import SoftButton from "components/SoftButton";

// // Images
// import logoSlack from "assets/images/small-logos/logo-slack.svg";
// import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
// import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
// import logoAsana from "assets/images/small-logos/logo-asana.svg";

// function Accounts() {
//   const [slack2FA, setSlack2FA] = useState(true);
//   const [spotify2FA, setSpotify2FA] = useState(true);
//   const [atlassian2FA, setAtlassian2FA] = useState(true);
//   const [asana2FA, setAsana2FA] = useState(false);

//   const handleSetSlack2FA = () => setSlack2FA(!slack2FA);
//   const handleSetSpotify2FA = () => setSpotify2FA(!spotify2FA);
//   const handleSetAtlassian2FA = () => setAtlassian2FA(!atlassian2FA);
//   const handleSetAsana2FA = () => setAsana2FA(!asana2FA);

//   return (
//     <Card id="accounts">
//       <SoftBox p={3} lineHeight={1}>
//         <SoftBox mb={1}>
//           <SoftTypography variant="h5">Accounts</SoftTypography>
//         </SoftBox>
//         <SoftTypography variant="button" color="text" fontWeight="regular">
//           Here you can setup and manage your integration settings.
//         </SoftTypography>
//       </SoftBox>
//       <SoftBox pt={2} pb={3} px={3}>
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftBox display="flex" alignItems="center">
//             <SoftAvatar src={logoSlack} alt="Slack logo" variant="rounded" />
//             <SoftBox ml={2}>
//               <SoftTypography variant="h5" fontWeight="medium">
//                 Slack
//               </SoftTypography>
//               <SoftBox display="flex" alignItems="flex-end">
//                 <SoftTypography variant="button" color="text" fontWeight="regular">
//                   Show less
//                 </SoftTypography>
//                 <SoftTypography variant="button" color="text" sx={{ lineHeight: 0 }}>
//                   <Icon fontSize="small">expand_less</Icon>
//                 </SoftTypography>
//               </SoftBox>
//             </SoftBox>
//           </SoftBox>
//           <SoftBox
//             display="flex"
//             alignItems="center"
//             justifyContent="flex-end"
//             width={{ xs: "100%", sm: "auto" }}
//             mt={{ xs: 1, sm: 0 }}
//           >
//             <SoftBox lineHeight={0} mx={2}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 {slack2FA ? "Enabled" : "Disabled"}
//               </SoftTypography>
//             </SoftBox>
//             <SoftBox mr={1}>
//               <Switch checked={slack2FA} onChange={handleSetSlack2FA} />
//             </SoftBox>
//           </SoftBox>
//         </SoftBox>
//         <SoftBox ml={2} pl={6} pt={2} lineHeight={1}>
//           <SoftTypography variant="button" color="text" fontWeight="regular">
//             You haven&apos;t added your Slack yet or you aren&apos;t authorized. Please add our
//             Slack Bot to your account by clicking on here. When you&apos;ve added the bot, send your
//             verification code that you have received.
//           </SoftTypography>
//           <SoftBox
//             bgColor="grey-100"
//             borderRadius="lg"
//             display="flex"
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//             my={3}
//             py={1}
//             pl={{ xs: 1, sm: 2 }}
//             pr={1}
//           >
//             <SoftTypography variant="button" fontWeight="medium" color="text">
//               Verification Code
//             </SoftTypography>
//             <SoftBox width={{ xs: "100%", sm: "25%", md: "15%" }} mt={{ xs: 1, sm: 0 }}>
//               <Tooltip title="Copy" placement="top">
//                 <SoftInput size="small" value="1172913" />
//               </Tooltip>
//             </SoftBox>
//           </SoftBox>
//           <SoftBox
//             bgColor="grey-100"
//             borderRadius="lg"
//             display="flex"
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//             my={3}
//             py={1}
//             pl={{ xs: 1, sm: 2 }}
//             pr={1}
//           >
//             <SoftTypography variant="button" fontWeight="medium" color="text">
//               Connected account
//             </SoftTypography>
//             <SoftBox
//               display="flex"
//               alignItems={{ xs: "flex-start", sm: "center" }}
//               flexDirection={{ xs: "column", sm: "row" }}
//             >
//               <SoftBox mr={2} mb={{ xs: 1, sm: 0 }} lineHeight={0}>
//                 <SoftTypography variant="button" fontWeight="medium">
//                   hello@creative-tim.com
//                 </SoftTypography>
//               </SoftBox>
//               <SoftButton variant="gradient" color="error" size="small">
//                 delete
//               </SoftButton>
//             </SoftBox>
//           </SoftBox>
//         </SoftBox>
//         <Divider />
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftBox display="flex" alignItems="center">
//             <SoftAvatar src={logoSpotify} alt="Slack logo" variant="rounded" />
//             <SoftBox ml={2} lineHeight={0}>
//               <SoftTypography variant="h5" fontWeight="medium">
//                 Spotify
//               </SoftTypography>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 Music
//               </SoftTypography>
//             </SoftBox>
//           </SoftBox>
//           <SoftBox
//             display="flex"
//             justifyContent="flex-end"
//             alignItems="center"
//             width={{ xs: "100%", sm: "auto" }}
//             mt={{ xs: 1, sm: 0 }}
//           >
//             <SoftBox lineHeight={0} mx={2}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 {spotify2FA ? "Enabled" : "Disabled"}
//               </SoftTypography>
//             </SoftBox>
//             <SoftBox mr={1}>
//               <Switch checked={spotify2FA} onChange={handleSetSpotify2FA} />
//             </SoftBox>
//           </SoftBox>
//         </SoftBox>
//         <Divider />
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftBox display="flex" alignItems="center">
//             <SoftAvatar src={logoAtlassian} alt="Slack logo" variant="rounded" />
//             <SoftBox ml={2} lineHeight={0}>
//               <SoftTypography variant="h5" fontWeight="medium">
//                 Atlassian
//               </SoftTypography>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 Payment vendor
//               </SoftTypography>
//             </SoftBox>
//           </SoftBox>
//           <SoftBox
//             display="flex"
//             justifyContent="flex-end"
//             alignItems="center"
//             width={{ xs: "100%", sm: "auto" }}
//             mt={{ xs: 1, sm: 0 }}
//           >
//             <SoftBox lineHeight={0} mx={2}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 {atlassian2FA ? "Enabled" : "Disabled"}
//               </SoftTypography>
//             </SoftBox>
//             <SoftBox mr={1}>
//               <Switch checked={atlassian2FA} onChange={handleSetAtlassian2FA} />
//             </SoftBox>
//           </SoftBox>
//         </SoftBox>
//         <Divider />
//         <SoftBox
//           display="flex"
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           flexDirection={{ xs: "column", sm: "row" }}
//         >
//           <SoftBox display="flex" alignItems="center">
//             <SoftAvatar src={logoAsana} alt="Slack logo" variant="rounded" />
//             <SoftBox ml={2} lineHeight={0}>
//               <SoftTypography variant="h5" fontWeight="medium">
//                 Asana
//               </SoftTypography>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 Organize your team
//               </SoftTypography>
//             </SoftBox>
//           </SoftBox>
//           <SoftBox
//             display="flex"
//             alignItems="center"
//             justifyContent="flex-end"
//             width={{ xs: "100%", sm: "auto" }}
//             mt={{ xs: 1, sm: 0 }}
//           >
//             <SoftBox lineHeight={0} mx={2}>
//               <SoftTypography variant="button" color="text" fontWeight="regular">
//                 {asana2FA ? "Enabled" : "Disabled"}
//               </SoftTypography>
//             </SoftBox>
//             <SoftBox mr={1}>
//               <Switch checked={asana2FA} onChange={handleSetAsana2FA} />
//             </SoftBox>
//           </SoftBox>
//         </SoftBox>
//       </SoftBox>
//     </Card>
//   );
// }

// export default Accounts;


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
import SoftButton from "components/SoftButton";
import React, { useRef } from "react";
import SoftSelect from "components/SoftSelect";
import SoftTagInput from "components/SoftTagInput";
import SoftInput from "components/SoftInput";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";

// Data
import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
import UploadButton from "../UploadButton";

function WorkExForm() {
  // const [skills, setSkills] = useState(["react", "angular"]);
    const fileInputRef = useRef(null);

    const handleClick = () => {
       if(fileInputRef.current){
        fileInputRef.current.click();
        }
    };

  return (
    <Card id="work-ex-form" sx={{ overflow: "visible" }}>
      <SoftBox p={3}>
        <SoftTypography variant="h5">Work-Ex Form</SoftTypography>
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
          {/* <SoftButton variant="outlined" color="secondary" size="extrasmall" sx={{ mt: 2 }}>
                      deactivate
                    </SoftButton> */}
        </Grid>
      </SoftBox>
        </SoftBox>
      ))}
      <SoftBox px={3}>
        <SoftTypography variant="h6" mb={1}>Upload Documents</SoftTypography>
      </SoftBox>
                <SoftBox ml={3} lineHeight={1}>
                    {/* <SoftBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      my={3}
                      py={1}
                      pl={{ xs: 1, sm: 2 }}
                      pr={1}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your Aadhar Card
                      </SoftTypography>
                      <SoftBox width={{ xs: "100%", sm: "25%", md: "15%" }} mt={{ xs: 1, sm: 0 }}>
                        <Tooltip title="Copy" placement="top">
                          <SoftInput size="small" value="1172913" />
                        </Tooltip>
                      </SoftBox>
                    </SoftBox> */}
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
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your Aadhar Card
                      </SoftTypography>
                      {/* <SoftBox
                        display="flex"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        flexDirection={{ xs: "column", sm: "row" }}
                      >
                        
                        <SoftButton variant="gradient" color="dark" size="small">
                          Upload
                        </SoftButton>
                        <SoftButton variant="outlined" color="dark" onClick={handleClick}>
                                        Upload 
                                    </SoftButton>
                      </SoftBox> */}
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
                      mr={3}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="text">
                        Upload your PAN Card
                      </SoftTypography>
                      <UploadButton />
                    </SoftBox>
                  </SoftBox>
    </Card>
  );
}

export default WorkExForm;

