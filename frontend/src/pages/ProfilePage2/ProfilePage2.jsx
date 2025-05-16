import React, { useEffect, useState } from "react";
import { authAPI } from "../../services/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserProfileCard from "../../components/UserProfileCard";
import "./ProfilePage2.css";

const ProfilePage2 = () => {
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
        <h1 className="section-title">Профиль преподавателя</h1>
        <UserProfileCard 
          first_name={profile.first_name} 
          last_name={profile.last_name} 
          school_class={profile.school_class} 
        />
        <h2 className="section-title">Статистика</h2>
        <div className="stats-block">
          <div className="stat">
            <div className="stat-value">{profile.rating || "-"}</div>
            <div className="stat-label">Рейтинг</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.coins || 0}</div>
            <div className="stat-label">Валюта</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.points || 0}</div>
            <div className="stat-label">Очки</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage2;
