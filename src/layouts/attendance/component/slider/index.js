import React , {useState} from "react";
import {
     Card,
     Box,
     Typography,
     Button, 
     TextField,
     MenuItem,
      Dialog,
      DialogActions,
      DialogContent,
      DialogTitle
     } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";



const SliderPanel = () => {

  const [hovered, setHovered] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [startDay, setStartDay] = useState("Same Day");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [endDay, setEndDay] = useState("Same Day");
  const [text1, setText1] = useState("enter");
  const [text2, setText2] = useState("enter");

  const timeOptions = ["08:00 AM", "09:00 AM", "10:00 AM","11:00 AM", "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"];
  const dayOptions = ["Same Day", "Next Day","Previous Day"];
   const handleAddEntryClick = () => setOpenDialog(true);
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
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => {
    console.log("Saved:", { startTime, startDay, endTime, endDay, text1, text2 });
    setIsEditing(false);
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
        {/* <Button size="small" color="primary">Audit History</Button> */}
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
        <Box style={{ display: "grid",
           gridTemplateColumns: "1fr 1fr",
           gap: "16px"
            }}
         >

          {/* Start Time & Day */}
      <Box style={{ display: "flex"
        , gap: "8px" }}>
        <TextField
          select
          size="small"
           style={{ width: "250px" }}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        >
          {timeOptions.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
           style={{ width: "250px" }}
          value={startDay}
          onChange={(e) => setStartDay(e.target.value)}
        >
          {dayOptions.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* End Time & Day */}
      <Box style={{ display: "flex", gap: "8px" }}>
        <TextField
          select
          size="small"
          style={{ width: "250px" }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        >
          {timeOptions.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
         style={{ width: "250px" }}
          value={endDay}
          onChange={(e) => setEndDay(e.target.value)}
        >
          {dayOptions.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Text Fields */}
      <TextField
        size="small"
        multiline
       style={{ width: "510px" }}
      placeholder="Add notes for check-in"
        rows={3}
        value={text1}
        onChange={(e) => setText1(e.target.value)}
      />
      <TextField
        size="small"
        multiline
         style={{ width: "510px" }}
         placeholder="Add notes for check-out"
        rows={3}
        value={text2}
        onChange={(e) => setText2(e.target.value)}
      />

      {/* Save/Cancel Buttons (spanning both columns) */}
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
          style={{ backgroundColor: "#17c1e8", color: "#fff", minWidth: "100px" }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancel} style={{ minWidth: "100px" }}>
          Cancel
        </Button>
      </Box>
    </Box>
  ) : (
    <>
      {/* Card Content */}
      <Box style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Typography style={{ color: "green", fontWeight: "bold" }}>01:24 PM</Typography>
        <LaptopMacIcon fontSize="small" />
      </Box>
      <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <LocationOnIcon fontSize="small" style={{ color: "#999" }} />
        <Typography variant="body2" style={{ color: "#666" }}>ABCD</Typography>
      </Box>
      </>
        )}
    </Card>

      {/* Add Entry and Overtime */}
      <Box style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#17c1e8", color: "#fff" }}
          onClick={handleAddEntryClick}
        >
          Add Entry
        </Button>
        <Button
          variant="outlined"
          style={{ borderColor: "#6c757d", color: "#6c757d" }}
        >
          Add Shift Overtime
        </Button>
      </Box>

     
      {/* Styled Summary Boxes */}
      <Box style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
  {/* First Check-In */}
  <Box
    style={{
      flex: 1,
      padding: "16px",
      borderRadius: "12px",
      background: "#e0f7fa", // Light cyan
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      cursor: "pointer",
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
    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#00796b", marginBottom: "4px" }}>
      First Check-In
    </div>
    <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#004d40" }}>
      01 : 24 PM
    </div>
  </Box>

  {/* Last Check-Out */}
  <Box
    style={{
      flex: 1,
      padding: "16px",
      borderRadius: "12px",
      background: "#ffebee", // Light red
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      cursor: "pointer",
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
    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#c62828", marginBottom: "4px" }}>
      Last Check-Out
    </div>
    <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#b71c1c" }}>
      --
    </div>
  </Box>

  {/* Total Hours */}
  <Box
    style={{
      flex: 1,
      padding: "16px",
      borderRadius: "12px",
      background: "#f3e5f5", // Light purple
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      cursor: "pointer",
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
    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#6a1b9a", marginBottom: "4px" }}>
      Total Hours
    </div>
    <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#4a148c" }}>
      00:00 Hrs
    </div>
  </Box>
</Box>

    </Box>
  );
};

export default SliderPanel;
