// src/pages/LessonsPage/LessonsPage.jsx

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
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
  // Заглушка: обычно приходит из MainPage через Link state
  const [courseName, setCourseName] = useState("История");
  const [tasks, setTasks] = useState([]);

  // Вычисляем букву и цвет
  const letter = courseName.charAt(0).toUpperCase();
  const color = COURSE_COLOR_MAP[courseName] || "#cccccc";

  useEffect(() => {
    // Заглушка списка заданий
    setTasks([
      {
        id: 1,
        title: "Название теста 1",
        description: "ЖИ ШИ пиши с буквой И. Часть 1",
        status: "Статус: срочно или не завершен",
      },
      {
        id: 2,
        title: "Название теста 2",
        description: "Правописание приставок. Часть 2",
        status: "Статус: не решен",
      },
      {
        id: 3,
        title: "Название теста 3",
        description: "Разбор статистики по тексту. Часть 3",
        status: "Статус: срочно",
      },
      {
        id: 4,
        title: "Название теста 4",
        description: "Синонимы и антонимы. Часть 4",
        status: "Статус: завершен",
      },
      {
        id: 5,
        title: "Название теста 5",
        description: "Пунктуация: запятые. Часть 5",
        status: "Статус: не решен",
      },
    ]);
  }, []);

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
            <button class="addtasks"><h3>Добавить тест</h3></button>
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