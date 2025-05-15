import React, { useEffect, useState } from "react";
import { authAPI } from "../../services/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getProfile()
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.warn("Ошибка загрузки профиля:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <div>Загрузка...</div>;

  return (
    <div className="layout">
      <Sidebar />
      <main className="content profile-content">
        <h1 className="section-title">Профиль</h1>
        <div className="profile-card">
          <img src="/avatar.png" alt="Аватар" className="avatar-img" />
          <div className="profile-info">
            <h2 className="profile-name">{profile.first_name} {profile.last_name}</h2>
            <p className="profile-class">{profile.school_class} класс</p>
          </div>
        </div>
        <h2 className="section-title">Достижения</h2>
        <div className="stats-block">
          <div className="stat">
            <div className="stat-value">{profile.rating}</div>
            <div className="stat-label">Рейтинг в классе</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.coins}</div>
            <div className="stat-label">Валюта</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.points}</div>
            <div className="stat-label">Очки</div>
          </div>
        </div>
        <h2 className="section-title">Дневник</h2>
        <div className="diary-block">
          {(profile.diary || []).map((row, i) => (
            <div className="diary-row" key={i}>
              <div className="diary-subject">{row.subject || "\u00A0"}</div>
              <div className="diary-grades">
                {(row.grades || []).map((grade, j) => (
                  <span className={`grade grade-${grade}`} key={j}>
                    {grade}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h2 className="section-title">Топ класса</h2>
        <div className="top-block">
          {(profile.top || []).map(({ rank, name, points }, idx) => (
            <div
              key={idx}
              className={`top-row ${rank <= 3 ? 'top-highlight top-'+rank : ''}`}
            >
              <span className="top-rank">{rank}</span>
              <span className="top-name">{name}</span>
              <span className="top-points">{points}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
