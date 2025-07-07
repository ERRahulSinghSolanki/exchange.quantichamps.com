import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import "./ss.css";

// Component for the summary section at the bottom
// const SummarySection = () => (
//   <div className="flex items-end justify-between mt-8 pt-4 border-t border-gray-200">
//     <div className="flex flex-col space-y-2">
//       <span className="text-sm font-semibold text-gray-700">Days</span>
//       <span className="text-sm font-semibold text-gray-700">Hours</span>
//     </div>
//     <div className="flex space-x-4">
//       <div className="flex flex-col items-center">
//         <span className="text-blue-600 text-sm font-semibold">Payable Days</span>
//         <span className="text-lg font-bold text-blue-800">2 Days</span>
//       </div>
//       <div className="flex flex-col items-center">
//         <span className="text-green-600 text-sm font-semibold">Present</span>
//         <span className="text-lg font-bold text-green-800">0 Days</span>
//       </div>
//       <div className="flex flex-col items-center">
//         <span className="text-purple-600 text-sm font-semibold">On Duty</span>
//         <span className="text-lg font-bold text-purple-800">0 Days</span>
//       </div>
//       <div className="flex flex-col items-center">
//         <span className="text-orange-600 text-sm font-semibold">Paid leave</span>
//         <span className="text-lg font-bold text-orange-800">0 Days</span>
//       </div>
//       <div className="flex flex-col items-center">
//         <span className="text-cyan-600 text-sm font-semibold">Holidays</span>
//         <span className="text-lg font-bold text-cyan-800">0 Days</span>
//       </div>
//       <div className="flex flex-col items-center">
//         <span className="text-yellow-600 text-sm font-semibold">Weekend</span>
//         <span className="text-lg font-bold text-yellow-800">2 Days</span>
//       </div>
//       {/* Add more summary items as needed */}
//     </div>
//     <div className="text-sm font-semibold text-gray-700">
//       General [9:00 AM - 6:00 PM]
//     </div>
//   </div>
// );

const SummarySection = () => (
  <div className="summary-section">
    <div className="summary-labels">
      <span className="label-text">Days</span>
      <span className="label-text">Hours</span>
    </div>
    <div className="summary-items">
      <div className="summary-item">
        <span className="text-blue label">Payable Days</span>
        <span className="text-blue value">2 Days</span>
      </div>
      <div className="summary-item">
        <span className="text-green label">Present</span>
        <span className="text-green value">0 Days</span>
      </div>
      <div className="summary-item">
        <span className="text-purple label">On Duty</span>
        <span className="text-purple value">0 Days</span>
      </div>
      <div className="summary-item">
        <span className="text-orange label">Paid leave</span>
        <span className="text-orange value">0 Days</span>
      </div>
      <div className="summary-item">
        <span className="text-cyan label">Holidays</span>
        <span className="text-cyan value">0 Days</span>
      </div>
      <div className="summary-item">
        <span className="text-yellow label">Weekend</span>
        <span className="text-yellow value">2 Days</span>
      </div>
    </div>
    {/* <div className="summary-shift">General [9:00 AM - 6:00 PM]</div> */}
  </div>
);


export default SummarySection;