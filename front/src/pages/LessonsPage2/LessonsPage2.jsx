import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import TaskCard from "../../components/Lessons2/Lesson2";
import "./LessonsPage2.css";

const LessonsPage = () => {
  const [course, setCourse] = useState({
    name: "Русский язык",
    letter: "А",
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Загрузка заданий (можно заменить на API-запрос)
    setTasks([
      {
        id: 1,
        title: "Название теста.",
        description: "ЖИ ШИ пиши с буквой И. Часть 1",
        status: "Статус: срочно или не завершен",
      },
      {
        id: 2,
        title: "Название теста.",
        description: "ЖИ ШИ пиши с буквой И. Часть 1",
        status: "Статус: срочно или не завершен",
      },
      {
        id: 3,
        title: "Название теста.",
        description: "ЖИ ШИ пиши с буквой И. Часть 1",
        status: "Статус: срочно или не завершен",
      },
      {
        id: 4,
        title: "Название теста.",
        description: "ЖИ ШИ пиши с буквой И. Часть 1",
        status: "Статус: срочно или не завершен",
      },
      {
        id: 5,
        title: "Название теста.",
        description: "ЖИ ШИ пиши с буквой И. Часть 1",
        status: "Статус: срочно или не завершен",
      },
    ]);
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <div className="course-page">
          <div className="course-header">
            <div className="subject-avatar">{course.letter}</div>
            <h1>{course.name}</h1>
          </div>

          <h2>Задания:</h2>

          <div className="tasks-grid">
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
      </div>
    </div>
  );
};

export default LessonsPage;
    