import React, { useEffect, useState } from "react";
import "./MainPageCSS2.css";
import "./MainPageContentCSS2.css";
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
          <h1>Здравствуйте, {user.name}</h1>
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
