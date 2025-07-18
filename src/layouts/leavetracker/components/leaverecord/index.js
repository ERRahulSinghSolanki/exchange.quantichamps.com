import React from "react";
import { Card, Box, Grid } from "@mui/material";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { useState } from "react";
import LeaveReport from "../leavereport";
import Drawer from "@mui/material/Drawer";
const LeaveRecord = () => {
    const [selectedDate, setSelectedDate] = useState(null);
     const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <Box p={3}>
      
      <Card
        sx={{
          borderRadius: "10px",
          padding: "16px",
          mb: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          border: "0 0 0 4px",
          borderColor: "#3a86ff",
          borderWidth: "0 0 0 10px",
          maxWidth: "350px",
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <SoftTypography variant="button" fontWeight="bold">
              As on <span style={{ fontWeight: "normal" }}>17-Jul-2025</span>
            </SoftTypography>
          </Grid>
          <Grid item>
            <SoftTypography variant="button" color="text" fontWeight="bold">
              Day(s)
            </SoftTypography>
          </Grid>
        </Grid>

        <Box mt={2}>
          <SoftTypography variant="body2" fontWeight="medium">
            Available balance{" "}
            <span style={{ color: "green", float: "right" }}>11</span>
          </SoftTypography>

          <SoftTypography variant="body2" fontWeight="medium" mt={1}>
            Current booking <span style={{ float: "right" }}>1</span>
          </SoftTypography>

          <SoftTypography
            variant="body2"
            fontWeight="medium"
            mt={1}
            sx={{ color: "#007BFF", cursor: "pointer" }}
          >
            Balance after current booking
            <span style={{ float: "right", color: "#007BFF" }}>10</span>
          </SoftTypography>
        </Box>
      </Card>

      
      <Card
        sx={{
          borderRadius: "10px",
          padding: "16px",
          mb: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          border: "0 0 0 4px",
          borderColor: "#3a86ff",
          borderWidth: "0 0 0 10px",
          maxWidth: "350px",
        }}
      >
        <SoftTypography variant="button" fontWeight="bold">
          As on <span style={{ fontWeight: "normal" }}>31-Dec-2025</span>
        </SoftTypography>

        <SoftTypography variant="body2" fontWeight="medium" mt={2}>
          Estimated balance <span style={{ float: "right" }}>10</span>
        </SoftTypography>
      </Card>

    
      <SoftButton variant="outlined" color="info" onClick={() => setDrawerOpen(true)}>
        View Leave Report
      </SoftButton>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
            PaperProps={{
          sx: { width: 550}, 
        }}
        
        >
              <Box p={3} width="550px">
                <LeaveReport />
              </Box>
            </Drawer>
    </Box>
  );
};

export default LeaveRecord;
