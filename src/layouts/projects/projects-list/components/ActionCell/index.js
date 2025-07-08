import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { API_URL } from "config";

const token = localStorage.getItem("authToken");

const renderPrecodedValues = (precodes) => {
  if (Array.isArray(precodes)) return precodes.join(", ");
  if (typeof precodes === "object" && precodes !== null) return Object.values(precodes).join(", ");
  return "";
};

function ActionCell({ id, quest_code }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiResponseQuotas, setApiResponseQuotas] = useState([]);
  const [quotasCount, setQuotasCount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();

  const handleOpen = async () => {
    setIsModalOpen(true);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/surveys/${id}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setApiResponse(data); // Store full response with .questions and .cells
      setApiResponseQuotas(data.quotas || []);
    } catch (error) {
      setError(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const syncQuestion = async (event) => {
    const attributeId = event.target.getAttribute('data-attribute_id');
    try {
      await fetch(`${API_URL}/questions/sync?attribute_id=${attributeId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOpen();
    } catch (error) {
      setError(error.message || "Unknown error");
    }
  };

  useEffect(() => {
    let total = 0;
    if (Array.isArray(apiResponseQuotas)) {
      apiResponseQuotas.forEach((q) => {
        if (Array.isArray(q)) {
          q.forEach((item) => total += item.count || 0);
        } else {
          total += q.count || 0;
        }
      });
    }
    setQuotasCount(total);
  }, [apiResponseQuotas]);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const handleView = () => navigate(`/projects/view/${id}`);

  return (
    <SoftBox display="flex" alignItems="center">
      <Tooltip title="Screener Preview">
        <SoftTypography variant="body1" color="info" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={handleOpen}>
          <Icon>visibility</Icon>
        </SoftTypography>
      </Tooltip>

      <Tooltip title="Project Preview">
        <SoftTypography variant="body1" mx={1} color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }} onClick={handleView}>
          <Icon>visibility</Icon>
        </SoftTypography>
      </Tooltip>

      <Tooltip title="Edit Project">
        <SoftTypography variant="body1" mr={1} color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
          <Icon>edit</Icon>
        </SoftTypography>
      </Tooltip>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        PaperProps={{ sx: { width: '70vw', height: '85vh', maxWidth: 'none', padding: '0px 10px' } }}
      >
        <DialogTitle sx={{ textAlign: "center", fontSize: "22px" }}>
          Screener Preview
          <SoftBox mt={1} color="primary" fontWeight="medium" sx={{ fontSize: "18px", textAlign: "left" }}>
            <span style={{ color: "#344767" }}>Quantish Code:</span> {quest_code} | <span style={{ color: "#344767" }}>Quotas Count:</span> {quotasCount}
          </SoftBox>
        </DialogTitle>

        <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ height: '35px', minHeight: '35px' }}>
          <Tab label="Screeners" sx={{ minHeight: '35px' }} />
          <Tab label="Quotas" sx={{ minHeight: '35px' }} />
        </Tabs>

        <DialogContent>
          {loading ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress size={70} />
            </SoftBox>
          ) : error ? (
            <SoftBox display="flex" justifyContent="center" alignItems="center" height="420px">
              <div>Error: {error}</div>
            </SoftBox>
          ) : tabIndex === 0 ? (
            apiResponse?.questions && Object.entries(apiResponse.questions).map(([key, questionData]) => (
              <SoftBox key={key} mt={2}>
                <SoftTypography sx={{ fontSize: "15px", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                  <Icon sx={{ mr: 1 }} color="primary">circle</Icon>
                  {questionData.question}
                  {!questionData.options && !questionData.precodes && (
                    <Icon sx={{ ml: 1 }} color="primary" data-attribute_id={questionData.client_question_id} onClick={syncQuestion}>refresh</Icon>
                  )}
                </SoftTypography>

                <SoftBox mt={1} ml={3}>
                  {["input", "radio"].includes(questionData.type) ? (
                    Object.values(questionData.options || {}).length > 0 ? (
                      Object.values(questionData.options).map((val, i) => (
                        <SoftTypography key={i} sx={{ fontSize: "16px" }}>{val || renderPrecodedValues(questionData.precodes)}</SoftTypography>
                      ))
                    ) : (
                      <SoftTypography sx={{ fontSize: "16px" }}>{renderPrecodedValues(questionData.precodes)}</SoftTypography>
                    )
                  ) : (
                    Object.entries(questionData.options || {}).map(([key, val]) => (
                      <SoftTypography key={key} sx={{ fontSize: "16px" }}>{val}</SoftTypography>
                    ))
                  )}
                </SoftBox>
              </SoftBox>
            ))
          ) : (
            <SoftBox mt={2}>
              {apiResponseQuotas.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Question</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Count</th>
                      <th style={thStyle}>Locale</th>
                      <th style={thStyle}>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiResponseQuotas.flatMap((item, index) => {
                      // Type 1: Array of quota sets with cell IDs
                      if (Array.isArray(item)) {
                        return item.flatMap((q, subIndex) =>
                          q.cells.map((cellId, cellIdx) => {
                            const questionData = apiResponse?.cells?.[cellId];
                            const question = questionData?.question || "—";
                            const options = questionData?.options ? Object.values(questionData.options).join(", ") : "";
                            const precodes = questionData?.precodes ? renderPrecodedValues(questionData.precodes) : "";
                            const locale = questionData?.locale || "—";
                            return (
                              <tr key={`${index}-${subIndex}-${cellIdx}`}>
                                <td style={tdStyle}>{question}</td>
                                <td style={tdStyle}>{q.status}</td>
                                <td style={tdStyle}>{q.count}</td>
                                <td style={tdStyle}>{locale}</td>
                                <td style={tdStyle}>{options || precodes || "—"}</td>
                              </tr>
                            );
                          })
                        );
                      }

                      // Type 2: Flat object quota
                      return (
                        <tr key={index}>
                          <td style={tdStyle}>{item.question}</td>
                          <td style={tdStyle}>{item.status}</td>
                          <td style={tdStyle}>{item.count}</td>
                          <td style={tdStyle}>{item.locale}</td>
                          <td style={tdStyle}>{item.options}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : <p>No Data</p>}
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

const thStyle = {
  border: "1px solid #ddd",
  padding: "4px 6px",
  fontSize: "14px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "4px 6px",
  fontSize: "14px",
};

ActionCell.propTypes = {
  id: PropTypes.number.isRequired,
  quest_code: PropTypes.any,
};

export default ActionCell;
