import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css"; // можно выделить стили отдельно при желании

const CourseCard = ({ letter, name, color, id }) => {
  return (
    <Link to={`/lessons/${id}`} style={{ textDecoration: 'none' }}>
      <div className="course-card">
        <div className="course-avatar" style={{ background: color }}>
          <div className="course-letter">{letter}</div>
          <div className="course-name">{name}</div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
