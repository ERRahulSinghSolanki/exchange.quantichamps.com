import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";




const SliderPanel = ({ status }) => {

  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [startDay, setStartDay] = useState("Same Day");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [endDay, setEndDay] = useState("Same Day");
  const [text1, setText1] = useState("enter");
  const [text2, setText2] = useState("enter");
  // 🆕 Overtime logic
  const [showOvertime, setShowOvertime] = useState(false);
  const [overtimeStart, setOvertimeStart] = useState("");
  const [overtimeEnd, setOvertimeEnd] = useState("");
  const [overtimeNote, setOvertimeNote] = useState("");
  const timeOptions = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];
  const dayOptions = ["Same Day", "Next Day", "Previous Day"];
  // Separate states for Add Entry form
  const [newStartTime, setNewStartTime] = useState("9:00AM");
  const [newStartDay, setNewStartDay] = useState("Same Day");
  const [newEndTime, setNewEndTime] = useState("6:00PM");
  const [newEndDay, setNewEndDay] = useState("Same Day");
  const [newText1, setNewText1] = useState("");
  const [newText2, setNewText2] = useState("");

  // add entry form logic
  const handleAddEntryClick = () => {
    // Close edit mode if open
    setIsEditing(false);

    // Open Add Entry form
    setShowAddForm(true);

    // Reset Add Entry fields (used only for add form, not edit)
    setNewStartTime("9:00AM");
    setNewStartDay("Same Day");
    setNewEndTime("6:00PM");
    setNewEndDay("Same Day");
    setNewText1("");
    setNewText2("");
  //  added
    setShowOvertime(false);
    setOvertimeStart("");
    setOvertimeEnd("");
    setOvertimeNote("");
  };

  const handleDialogClose = () => setOpenDialog(false);


  // Common badge box style
  const badgeBoxStyle = {
    padding: "10px 12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 0 3px rgba(0,0,0,0.1)",
    textAlign: "center",
    flex: 1,
  };

  const labelStyle = {
    fontSize: "0.75rem",
    color: "#6c757d",
    marginBottom: "4px",
  };

  const valueStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
  };
  const [isPanelOpen, setIsPanelOpen] = useState(true);  // Set default to 'true' to keep it open initially.

  const handleCancel = () => {
    setIsEditing(false);
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (showAddForm) {
      const newEntry = {
        startTime: newStartTime,
        startDay: newStartDay,
        endTime: newEndTime,
        endDay: newEndDay,
        text1: newText1,
        text2: newText2,
    //  added this 
      ...(showOvertime && {
        overtimeStart,
        overtimeEnd,
        overtimeNote,
      }),
      };
      console.log("New Entry Added:", newEntry);
      setShowAddForm(false);
    } else if (isEditing) {
      const editedEntry = {
        startTime,
        startDay,
        endTime,
        endDay,
        text1,
        text2,
      };
      console.log("Edited Entry Saved:", editedEntry);
      setIsEditing(false);
    }
  };

  const handleClosePanel = () => {
    // Close the panel (this could be a simple state to hide the slider panel)
    console.log("Closing the panel...");
    setIsEditing(false);  // Close the editing mode if panel is closed
  };

  return (
    <Box style={{ padding: "24px" }}>

      {/* Top Header */}
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Typography variant="h6">
          Thu, 10 Jul 2025{" "}
          <Typography
            variant="subtitle2"
            component="span"
            style={{ color: "#6c757d", fontSize: "0.9rem" }}
          >
            • General [9:00 AM - 6:00 PM]
          </Typography>
        </Typography>
        <IconButton onClick={handleClosePanel} style={{ color: "gray" }} />
      </Box>

      {/* Entry Card */}
      <Card
        variant="outlined"
        style={{
          padding: "16px",
          marginBottom: "16px",
          position: "relative",
          transition: "box-shadow 0.3s ease",
          boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Edit/Delete Icons */}
        {hovered && (
          <Box
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              display: "flex",
              gap: "8px",
              zIndex: 1,
            }}
          >
            <IconButton
              size="small"
              style={{
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                padding: "6px",
                transition: "all 0.2s ease",
              }}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon style={{ color: "#1976d2", fontSize: "18px" }} />
            </IconButton>
            <IconButton
              size="small"
              style={{
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                padding: "6px",
                transition: "all 0.2s ease",
              }}
            >
              <DeleteIcon style={{ color: "#d32f2f", fontSize: "18px" }} />
            </IconButton>
          </Box>
        )}

        {/* Editable Form */}
        {isEditing ? (
          // 🟩 Use design like first screenshot (Edit Mode)
          <Box style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Box style={{
              display: "flex", gap: "8px", wordWrap: "break-word",           // 💡 Ensures text wraps on smaller screens
              whiteSpace: "normal",
            }}>
              <TextField
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                size="small"
                placeholder="Start Time"
                fullWidth

              />
              <TextField
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                size="small"
                placeholder="Start Day"
                fullWidth
              />
            </Box>
            <Box style={{ display: "flex", gap: "8px" }}>
              <TextField
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                size="small"
                placeholder="End Time"
                fullWidth

              />
              <TextField
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                size="small"
                placeholder="End Day"
                fullWidth

              />
            </Box>
            <Box style={{ display: "flex", gap: "8px" }}>
              <TextField
                multiline
                rows={3}
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter notes for check-in"
                fullWidth
              />
              <TextField
                multiline
                rows={3}
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter notes for check-out"
                fullWidth
              />
            </Box>
             {/* 🆕 Overtime Toggle */}
        <Box mb={2}>
          <Button
            variant="outlined"
            onClick={() => setShowOvertime(!showOvertime)}
            sx={{
              borderColor: "#17c1e8",
              color: "#17c1e8",
              textTransform: "none",
            }}
          >
            {showOvertime ? "Remove Overtime" : "Add Overtime"}
          </Button>
        </Box>

        {/* 🆕 Overtime Fields */}
       {showOvertime && (
  <Box mt={2} mb={2} p={2} sx={{ backgroundColor: "#f3f3ff", borderRadius: 2 }}>
    <Box display="flex" gap={2} mb={2}>
      <TextField
        fullWidth
        size="medium"
        // label="Overtime Start"
        placeholder="Overtime Start"
        value={overtimeStart}
        onChange={(e) => setOvertimeStart(e.target.value)}
      />
      <TextField
        fullWidth
        size="medium"
        // label="Overtime End"
        placeholder="Overtime End"
        value={overtimeEnd}
        onChange={(e) => setOvertimeEnd(e.target.value)}
      />
    </Box>

    <TextField
      fullWidth
      multiline
      rows={2}
      // label="Overtime Notes"
      placeholder="Overtime Notes"
      value={overtimeNote}
      onChange={(e) => setOvertimeNote(e.target.value)}
    />
  </Box>
)}
            <Box style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#17c1e8", color: "#fff", minWidth: "100px" }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancel} style={{ minWidth: "100px", color: "#666" }}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {/* Card Content */}
            <Box style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Typography style={{ color: "green" }}>01:24 PM</Typography>
              <LaptopMacIcon fontSize="small" />
            </Box>
            <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <LocationOnIcon fontSize="small" style={{ color: "#999" }} />
              <Typography variant="body2" style={{ color: "#666" }}>ABCD</Typography>
            </Box>
          </>
        )}
      </Card>
      {/* add entry data  */}
      {showAddForm && (
        <Card
          variant="outlined"
          style={{
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
          }}
        >
          <Box style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Start Time & Day Dropdowns */}
            <Box style={{ display: "flex", gap: "8px" }}>
              <TextField
                select
                size="small"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
              >
                {timeOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                fullWidth
              >
                {dayOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* End Time & Day Dropdowns */}
            <Box style={{ display: "flex", gap: "8px" }}>
              <TextField
                select
                size="small"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
              >
                {timeOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                fullWidth
              >
                {dayOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Check-in Note */}
            <Box style={{ display: "flex", gap: "8px" }}>
              <TextField
                size="small"
                multiline
                rows={3}
                placeholder="Add notes for check-in"
                value={newText1}
                onChange={(e) => setNewText1(e.target.value)}
                fullWidth
              />

              {/* Check-out Note */}
              <TextField
                size="small"
                multiline
                rows={3}
                placeholder="Add notes for check-out"
                value={newText2}
                onChange={(e) => setNewText2(e.target.value)}
                fullWidth
              />
            </Box>


            {/* Save / Cancel Buttons */}
            <Box
              style={{
                gridColumn: "span 2",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#17c1e8", color: "#fff" }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button variant="outlined" style={{ color: "#666" }} onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Card>
      )}


      {/* Add Entry  */}
      <Box style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#17c1e8", color: "#fff" }}
          onClick={handleAddEntryClick}
        >
          Add Entry
        </Button>
      </Box>
      {/* Absent Notice Card */}
      {status === "Absent" && (
        <Card
          variant="outlined"
          style={{
            padding: "32px 24px",
            textAlign: "center",
            marginBottom: "32px",
            backgroundColor: "#fffff",
            // border: "1px solidrgb(245, 233, 237)",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: "#666",
              marginBottom: "20px",
              fontWeight: 400,
              fontSize: "1.25rem",
              wordWrap: "break-word",   // 💡 Ensures text wraps on smaller screens
              whiteSpace: "normal"
            }}
          >
            You were marked absent for the day
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
          }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#17c1e8", color: "#fff",
                // padding: "10px 8px",
                fontSize: "0.95rem",
                fontWeight: 500,
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                padding: "6px 24px",           // ⬅️ Keeps width compact
                minWidth: "fit-content",       // ⬅️ Prevents stretching
                maxWidth: "100%",
              }}           // ⬅️ Prevents overflow on very small screens}}
              onClick={() => console.log("Apply Leave Clicked")}
            >
              Apply Leave
            </Button>
          </Box>
        </Card>
      )}

      {/* Styled Summary Boxes */}
      <Box style={{ display: "flex",
        //  position: "fixed",         // 🔒 Fixes it to the screen
    bottom: "16px",            // Distance from bottom of screen
    left: "24px",
    right: "24px",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    zIndex: 999,               // Lower than dropdowns (e.g., dropdowns use 1300–2000)
    padding: "12px",
    borderRadius: "8px",
     }}>
        {/* First Check-In */}
        <Box
          style={{
            flex: 1, padding: "16px", borderRadius: "12px", background: "#e0f7fa",
          textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
          }}
        >

          <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#00796b", }}>
            First Check-In
          </div>
          <div style={{ fontSize: "0.875rem", color: "#004d40" }}>
            01 : 24 PM
          </div>
        </Box>

        {/* Last Check-Out */}
        <Box
          style={{
            flex: 1, padding: "16px", borderRadius: "12px", background: "#ffebee",
          textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#c62828" }}>
            Last Check-Out
          </div>
          <div style={{ fontSize: "0.875rem", color: "#b71c1c" }}>
            --
          </div>
        </Box>

        {/* Total Hours */}
        <Box
          style={{
            flex: 1, padding: "16px", borderRadius: "12px", background: "#f3e5f5",
          textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#6a1b9a"}}>
            Total Hours
          </div>
          <div style={{ fontSize: "0.875rem", color: "#4a148c" }}>
            00:00 Hrs
          </div>
        </Box>
      </Box>
    </Box>
  );
};
SliderPanel.propTypes = {
  status: PropTypes.string,
};


export default SliderPanel;
