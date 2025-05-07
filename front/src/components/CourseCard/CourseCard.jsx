import React from "react";
import "./CourseCard.css"; // можно выделить стили отдельно при желании

const CourseCard = ({ letter, name, color }) => {
  return (
    <div className="course-card">
      <div className="course-avatar" style={{ background: color }}>
        <div className="course-letter">{letter}</div>
        <div className="course-name">{name}</div>
      </div>
    </div>
  );
};

export default CourseCard;
