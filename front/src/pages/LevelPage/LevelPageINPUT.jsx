import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const stats = [
    { label: "Рейтинг в классе", value: "1 / 52" },
    { label: "Валюта", value: "9329" },
    { label: "Очки", value: "5000" },
  ];

  const diary = [
    { subject: "Русский язык", grades: [4, 5, 3, 4, 5, 3, 4, 5] },
    { subject: "Математика", grades: [5, 3, 4, 5, 3, 4, 5] },
    { subject: "Чтение", grades: [4, 5, 3, 4, 5] },
    { subject: "Окружающий мир", grades: [4, 5, 3, 4, 5, 3, 4, 5] },
    {}, {}, {}, {}
  ];

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <div className="profile-card">
          <img src="/avatar.png" alt="Аватар" className="avatar-img" />
          <div className="profile-info">
            <h2 className="profile-name">Тигровый Лев</h2>
            <p className="profile-class">1<sup>А</sup> Класс</p>
          </div>
        </div>

        <h2 className="section-title">Достижения</h2>
        <div className="stats-block">
          {stats.map(({ label, value }) => (
            <div className="stat" key={label}>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Дневник</h2>
        <div className="diary-block">
          {diary.map((row, i) => (
            <div className="diary-row" key={i}>
              <div className="diary-subject">{row.subject || "\u00A0"}</div>
              <div className="diary-grades">
                {row.grades?.map((grade, j) => (
                  <span className="grade" key={j}>{grade}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
