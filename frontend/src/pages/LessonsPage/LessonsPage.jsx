import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import TaskCard from "../../components/Lessons/Lesson";
import { coursesAPI, testsAPI } from "../../services/api";
import "./LessonsPage.css";

const COURSE_COLOR_MAP = {
  Русский:    "rgb(157, 125, 252)",
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
  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    coursesAPI.getById(courseId)
      .then(res => setCourse(res.data))
      .catch(() => setCourse(null));
    testsAPI.getByCourse(courseId)
      .then(res => setTasks(res.data.results || res.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div>Загрузка...</div>;
  if (!course) return <div>Курс не найден</div>;

  const color = COURSE_COLOR_MAP[course.title] || "#cccccc";

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="course-page">
          <div className="course-header">
            <div className="subject-avatar" style={{ background: color }}>
              {course.title ? course.title[0] : "?"}
            </div>
            <h1>{course.title}</h1>
          </div>
          <h2>Задания:</h2>
          <div className="tasks-grid">
            {tasks.length === 0 && <div>Нет тестов для этого курса</div>}
            {tasks.map(({ id, title, deadline, points, coins }) => (
              <div className="task-card" key={id}>
                <div className="task-title" style={{ fontWeight: "bold" }}>{title}</div>
                <div style={{ color: "#888" }}>
                  Дедлайн: {deadline ? deadline.slice(0, 10) : "-"}
                </div>
                <div style={{ color: "#888" }}>
                  Баллы: {points} | Монеты: {coins}
                </div>
                <button className="solve-btn" onClick={() => navigate(`/levels?test=${id}`)}>
                  Решать
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
    