import React from "react";
import "./Lesson2.css";

const TaskCard = ({ title, description, status }) => {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="status">{status}</span>
      <button className="solve-btn">Редактировать</button>
    </div>
  );
};

export default TaskCard;
