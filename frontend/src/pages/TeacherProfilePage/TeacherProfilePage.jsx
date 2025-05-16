import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./TeacherProfilePage.css";

const TeacherProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "Иванова Мария П.",
    role: "Учитель математики",
    avatar: "/avatar-teacher.png"
  });

  const [classes, setClasses] = useState([
    { id: 1, name: "1А" },
    { id: 2, name: "2Б" },
    { id: 3, name: "3В" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, student: "Иван Иванов", className: "1А", test: "Алгебра", time: 12, grade: 5 },
    { id: 2, student: "Петр Петров", className: "2Б", test: "Геометрия", time: 15, grade: 4 },
    { id: 3, student: "Мария Сидорова", className: "3В", test: "Математика", time: 9, grade: 5 }
  ]);

//   useEffect(() => {
//     axios.get("/api/teacher/profile")
//       .then(({ data }) => setProfile({ name: data.name, role: data.role, avatar: data.avatarUrl }))
//       .catch(() => {});

//     axios.get("/api/teacher/classes")
//       .then(({ data }) => Array.isArray(data) && setClasses(data))
//       .catch(() => {});

//     axios.get("/api/teacher/notifications")
//       .then(({ data }) => Array.isArray(data) && setNotifications(data))
//       .catch(() => {});
//   }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="content teacher-profile-content">
        <div className="profile-card">
          <img src={profile.avatar} alt="Аватар преподавателя" className="avatar-img" />
          <div className="profile-info">
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-role">{profile.role}</p>
          </div>
        </div>

        <h2 className="section-title">Мои классы</h2>
        <div className="classes-block">
          {classes.map(({ id, name }) => (
            <button key={id} className="class-btn">
              {name}
            </button>
          ))}
        </div>

        <h2 className="section-title">Уведомления</h2>
        <div className="notifications-block">
          {notifications.map(({ id, student, className, test, time, grade }) => (
            <div className="notification-item" key={id}>
              <div className="uvedos">
                <b>{student}</b> из класса {className} выполнил тест <b>{test}</b> за {time} минут и получил оценку <b>{grade}</b>.
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherProfilePage;