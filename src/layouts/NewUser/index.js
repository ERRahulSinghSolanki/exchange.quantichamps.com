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

// // @mui core components
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";

// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import PageLayout from "examples/LayoutContainers/PageLayout";
// import pageRoutes from "page.routes";

// // Soft UI Dashboard PRO React components
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftSelect from "components/SoftSelect";
// import SoftInput from "components/SoftInput";
// import Button from "@mui/material/Button";
// import SoftTagInput from "components/SoftTagInput";

// // Settings page components
// import FormField from "layouts/pages/account/components/FormField";

// // Data
// import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
// import UploadButton from "layouts/formssection/components/UploadButton";
// import SoftButton from "components/SoftButton";


// function NewUser() {
//   const [selectedRole, setSelectedRole] = useState("");

//   const handleRoleChange = (value) => {
//     setSelectedRole(value);
//   };

//   const [pfEsiStatus, setPfEsiStatus] = useState("");

//   const handlePfEsiChange = (option) => {
//     setPfEsiStatus(option.value); 
//   };

//   return (
//     <PageLayout background="white" ml={20} mr={20}>
//       <DefaultNavbar
//         routes={pageRoutes}
//         action={{
//           type: "external",
//           route: "https://creative-tim.com/product/soft-ui-dashboard-pro-react",
//           label: "buy now",
//         }}
//       /> 
//     <Card id="basic-info" sx={{ overflow: "visible" , height:"100vh" }}>
//       <SoftBox p={3} ml={27} >
//         <SoftTypography variant="h4"  mt={12}>BASIC INFORMATION</SoftTypography>
//       </SoftBox>
//       <SoftBox component="form" pb={3} px={20} ml={10} mr={10}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={4}>
//             <FormField label="first name" placeholder="Alec" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="last name" placeholder="Thompson" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
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
//                       {/* I&apos;m */}
//                       Gender
//                     </SoftTypography>
//                   </SoftBox>
//                   <SoftSelect placeholder="Male" options={selectData.gender} />
//                 </SoftBox>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//             <FormField type="date" label="DOB" placeholder="DD/MM/YYYY" />
//           </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField
//               label="email"
//               placeholder="example@email.com"
//               inputProps={{ type: "email" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField
//               label="phone number"
//               placeholder="+40 735 631 620"
//               inputProps={{ type: "number" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="Education Qualification" placeholder="" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="your location" placeholder="Sydney" />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <SoftTypography
//                       component="label"
//                       variant="caption"
//                       fontWeight="bold"
//                       textTransform="capitalize"
//                     >Ready to relocate
//                     </SoftTypography>
//             <SoftSelect placeholder="Select" options={selectData.relocate} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="Name of the person/agency that referred you" placeholder="Alec" />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <SoftTypography
//                       component="label"
//                       variant="caption"
//                       fontWeight="bold"
//                       textTransform="capitalize"
//                     >Employement Status
//                     </SoftTypography>
//             <SoftSelect placeholder="Select" options={selectData.employementStatus} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="Expected Salary" placeholder=" " />
//           </Grid>
//           <Grid item xs={12} sm={6} display="flex" flexDirection="row">
//             <Grid item xs={12} sm={8}>
//             <SoftTypography
//                       component="label"
//                       variant="caption"
//                       fontWeight="bold"
//                       textTransform="capitalize"
//                     >Upload your Passport size photo
//                     </SoftTypography>
//           <UploadButton />
//           </Grid>
//           <Grid item xs={12} sm={3} ml={2}>
//             <SoftTypography
//                       component="label"
//                       variant="caption"
//                       fontWeight="bold"
//                       textTransform="capitalize"
//                     >Upload your CV
//                     </SoftTypography>
//           <UploadButton />
//           </Grid>
//           </Grid>
//         </Grid>
//       </SoftBox>
//     </Card>
//     </PageLayout>
//   );
// }

// export default NewUser;


// import { useState } from "react";

// // @mui core components
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";

// // Soft UI Dashboard PRO React components
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftSelect from "components/SoftSelect";
// import PageLayout from "examples/LayoutContainers/PageLayout";
// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import pageRoutes from "page.routes";
// import SoftInput from "components/SoftInput";
// import Button from "@mui/material/Button";
// import SoftTagInput from "components/SoftTagInput";

// // Settings page components
// import FormField from "layouts/pages/account/components/FormField";

// // Data
// import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
// import UploadButton from "layouts/formssection/components/UploadButton";
// import SoftButton from "components/SoftButton";


// function NewUser() {
//   const [selectedRole, setSelectedRole] = useState(""); // Track Employment Status
//   const [pfEsiStatus, setPfEsiStatus] = useState("");

//   // Handle Employment Status change
//   const handleEmploymentStatusChange = (value) => {
//     setSelectedRole(value);
//   };

//   // Handle PF/ESI change
//   const handlePfEsiChange = (option) => {
//     setPfEsiStatus(option.value); 
//   };

//   return (
//     <PageLayout background="white" ml={20} mr={20}>
//       <DefaultNavbar
//         routes={pageRoutes}
//         action={{
//           type: "external",
//           route: "https://creative-tim.com/product/soft-ui-dashboard-pro-react",
//           label: "buy now",
//         }}
//       /> 
//       <Card id="basic-info" sx={{ overflow: "visible" , height:"100vh" }}>
//         <SoftBox p={3} ml={27} >
//           <SoftTypography variant="h4"  mt={12}>BASIC INFORMATION</SoftTypography>
//         </SoftBox>
//         <SoftBox component="form" pb={3} px={20} ml={10} mr={10}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={4}>
//               <FormField label="first name" placeholder="Alec" />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="last name" placeholder="Thompson" />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <SoftBox
//                     display="flex"
//                     flexDirection="column"
//                     justifyContent="flex-end"
//                     height="100%"
//                   >
//                     <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
//                       <SoftTypography
//                         component="label"
//                         variant="caption"
//                         fontWeight="bold"
//                         textTransform="capitalize"
//                       >
//                         Gender
//                       </SoftTypography>
//                     </SoftBox>
//                     <SoftSelect placeholder="Male" options={selectData.gender} />
//                   </SoftBox>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormField type="date" label="DOB" placeholder="DD/MM/YYYY" />
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField
//                 label="email"
//                 placeholder="example@email.com"
//                 inputProps={{ type: "email" }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField
//                 label="phone number"
//                 placeholder="+40 735 631 620"
//                 inputProps={{ type: "number" }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="Education Qualification" placeholder="" />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="your location" placeholder="Sydney" />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <SoftTypography
//                 component="label"
//                 variant="caption"
//                 fontWeight="bold"
//                 textTransform="capitalize"
//               >Ready to relocate
//               </SoftTypography>
//               <SoftSelect placeholder="Select" options={selectData.relocate} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="Name of the person/agency that referred you" placeholder="Alec" />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <SoftTypography
//                 component="label"
//                 variant="caption"
//                 fontWeight="bold"
//                 textTransform="capitalize"
//               >Employement Status
//               </SoftTypography>
//               <SoftSelect 
//                 placeholder="Select" 
//                 options={selectData.employementStatus} 
//                 onChange={(e) => handleEmploymentStatusChange(e.target.value)}
//               />
//             </Grid>

//             {/* Conditionally render fields for "employed" status */}
//             {selectedRole === "employed" && (
//               <>
//                 <Grid item xs={12} sm={4}>
//                   <FormField label="Work Experience" placeholder="Year/Months" />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormField label="Notice Period" placeholder="Months/Days" />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormField label="Current Salary" placeholder="Your current salary" />
//                 </Grid>
//               </>
//             )}

//             <Grid item xs={12} sm={4}>
//               <FormField label="Expected Salary" placeholder=" " />
//             </Grid>
//             <Grid item xs={12} sm={6}  display="flex" flexDirection="row">
//               <Grid item xs={12} sm={8}>
//                 <SoftTypography
//                   component="label"
//                   variant="caption"
//                   fontWeight="bold"
//                   textTransform="capitalize"
//                 >Upload your Passport size photo
//                 </SoftTypography>
//                 <UploadButton />
//               </Grid>
//               <Grid item xs={12} sm={3} ml={2}>
//                 <SoftTypography
//                   component="label"
//                   variant="caption"
//                   fontWeight="bold"
//                   textTransform="capitalize"
//                 >Upload your CV
//                 </SoftTypography>
//                 <UploadButton />
//               </Grid>
//             </Grid>
//           </Grid>
//         </SoftBox>
//       </Card>
//     </PageLayout>
//   );
// }

// export default NewUser;
















// {selectedRole === "employed" && (
//         <>
//         <Grid item xs={12} sm={4}>
//             <FormField label="Work Experience" placeholder="Year/Months" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="Notice Period" placeholder="Months/Days" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormField label="Current Salary" placeholder="Your current salary" />
//           </Grid>
//         </>
//       )}



// import { useState } from "react";

// // @mui core components
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";

// // Soft UI Dashboard PRO React components
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
// import SoftSelect from "components/SoftSelect";
// import PageLayout from "examples/LayoutContainers/PageLayout";
// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import pageRoutes from "page.routes";
// import SoftInput from "components/SoftInput";
// import Button from "@mui/material/Button";
// import SoftTagInput from "components/SoftTagInput";

// // Settings page components
// import FormField from "layouts/pages/account/components/FormField";

// // Data
// import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
// import UploadButton from "layouts/formssection/components/UploadButton";
// import SoftButton from "components/SoftButton";

// function NewUser() {
//   const [selectedRole, setSelectedRole] = useState("fresher"); // Track Employment Status

//   const handleEmploymentStatusChange = (value) => {
//     setSelectedRole(value);
//   };

//   return (
//     <PageLayout background="white" ml={20} mr={20}>
//       <DefaultNavbar
//         routes={pageRoutes}
//         action={{
//           type: "external",
//           route: "https://creative-tim.com/product/soft-ui-dashboard-pro-react",
//           label: "buy now",
//         }}
//       /> 
//       <Card id="basic-info" sx={{ overflow: "visible" , height:"100vh" }}>
//         <SoftBox p={3} ml={27} >
//           <SoftTypography variant="h4"  mt={12}>BASIC INFORMATION</SoftTypography>
//         </SoftBox>
//         <SoftBox component="form" pb={3} px={20} ml={10} mr={10}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={4}>
//               <FormField label="first name" placeholder="Alec" />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="last name" placeholder="Thompson" />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <SoftBox
//                     display="flex"
//                     flexDirection="column"
//                     justifyContent="flex-end"
//                     height="100%"
//                   >
//                     <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
//                       <SoftTypography
//                         component="label"
//                         variant="caption"
//                         fontWeight="bold"
//                         textTransform="capitalize"
//                       >
//                         Gender
//                       </SoftTypography>
//                     </SoftBox>
//                     <SoftSelect placeholder="Male" options={selectData.gender} />
//                   </SoftBox>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormField type="date" label="DOB" placeholder="DD/MM/YYYY" />
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField
//                 label="email"
//                 placeholder="example@email.com"
//                 inputProps={{ type: "email" }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField
//                 label="phone number"
//                 placeholder="+40 735 631 620"
//                 inputProps={{ type: "number" }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="Education Qualification" placeholder="" />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="your location" placeholder="Sydney" />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <SoftTypography
//                 component="label"
//                 variant="caption"
//                 fontWeight="bold"
//                 textTransform="capitalize"
//               >Ready to relocate
//               </SoftTypography>
//               <SoftSelect placeholder="Select" options={selectData.relocate} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormField label="Name of the person/agency that referred you" placeholder="Alec" />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <SoftTypography
//                 component="label"
//                 variant="caption"
//                 fontWeight="bold"
//                 textTransform="capitalize"
//               >Employment Status
//               </SoftTypography>
//               <SoftSelect 
//                 placeholder="Select" 
//                 options={selectData.employementStatus} 
//                 value={selectedRole}
//                 onChange={handleEmploymentStatusChange} // On change of Employment Status
//               />
//             </Grid>

//             {/* Conditionally render fields for "employed" status */}
//             {selectedRole === "employed" && (
//               <>
//                 <Grid item xs={12} sm={4}>
//                   <FormField label="Work Experience" placeholder="Year/Months" />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormField label="Notice Period" placeholder="Months/Days" />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <FormField label="Current Salary" placeholder="Your current salary" />
//                 </Grid>
//               </>
//             )}

//             <Grid item xs={12} sm={4}>
//               <FormField label="Expected Salary" placeholder=" " />
//             </Grid>
//             <Grid item xs={12} sm={6} display="flex" flexDirection="row">
//               <Grid item xs={12} sm={8}>
//                 <SoftTypography
//                   component="label"
//                   variant="caption"
//                   fontWeight="bold"
//                   textTransform="capitalize"
//                 >Upload your Passport size photo
//                 </SoftTypography>
//                 <UploadButton />
//               </Grid>
//               <Grid item xs={12} sm={3} ml={2}>
//                 <SoftTypography
//                   component="label"
//                   variant="caption"
//                   fontWeight="bold"
//                   textTransform="capitalize"
//                 >Upload your CV
//                 </SoftTypography>
//                 <UploadButton />
//               </Grid>
//             </Grid>
//           </Grid>
//         </SoftBox>
//       </Card>
//     </PageLayout>
//   );
// }

// export default NewUser;




import { useState } from "react";

// @mui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import pageRoutes from "page.routes";
import SoftInput from "components/SoftInput";
import Button from "@mui/material/Button";
import SoftTagInput from "components/SoftTagInput";

// Settings page components
import FormField from "layouts/pages/account/components/FormField";

// Data
import selectData from "layouts/formssection/components/BasicInfo/data/selectData";
import UploadButton from "layouts/formssection/components/UploadButton";
import SoftButton from "components/SoftButton";

function NewUser() {
  
  const [selectedRole, setSelectedRole] = useState("");

  const handleEmploymentStatusChange = (value) => {
    // console.log(value);
    setSelectedRole(value);
  };

  return (
    <PageLayout background="white" ml={20} mr={20}>
      <DefaultNavbar
        routes={pageRoutes}
        action={{
          type: "external",
          route: "https://creative-tim.com/product/soft-ui-dashboard-pro-react",
          label: "buy now",
        }}
      />
      <Card id="basic-info" sx={{ overflow: "visible", height: "100vh" }}>
        <SoftBox p={3} ml={27}>
          <SoftTypography variant="h4" mt={12}>
            BASIC INFORMATION
          </SoftTypography>
        </SoftBox>
        <SoftBox component="form" pb={3} px={20} ml={10} mr={10}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormField label="first name" placeholder="Alec" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField label="last name" placeholder="Thompson" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                        Gender
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect placeholder="Male" options={selectData.gender} />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField type="date" label="DOB" placeholder="DD/MM/YYYY" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                label="email"
                placeholder="example@email.com"
                inputProps={{ type: "email" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                label="phone number"
                placeholder="+40 735 631 620"
                inputProps={{ type: "number" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField label="Education Qualification" placeholder="" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField label="your location" placeholder="Sydney" />
            </Grid>
            <Grid item xs={12} md={4}>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Ready to relocate
              </SoftTypography>
              <SoftSelect placeholder="Select" options={selectData.relocate} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField label="Name of the person/agency that referred you" placeholder="Alec" />
            </Grid>
            <Grid item xs={12} md={4}>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Employment Status
              </SoftTypography>
              {/* <SoftSelect
                placeholder="Select"
                options={selectData.employementStatus}
                value={selectedRole}
                onChange={(e) => handleEmploymentStatusChange(e.target.value)} 
              /> */}
              <SoftSelect
  placeholder="Select"
  options={selectData.employementStatus}
  value={selectedRole}
  onChange={(value) => handleEmploymentStatusChange(value)}  // ✅ FIXED
/>

            </Grid>

            {/* Conditionally render fields for "employed" status */}
            {selectedRole === "employed" && (
              <>
                <Grid item xs={12} sm={4}>
                  <FormField label="Work Experience" placeholder="Year/Months" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormField label="Notice Period" placeholder="Months/Days" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormField label="Current Salary" placeholder="Your current salary" />
                </Grid>
              </>
            )}

            {/* These fields will always show */}
            <Grid item xs={12} sm={4}>
              <FormField label="Expected Salary" placeholder=" " />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" flexDirection="row">
              <Grid item xs={12} sm={8}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Upload your Passport size photo
                </SoftTypography>
                <UploadButton />
              </Grid>
              <Grid item xs={12} sm={3} ml={2}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Upload your CV
                </SoftTypography>
                <UploadButton />
              </Grid>
            </Grid>
          </Grid>
        </SoftBox>
      </Card>
    </PageLayout>
  );
}

export default NewUser;
