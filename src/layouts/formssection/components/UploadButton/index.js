import React, { useRef } from "react";
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function UploadButton() {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if(fileInputRef.current){
        fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            //   console.log("Uploaded CV:", file.name);
            // Add your upload logic here
        }
    };

    return (
        <SoftBox>
            <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            {/* <SoftBox p={1}>
                <SoftTypography variant="h6"></SoftTypography>
            </SoftBox> */}
            <SoftButton variant="outlined" color="secondary" onClick={handleClick}>
                Upload 
            </SoftButton>
        </SoftBox>
    );
}

export default UploadButton;
