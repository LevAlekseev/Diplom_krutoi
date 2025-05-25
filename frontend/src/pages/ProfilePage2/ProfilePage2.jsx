import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ProfilePage2.css";

const ProfilePage = () => {
  // Заглушки для первоначального отображения
  const profileStub = { name: "Тигровый Лев", className: "1А Класс" };
  const statsStub = [
    { label: "Рейтинг в классе", value: "1 / 52" },
    { label: "Валюта", value: "9329" },
    { label: "Очки", value: "5000" },
  ];
  const diaryStub = [
    { subject: "Русский язык", grades: [4, 5, 3, 4, 5, 3, 4, 5] },
    { subject: "Математика", grades: [5, 3, 4, 5, 3, 4, 5] },
    { subject: "Чтение", grades: [4, 5, 3, 4, 5] },
    { subject: "Окружающий мир", grades: [4, 5, 3, 4, 5, 3, 4, 5] },
  ];

  const [profile, setProfile] = useState(profileStub);
  const [stats, setStats] = useState(statsStub);
  const [diary, setDiary] = useState(diaryStub);
  // Заглушки для Топ класса
  const topStub = [
    { rank: 1, name: "Тигровый Лев" },
    { rank: 2, name: "Другой Ученик" },
    { rank: 3, name: "Третий Ученик" },
    { rank: 4, name: "Четвертый Ученик" },
    { rank: 5, name: "Пятый Ученик" },
  ];

  const [topList, setTopList] = useState(topStub);

  useEffect(() => {
    axios
      .get("/api/profile")
      .then((res) => {
        const {
          name = profileStub.name,
          className = profileStub.className,
          stats: apiStats = statsStub,
          diary: apiDiary = diaryStub,
          top: apiTop = topStub,
        } = res.data || {};
        setProfile({ name, className });
        setStats(Array.isArray(apiStats) ? apiStats : statsStub);
        setDiary(Array.isArray(apiDiary) ? apiDiary : diaryStub);
        setTopList(Array.isArray(apiTop) ? apiTop : topStub);
      })
      .catch((err) => {
        console.warn("Ошибка загрузки профиля, используются заглушки:", err);
      });
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="content profile-content">
        <h1 className="section-title">Профиль</h1>

        <div className="profile-card">
          <img src="/avatar.png" alt="Аватар" className="avatar-img" />
          <div className="profile-info">
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-class">{profile.className}</p>
          </div>
        </div>

        
        <h2 className="section-title">Топ класса</h2>
        <div className="top-block">
          {topList.map(({ rank, name }, idx) => (
            <div
              key={idx}
              className={`top-row ${rank <= 3 ? 'top-highlight top-'+rank : ''}`}
            >
              <span className="top-rank">{rank}</span>
              <span className="top-name">{name}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
