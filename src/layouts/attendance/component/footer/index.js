// import PropTypes from 'prop-types';
// import React, { useState, useEffect } from 'react';
// import "./ss.css";



// const Footer = () => (
//   <div className="summary-section">
//     <div className="summary-labels">
//       <span className="label-text">Days</span>
//       <span className="label-text">Hours</span>
//     </div>
//     <div className="summary-items">
//       <div className="summary-item">
//         <span className="text-blue label">Payable Days</span>
//         <span className="text-blue value">2 Days</span>
//       </div>
//       <div className="summary-item">
//         <span className="text-green label">Present</span>
//         <span className="text-green value">0 Days</span>
//       </div>
//       <div className="summary-item">
//         <span className="text-purple label">On Duty</span>
//         <span className="text-purple value">0 Days</span>
//       </div>
//       <div className="summary-item">
//         <span className="text-orange label">Paid leave</span>
//         <span className="text-orange value">0 Days</span>
//       </div>
//       <div className="summary-item">
//         <span className="text-cyan label">Holidays</span>
//         <span className="text-cyan value">0 Days</span>
//       </div>
//       <div className="summary-item">
//         <span className="text-yellow label">Weekend</span>
//         <span className="text-yellow value">2 Days</span>
//       </div>
//     </div>
//     {/* <div className="summary-shift">General [9:00 AM - 6:00 PM]</div> */}
//   </div>
// );


// export default Footer;


// import React from "react";
// import "./ss.css";

// const Footer = () => (
//   <div className="summary-card">
//     <div className="summary-header">
// <div className="summary-col-title days-highlight">Days</div>
//       <div className="summary-col-title">Hours</div>
//     </div>

//     <div className="summary-grid">
//       <div className="summary-grid-item text-blue">
//         <span className="summary-label">Payable Days</span>
//         <span className="summary-badge">2 Days</span>
//       </div>
//       <div className="summary-grid-item text-green">
//         <span className="summary-label">Present</span>
//         <span className="summary-badge">0 Days</span>
//       </div>
//       <div className="summary-grid-item text-purple">
//         <span className="summary-label">On Duty</span>
//         <span className="summary-badge">0 Days</span>
//       </div>
//       <div className="summary-grid-item text-orange">
//         <span className="summary-label">Paid Leave</span>
//         <span className="summary-badge">0 Days</span>
//       </div>
//       <div className="summary-grid-item text-cyan">
//         <span className="summary-label">Holidays</span>
//         <span className="summary-badge">0 Days</span>
//       </div>
//       <div className="summary-grid-item text-yellow">
//         <span className="summary-label">Weekend</span>
//         <span className="summary-badge">2 Days</span>
//       </div>
//     </div>
//   </div>
// );

// export default Footer;


import React, { useState } from "react";
import "./ss.css";

const Footer = () => {
  const [activeTab, setActiveTab] = useState("days");

  // Hourly data (can be dynamic)
  const hourData = {
    total: "01:30",
    payable: "08:00",
    present: "04:15",
    onDuty: "02:00",
    paidLeave: "01:00",
    holidays: "00:45",
  };

  // Convert HH:MM to total minutes
  const convertToMinutes = (hhmm) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    return hh * 60 + mm;
  };

  return (
    <div className="summary-card">
      {/* Toggle Tabs */}
      <div className="summary-tabs">
        <div
          className={`tab ${activeTab === "days" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("days")}
        >
          Days
        </div>
        <div
          className={`tab ${activeTab === "hours" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("hours")}
        >
          Hours
        </div>
        <div
          className={`tab ${activeTab === "minutes" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("minutes")}
        >
          Minutes
        </div>
      </div>

      {/* Day Summary */}
      {activeTab === "days" && (
        <div className="summary-grid">
          <div className="summary-grid-item text-blue">
            <span className="summary-label">Payable Days</span>
            <span className="summary-badge">2 Days</span>
          </div>
          <div className="summary-grid-item text-green">
            <span className="summary-label">Present</span>
            <span className="summary-badge">0 Days</span>
          </div>
          <div className="summary-grid-item text-purple">
            <span className="summary-label">On Duty</span>
            <span className="summary-badge">0 Days</span>
          </div>
          <div className="summary-grid-item text-orange">
            <span className="summary-label">Paid Leave</span>
            <span className="summary-badge">0 Days</span>
          </div>
          <div className="summary-grid-item text-cyan">
            <span className="summary-label">Holidays</span>
            <span className="summary-badge">0 Days</span>
          </div>
          <div className="summary-grid-item text-yellow">
            <span className="summary-label">Weekend</span>
            <span className="summary-badge">2 Days</span>
          </div>
        </div>
      )}

      {/* Hour Summary */}
      {activeTab === "hours" && (
        <div className="summary-grid">
          <div className="summary-grid-item text-yellow">
            <span className="summary-label">Total Hours</span>
            <span className="summary-badge">{hourData.total} Hrs</span>
          </div>
          <div className="summary-grid-item text-green">
            <span className="summary-label">Payable Hours</span>
            <span className="summary-badge">{hourData.payable} Hrs</span>
          </div>
          <div className="summary-grid-item text-cyan">
            <span className="summary-label">Present Hours</span>
            <span className="summary-badge">{hourData.present} Hrs</span>
          </div>
          <div className="summary-grid-item text-purple">
            <span className="summary-label">On Duty</span>
            <span className="summary-badge">{hourData.onDuty} Hrs</span>
          </div>
          <div className="summary-grid-item text-orange">
            <span className="summary-label">Paid Leave</span>
            <span className="summary-badge">{hourData.paidLeave} Hrs</span>
          </div>
          <div className="summary-grid-item text-cyan">
            <span className="summary-label">Holidays</span>
            <span className="summary-badge">{hourData.holidays} Hrs</span>
          </div>
        </div>
      )}

      {/* Minute Summary */}
      {activeTab === "minutes" && (
        <div className="summary-grid">
          <div className="summary-grid-item text-yellow">
            <span className="summary-label">Total Minutes</span>
            <span className="summary-badge">
              {convertToMinutes(hourData.total)} Min
            </span>
          </div>
          <div className="summary-grid-item text-green">
            <span className="summary-label">Payable Minutes</span>
            <span className="summary-badge">
              {convertToMinutes(hourData.payable)} Min
            </span>
          </div>
          <div className="summary-grid-item text-cyan">
            <span className="summary-label">Present Minutes</span>
            <span className="summary-badge">
              {convertToMinutes(hourData.present)} Min
            </span>
          </div>
          <div className="summary-grid-item text-purple">
            <span className="summary-label">On Duty</span>
            <span className="summary-badge">
              {convertToMinutes(hourData.onDuty)} Min
            </span>
          </div>
          <div className="summary-grid-item text-orange">
            <span className="summary-label">Paid Leave</span>
            <span className="summary-badge">
              {convertToMinutes(hourData.paidLeave)} Min
            </span>
          </div>
          <div className="summary-grid-item text-cyan">
            <span className="summary-label">Holidays</span>
            <span className="summary-badge">
              {convertToMinutes(hourData.holidays)} Min
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
