import React, { useState } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftSnackbar from "components/SoftSnackbar";

import { API_URL } from "config";

function LinkCell({survey_id, quest_code}) {
    const [link, setLink] = useState("");
    const[btnColor, setBtnColor] = useState("info");
    const [message, setMessage] = useState(null);
    const [show, setShow] = useState(false);
    const toggleSnackbar = () => setShow(!show);

    const handleCopyLink = async () => {
        const token = localStorage.getItem("authToken");
        const supplierCode = "1000"; // example supplier code, replace if needed

        try {
          const response = await fetch(`${API_URL}/links/own/${survey_id}/${supplierCode}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
  
          // console.log(data)
          setMessage("");
    
          if (data.success == 1) {
            const generatedLink = data.link; // Get the link from the response data
            const updatedLink = `${generatedLink}&code=${quest_code}`; // Add quest_code as a query parameter
            setLink(updatedLink);

            try {
              await navigator.clipboard.writeText(updatedLink); // Copy link to clipboard
              setBtnColor("primary");
              setMessage("Link copied to clipboard!");
              setShow(true);

              setTimeout(() => {
                setBtnColor("info");
                setShow(false);
              }, 2000);
             
            } catch (clipboardError) {
                console.error("Clipboard error:", clipboardError);
                setMessage("Failed to copy link to clipboard. Please copy it manually.");
                setShow(true);
            }
          } else {
            setMessage(message || "Failed to generate link");
            setShow(true);
          }
        } catch (error) {
          setMessage("An error occurred while generating the link.");
          setShow(true);
          console.error(error);
        }
      };

    return (
        <SoftBox display="flex" alignItems="center">
        <SoftTypography variant="button" color={btnColor} fontWeight="medium" sx={{ cursor: "pointer" }}  onClick={handleCopyLink}>
            Copy Link
        </SoftTypography>

         <SoftSnackbar color="info" icon="notifications" title="Exchange Quest" dateTime="" content={message ?? ''} open={show} close={toggleSnackbar}/>

        </SoftBox>
    );
}


// Typechecking props for the LinkCell
LinkCell.propTypes = {
    survey_id: PropTypes.any.isRequired,
    quest_code: PropTypes.any.isRequired,
};

export default LinkCell;
