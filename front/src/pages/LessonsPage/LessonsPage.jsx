import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import TaskCard from "../../components/Lessons/Lesson";
import "./LessonsPage.css";

const tasks = [
  {
    title: "Название теста.",
    description: "ЖИ ШИ пиши с буквой И. Часть 1",
    status: "Статус: срочно или не завершен"
  },
  // дублируем для примера
  {}, {}, {}, {}, {}
].map((t, i) => ({
  ...t,
  id: i + 1
}));

const LessonsPage = () => {
  return (
    <div className="layout">
      <Sidebar />


      <div className="content">
        <div className="course-page">
          <div className="course-header">
            <div className="subject-avatar">А</div>
            <h1>Русский язык</h1>
          </div>

          <h2>Задания:</h2>

          <div className="tasks-grid">
            {tasks.map(({ id, title, description, status }) => (
              <TaskCard key={id} title={title} description={description} status={status} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
