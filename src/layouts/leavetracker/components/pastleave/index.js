import "../leavesummary/index.css";
import LeaveRow from "../data/index";

const PastLeaveSection = () =>{
    return(
        <div className="upcoming-section">
              <div className="upcoming-header">
                <select className="dropdown">
                  <option>Past Leave & Holidays</option>
                  <option>Past Leave</option>
                  <option>Past Holidays</option>
                </select>
              </div>
              {/* <div className="no-data-illustration">
                <img src="https://placehold.co/200x150/E0E7FF/4F46E5?text=No+Data" alt="No data found" />
                <p>No Data Found</p>
              </div> */}
              <LeaveRow />
            </div>
    );
};

export default PastLeaveSection;