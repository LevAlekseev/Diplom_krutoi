// src/pages/LessonsPage/LessonsPage.jsx

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { coursesAPI, testsAPI } from "../../services/api";
import TaskCard from "../../components/Lessons2/Lesson2";
import "./LessonsPage2.css";

const COURSE_COLOR_MAP = {
  Русский:    "#f48fb1",
  Математика: "#f48fb1",
  История:    "#81d4fa",
  Биология:   "#7986cb",
  Физика:     "#c5e1a5",
  Химия:      "#ef9a9a",
  География:  "#ce93d8",
  Английский: "#81c784",
  Чтение:     "#FFD700",
  Рисование:  "#FFB347",
};

const LessonsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    coursesAPI.getById(courseId)
      .then(res => setCourseName(res.data.title))
      .catch(() => setCourseName("Курс"));
    testsAPI.getByCourse(courseId)
      .then(res => setTasks(res.data.results || res.data))
      .catch(() => setTasks([]));
  }, [courseId]);

  const letter = courseName.charAt(0).toUpperCase();
  const color = COURSE_COLOR_MAP[courseName] || "#cccccc";

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="course-page">
          <div className="course-header">
            <div
              className="subject-avatar"
              style={{ backgroundColor: color }}
            >
              {letter}
            </div>
            <h1>{courseName}</h1>
          </div>

          <h2 className="section-title">Задания:</h2>

          <div className="tasks-grid">
            <button className="addtasks" onClick={() => navigate(`/constructor?courseId=${courseId}`)}>
              <h3>Добавить тест</h3>
            </button>
            {tasks.length === 0 && <div>Нет тестов для этого курса</div>}
            {tasks.map(({ id, title, description, status }) => (
              <TaskCard
                key={id}
                title={title}
                description={description}
                status={status}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;