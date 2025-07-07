// src/layouts/attendance/ShiftSchedule.js
import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const sampleShiftData = [
  { date: "Mon, 21 Apr 2025", shift: "General", time: "09:00 AM - 06:00 PM" },
  { date: "Tue, 22 Apr 2025", shift: "General", time: "09:00 AM - 06:00 PM" },
  { date: "Wed, 23 Apr 2025", shift: "General", time: "09:00 AM - 06:00 PM" },
  { date: "Thu, 24 Apr 2025", shift: "General", time: "09:00 AM - 06:00 PM" },
  { date: "Fri, 25 Apr 2025", shift: "General", time: "09:00 AM - 06:00 PM" },
];

const ShiftSchedule = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={3}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5">My Shift Schedule</SoftTypography>
          </SoftBox>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Shift Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleShiftData.map((shift, index) => (
                  <TableRow key={index}>
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.shift}</TableCell>
                    <TableCell>{shift.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
};

export default ShiftSchedule;
