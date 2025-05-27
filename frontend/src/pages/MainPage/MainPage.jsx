import React, { useEffect, useState } from "react";
import "./MainPageCSS.css";
import "./MainPageContentCSS.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useAuth } from "../../contexts/AuthContext";
import { coursesAPI, teacherAPI } from "../../services/api";

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

const MainPage = () => {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        let res;
        if (user.role === 'teacher') {
          res = await teacherAPI.getMyCourses();
        } else {
          res = await coursesAPI.getMyCourses();
        }
        const courseList = res.data.results || res.data;
        setCourses(courseList.map(course => ({
          id: course.id,
          letter: course.title[0].toUpperCase(),
          name: course.title,
          color: COURSE_COLOR_MAP[course.title] || "#9d7dfc",
        })));
      } catch {
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  if (loading || !user || coursesLoading) return <div>Загрузка...</div>;

  // Для учителя — другое приветствие
  const isTeacher = user.role === 'teacher';
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="header">
          <h1>{isTeacher ? `Здравствуйте, ${fullName}` : `Привет, ${user.first_name ? user.first_name : (user.username || user.email)}`}</h1>
        </div>
        <div className="recent">
          <h2>Достижения</h2>
          <div className="stats-block">
            <div className="stat">
              <div className="stat-value">{user.rating || "-"}</div>
              <div className="stat-label">Рейтинг в классе</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.coins || 0}</div>
              <div className="stat-label">Валюта</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.points || 0}</div>
              <div className="stat-label">Очки</div>
            </div>
          </div>
        </div>
        <div className="courses">
          <h2>{isTeacher ? 'Курсы, которые вы ведёте' : 'Мои курсы'}</h2>
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

export default MainPage;
