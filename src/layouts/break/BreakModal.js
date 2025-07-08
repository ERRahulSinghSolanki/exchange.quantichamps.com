import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

const BreakModal = ({ open, timer, onEndBreak, initialBreakDuration }) => {
  const [isEnding, setIsEnding] = useState(false);

  // 🧠 Format time into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ⏳ Remaining = total - elapsed
  const remainingSeconds = Math.max(initialBreakDuration - timer, 0);

  const handleEndBreak = async () => {
    try {
      setIsEnding(true);
      const elapsedSeconds = timer;

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      await onEndBreak(elapsedSeconds); // Send to parent to handle state reset
    } catch (error) {
      console.error("❌ Failed to end break:", error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <Modal open={open} onClose={() => {}} disableEscapeKeyDown>
      <SoftBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgColor="white"
        p={4}
        borderRadius="lg"
        boxShadow="xl"
        sx={{
          width: "400px",
          margin: "auto",
          mt: "15vh",
          outline: "none",
          zIndex: 2000,
        }}
      >
        <SoftTypography variant="h4" fontWeight="bold" gutterBottom>
          ⏸️ You are on a break
        </SoftTypography>

        <SoftTypography variant="h1" fontWeight="medium" color="info" mb={2}>
          ⏱ {formatTime(timer)}
        </SoftTypography>

        <SoftTypography variant="body2" color="secondary" mb={3}>
          Remaining Break Time:{" "}
          <strong>{formatTime(remainingSeconds)}</strong>
        </SoftTypography>

        <SoftBox display="flex" justifyContent="center">
          <SoftButton
            color="error"
            onClick={handleEndBreak}
            size="medium"
            disabled={isEnding}
          >
            {isEnding ? "Ending Break..." : "End Break"}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </Modal>
  );
};

BreakModal.propTypes = {
  open: PropTypes.bool.isRequired,
  timer: PropTypes.number.isRequired,
  onEndBreak: PropTypes.func.isRequired,
  initialBreakDuration: PropTypes.number.isRequired,
};

export default BreakModal;
