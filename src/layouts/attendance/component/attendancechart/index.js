import React from "react";
import PropTypes from "prop-types";
import "./attendancechart.css";

const AttendanceRow = ({ record }) => {
  return (
    <div className="row-container">
      <div className="day-column">
        <b>{record.day}</b>
        <div>{record.date}</div>
      </div>

      <div className="checkin-column">  
        {record.checkIn && <b>{record.checkIn}</b>}
        {record.lateBy && (
          <div style={{ color: "orange", fontSize: "12px" }}>
            Late by {record.lateBy}
          </div>
        )}
      </div>

      <div className="timeline-column">
        <div className="timeline-track">
          <span className="dot" />
          <div className="timeline-line">
            <span className="status-label">{record.status}</span>
          </div>
          <span className="dot" />
        </div>
      </div>

      <div className="checkout-column">
        {record.checkOut && <b>{record.checkOut}</b>}
      </div>

      <div className="hours-column">
        <b>{record.hoursWorked}</b>
        <div style={{ fontSize: "12px" }}>Hrs worked</div>
      </div>
    </div>
  );
};

// ✅ Add PropTypes validation
AttendanceRow.propTypes = {
  record: PropTypes.shape({
    day: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    checkIn: PropTypes.string,
    lateBy: PropTypes.string,
    status: PropTypes.string.isRequired,
    checkOut: PropTypes.string,
    hoursWorked: PropTypes.string.isRequired,
  }).isRequired,
};

const attendanceData = [
  {
    day: "Wed",
    date: "25",
    checkIn: "",
    lateBy: "",
    status: "Absent",
    checkOut: "",
    hoursWorked: "00:00",
  },
  {
    day: "Thu",
    date: "26",
    checkIn: "07:24 PM",
    lateBy: "10:24",
    status: "Absent",
    checkOut: "07:39 PM",
    hoursWorked: "00:15",
  },
  {
    day: "Fri",
    date: "27",
    checkIn: "10:16 AM",
    lateBy: "01:16",
    status: "Absent",
    checkOut: "",
    hoursWorked: "00:00",
  },
];

const AttendanceChart = () => {
  return (
    <div>
      {attendanceData.map((record, index) => (
        <AttendanceRow key={index} record={record} />
      ))}
    </div>
  );
};

export default AttendanceChart;