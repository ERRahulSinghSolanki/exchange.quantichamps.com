import React, { useEffect,useState } from "react"; // Import React and useState
import { useNavigate } from 'react-router-dom';

// prop-types is a library for typechecking of props
import PropTypes, { object } from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, CircularProgress} from "@mui/material";
import { API_URL } from "config";
const token = localStorage.getItem("authToken");



function ActionCell({ id, quest_code }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null); 
  const [apiResponseCells, setApiResponseCells] = useState(null); 
  const [apiResponseQuotas, setApiResponseQuotas] = useState(null); 
  const [quotasCount, setQuotasCount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0); // State for tabs

  const navigate = useNavigate();

  const handleOpen = async () => {
    setIsModalOpen(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/surveys/${id}/questions`,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }); // Replace with your API endpoint
      const data = await response.json();
      setApiResponse(data.questions);
      setApiResponseCells(data.cells);
      setApiResponseQuotas(data.quotas);

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const syncQuestion = async (event) => {
    const attributeId = event.target.getAttribute('data-attribute_id');
  
    try {
      const response = await fetch(`${API_URL}/questions/sync?attribute_id=${attributeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log('Sync successful:', data);
  
      // Call handleOpen after syncQuestion is successful
      await handleOpen();
    } catch (error) {
      setError(error);
    }
  };


  useEffect(() => {
    let total = 0;
    (apiResponseQuotas || []).flat().forEach((item) => {
      if (Array.isArray(item.cells) && item.cells.length > 0) {
        total += item.count || 0;
      }
    });
  
    setQuotasCount(total);
  }, [apiResponseQuotas]);

  const handleView = () => {
    navigate(`/projects/view/${id}`);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  
  return (
    <SoftBox display="flex" alignItems="center">

      <SoftTypography variant="body1" color="info" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={handleOpen}>
        <Tooltip title="Screener Preview" placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>

      <SoftTypography variant="body1" mx={1} color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={handleView}>
        <Tooltip title="Project Preview" placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>
     
        <SoftTypography variant="body1" mr={1} color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }} >
          <Tooltip title="Edit project" placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </SoftTypography>

      <Dialog open={isModalOpen} onClose={handleCloseModal}  PaperProps={{ sx: {width: '70vw',height: '85vh',maxWidth: 'none',padding: '0px 10px'} }}>

        <DialogTitle sx={{ textAlign: "center", fontSize: "22px" }}>
          Screener Preview
          <SoftBox lineHeight={1} sx={{ textAlign: "left", fontSize: "18px", marginTop: "10px" }} color="primary" fontWeight="medium">
            <span style={{ color: "#344767" }}>Quantish Code :</span> {quest_code} |{" "}
            <span style={{ color: "#344767" }}>Quotas Count :</span> {quotasCount}
          </SoftBox>
        </DialogTitle>

        <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ height: '35px', minHeight: '35px' }}>
          <Tab label="Screeners" sx={{ minHeight: '35px' }} />
          <Tab label="Quotas" sx={{ minHeight: '35px' }} />
        </Tabs>

        <DialogContent>
        {loading ? (
              <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress size={70}/>
              </SoftBox>
            ) : error ? (
              <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
                <div>Error: {error}</div>
              </SoftBox>
            ) : tabIndex === 0 ? (
            apiResponse &&
            Object.values(apiResponse).map((questionData) => (
              
              <SoftBox key={questionData.id} mt={2}>
               <SoftTypography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    display: "flex", // Flex container
                    alignItems: "center", // Vertically align items
                  }}
                >
                  <Icon sx={{ mr: 1 }} color="primary">circle</Icon>
                  {questionData.question}

                {questionData.options == '' && questionData.precodes == '' ? 
                  <Icon sx={{ ml: 1 }} color="primary" data-attribute_id={questionData.client_question_id} onClick={syncQuestion}>refresh</Icon> : ''}

                </SoftTypography>

                <SoftBox mt={1} ml={3} >
                  {questionData.type === "input" && (
                      Object.values(questionData.options) != ''  
                      ? (
                          <SoftTypography sx={{ fontSize: "16px",wordWrap: "break-word"}}  variant="body2" >
                            {Object.values(questionData.options).map((value, index) => value).join(",") }
                          </SoftTypography>)
                          : (
                          <SoftTypography sx={{ fontSize: "16px" }}  variant="body2">
                            {questionData.precodes.join(", ")}
                          </SoftTypography>
                      )
                  )}

                  {questionData.type === "radio" && (
                    Object.values(questionData.options) != ''  ? (
                      Object.values(questionData.options).map((value, index) => (
                        <SoftTypography sx={{ fontSize: "16px" }} key={index} variant="body2">
                          {value}
                        </SoftTypography>
                      ))
                    ) : (
                        <SoftTypography sx={{ fontSize: "16px" }}  variant="body2">
                          {questionData.precodes.join(", ")}
                        </SoftTypography>
                    )
                  )}
                  {questionData.type === "checkbox" && (
                    Object.keys(questionData.options).map((key) => (
                      <SoftTypography sx={{ fontSize:"16px" }} key={key} variant="body2">
                        {questionData.options[key]}
                      </SoftTypography>
                    ))
                  )}
                   {questionData.type === "select" && (
                    Object.keys(questionData.options).map((key) => (
                      <SoftTypography sx={{ fontSize:"16px" }} key={key} variant="body2">
                        {questionData.options[key]}
                      </SoftTypography>
                    ))
                  )}
                  {questionData.type === "date" && (
                    Object.keys(questionData.options).map((key) => (
                      <SoftTypography sx={{ fontSize:"16px" }} key={key} variant="body2">
                        {questionData.options[key]}
                      </SoftTypography>
                    ))
                  )}
                </SoftBox>
              </SoftBox>
            ))) : (
              <SoftBox mt="2">
              {apiResponseCells && apiResponseQuotas ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ddd",padding: "2px 4px",fontSize: "14px", textAlign: "left"}}>Question</th>
                      <th style={{ border: "1px solid #ddd",padding: "2px 4px",fontSize: "14px", textAlign: "left"}}>Status</th>
                      <th style={{ border: "1px solid #ddd",padding: "2px 4px",fontSize: "14px", textAlign: "left"}}>Count</th>
                      <th style={{ border: "1px solid #ddd",padding: "2px 4px",fontSize: "14px", textAlign: "left"}}>Locale</th>
                      <th style={{ border: "1px solid #ddd",padding: "2px 4px",fontSize: "14px", textAlign: "left"}}>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiResponseQuotas.map((group, groupIndex) =>
                      
                      group.map((item) =>
                        item.cells.map((cellId) => {
                          const quota = apiResponseCells[cellId];

                          if (quota) {
                            return (
                              <tr key={`${groupIndex}-${cellId}`} style={{ border: "1px solid #ddd" }}>
                                <td style={{ border: "1px solid #ddd", padding: "2px 4px", fontSize: "14px" }}>
                                  {quota.question}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "2px 4px", fontSize: "14px" }}>
                                  {item.status}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "2px 4px", fontSize: "14px" }}>
                                  {item.count}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "2px 4px", fontSize: "14px" }}>
                                  {quota.locale}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "2px 4px", fontSize: "14px" }}>

                                  {quota.type === "input" && (
                                      Object.values(quota.options) != ''  
                                      ? (
                                          <SoftTypography sx={{ fontSize: "16px",wordWrap: "break-word"}}  variant="body2" >
                                            {Object.values(quota.options).map((value, index) => value).join(",") }
                                          </SoftTypography>)
                                          : (
                                          <SoftTypography sx={{ fontSize: "16px" }}  variant="body2">
                                            {quota.precodes.join(", ")}
                                          </SoftTypography>
                                      )
                                  )}

                                  { quota.type === "radio" && (
                                      Object.values(quota.options) != ''  
                                      ? (
                                        Object.values(quota.options).map((value, index) => (
                                          <SoftTypography sx={{ fontSize: "16px" }} key={index} variant="body2">
                                            {value}
                                          </SoftTypography>
                                        )))
                                      : (
                                          <SoftTypography sx={{ fontSize: "16px" }}  variant="body2">
                                            {quota.precodes.join(", ")}
                                          </SoftTypography>
                                        )
                                    )
                                  }
                                  {quota.type === "checkbox" && (
                                      Object.keys(quota.options).map((key) => (
                                        <SoftTypography sx={{ fontSize:"16px" }} key={key} variant="body2">
                                          {quota.options[key]}
                                        </SoftTypography>
                                      ))
                                  )}
                                  {quota.type === "select" && (
                                    Object.keys(quota.options).map((key) => (
                                      <SoftTypography sx={{ fontSize:"16px" }} key={key} variant="body2">
                                        {quota.options[key]}
                                      </SoftTypography>
                                      ))
                                  )}
                                  {quota.type === "date" && (
                                    Object.keys(quota.options).map((key) => (
                                      <SoftTypography sx={{ fontSize:"16px" }} key={key} variant="body2">
                                        {quota.options[key]}
                                      </SoftTypography>
                                    ))
                                  )}
                                </td>
                              </tr>
                            );
                          }
                          return <tr key={`${groupIndex}-${cellId}`} ></tr>;
                        })
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <p>No Data</p>
              )}
            </SoftBox>
            
            )}
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleCloseModal} color="primary">Cancel</SoftButton>
        </DialogActions>
      </Dialog>

    </SoftBox>
  );
}

ActionCell.propTypes = {
  id: PropTypes.number,
  quest_code: PropTypes.any
};

export default ActionCell;
