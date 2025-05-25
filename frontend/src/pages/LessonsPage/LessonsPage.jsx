import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./LessonsPage.css";

// Импорт API
import { coursesAPI, testsAPI } from "../../services/api";

const COURSE_COLOR_MAP = {
  Русский: "rgb(157, 125, 252)",
  Математика: "#f48fb1",
  История: "#81d4fa",
  Биология: "#7986cb",
  Физика: "#c5e1a5",
  Химия: "#ef9a9a",
  География: "#ce93d8",
  Английский: "#81c784",
  Чтение: "#FFD700",
  Рисование: "#FFB347",
};

const LessonsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTests, setCompletedTests] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Получаем курс
    coursesAPI.getById(courseId)
      .then(res => {
        if (isMounted) setCourse(res.data);
      })
      .catch(() => {
        if (isMounted) setCourse(null);
      });

    // Получаем тесты по курсу
    testsAPI.getByCourse(courseId)
      .then(res => {
        const testsData = res.data?.results || res.data;
        if (isMounted) setTasks(testsData);
      })
      .catch(() => {
        if (isMounted) setTasks([]);
      });

    // Получаем результаты пользователя
    testsAPI.getMyResults()
      .then(res => {
        const resultsData = res.data?.results || res.data;
        const completedIds = new Set(resultsData.map(result => result.test.id));
        if (isMounted) setCompletedTests(completedIds);
      })
      .catch(() => {
        if (isMounted) setCompletedTests(new Set());
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (loading) return <div>Загрузка...</div>;
  if (!course) return <div>Курс не найден</div>;

  const color = COURSE_COLOR_MAP[course.title] || "#cccccc";

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="course-page">
          {/* Заголовок курса с иконкой */}
          <div className="course-header">
            <div className="subject-avatar" style={{ background: color }}>
              {course.title ? course.title[0] : "?"}
            </div>
            <h1>{course.title}</h1>
          </div>

          {/* Блок с тестами */}
          <div className="tasks-section">
            <div
              className={`tasks-grid ${tasks.length === 1 ? "tasks-grid--single" : ""}`}
            >
              {tasks.map((test) => {
                const isCompleted = completedTests.has(test.id);
                return (
                  <div className="task-card" key={test.id}>
                    <div className="task-title">{test.title}</div>
                    <div className="task-info">
                      Дедлайн: {test.deadline ? test.deadline.slice(0, 10) : "-"}
                    </div>
                    <div className="task-info">
                      Баллы: {test.points} | Монеты: {test.coins}
                    </div>
                    <button
                      className={`solve-btn ${isCompleted ? "solve-btn-disabled" : ""}`}
                      onClick={() => !isCompleted && navigate(`/levels?test=${test.id}`)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? "Пройдено" : "Решать"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
