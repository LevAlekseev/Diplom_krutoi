import React, { useEffect, useState } from "react";
import "./MainPageCSS2.css";
import "./MainPageContentCSS2.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useAuth } from "../../contexts/AuthContext";
import { teacherAPI } from "../../services/api";

const COURSE_COLOR_MAP = {
  "Русский": "#9d7dfc",
  "Математика": "#f48fb1",
  "История": "#81d4fa",
  "Биология": "#7986cb",
  "Физика": "#c5e1a5",
  "Химия": "#ef9a9a",
  "География": "#ce93d8",
  "Английский": "#81c784",
  "Чтение": "#FFD700",
  "Рисование": "#FFB347"
};

const MainPage2 = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    teacherAPI.getMyCourses()
      .then(res => {
        const courseList = res.data.results || res.data;
        setCourses(courseList.map(course => ({
          id: course.id,
          letter: course.title[0].toUpperCase(),
          name: course.title,
          color: COURSE_COLOR_MAP[course.title] || "#9d7dfc",
        })));
      })
      .catch(() => setCourses([]));
  }, []);

  const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
  const greeting = fullName ? `Здравствуйте, ${fullName}!` : 'Здравствуйте!';

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="header">
          <h1>{greeting}</h1>
        </div>
        <div className="courses">
          <h2>Ваши курсы</h2>
          <div className="courses-grid">
            {courses.map(({ id, letter, name, color }) => (
              <CourseCard key={id} id={id} letter={letter} name={name} color={color} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage2;
