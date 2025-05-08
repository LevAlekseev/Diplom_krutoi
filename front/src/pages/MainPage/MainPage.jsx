import React, { useEffect, useState } from "react";
import "./MainPageCSS.css";
import "./MainPageContentCSS.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import CourseCard from "../../components/CourseCard/CourseCard";

const Layout = () => {
  const [user, setUser] = useState({
    name: "Тигр",
    rating: "1 / 52",
    points: 5000,
    coins: 9329,
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Здесь будет API-запрос, например, в Supabase
    setCourses([
      { letter: "Р", name: "Русский", color: "#9d7dfc" },
      { letter: "М", name: "Математика", color: "#f48fb1" },
      { letter: "И", name: "История", color: "#81d4fa" },
      { letter: "Б", name: "Биология", color: "#7986cb" },
      { letter: "Ф", name: "Физика", color: "#c5e1a5" },
      { letter: "Х", name: "Химия", color: "#ef9a9a" },
      { letter: "Г", name: "География", color: "#ce93d8" },
      { letter: "А", name: "Английский", color: "#81c784" },
    ]);
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <div className="header">
          <h1>Привет, {user.name}</h1>
        </div>

        <div className="recent">
          <h2>Достижения</h2>

          <div className="stats-block">
            <div className="stat">
              <div className="stat-value">{user.rating}</div>
              <div className="stat-label">Рейтинг в классе</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.coins}</div>
              <div className="stat-label">Валюта</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.points}</div>
              <div className="stat-label">Очки</div>
            </div>
          </div>
        </div>

        <div className="courses">
          <h2>Все курсы</h2>
          <div className="courses-grid">
            {courses.map(({ letter, name, color }) => (
              <CourseCard key={name} letter={letter} name={name} color={color} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
