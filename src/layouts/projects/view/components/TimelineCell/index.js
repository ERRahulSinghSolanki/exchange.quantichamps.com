// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import PropTypes from "prop-types";

import TimelineList from "examples/Timeline/TimelineList";
import TimelineItem from "examples/Timeline/TimelineItem";

// Data
import timelineData from "layouts/pages/projects/timeline/data/timelineData";

function Timeline({title}) {
  const renderTimelineItems = timelineData.map(
    ({ color, icon, title, dateTime, description, badges, lastItem }) => (
      <TimelineItem
        key={title + color}
        color={color}
        icon={icon}
        title={title}
        dateTime={dateTime}
        description={description}
        badges={badges}
        lastItem={lastItem}
      />
    )
  );

  return (
      <SoftBox>
        <TimelineList title={title}>
          {renderTimelineItems}
        </TimelineList>
      </SoftBox>
  );
}

Timeline.propTypes = {
  title: PropTypes.any
};

export default Timeline;
