import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./SettingsPage.css";

const SettingsPage = () => {
  // Заглушки
  const profileStub = { name: "Тигровый Лев", className: "1А Класс" };
  const [profile, setProfile] = useState(profileStub);
  const itemsStub = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    image: `/store/item-${i + 1}.png`,
    cost: (i + 1) * 100,
  }));
  const [items, setItems] = useState(itemsStub);

  useEffect(() => {
    // Пример загрузки
    axios.get("/api/profile")
      .then(({ data }) => setProfile({ name: data.name, className: data.className }))
      .catch(() => {});
    axios.get("/api/shop/items")
      .then(({ data }) => Array.isArray(data) && setItems(data))
      .catch(() => {});
  }, []);

  // Вот тут функция handleLogout — не забудь её объявить!
  const handleLogout = () => {
    console.log("Выход из аккаунта");
    // Тут можно добавить логику выхода из системы, например:
    // axios.post('/api/logout').then(() => window.location.reload());
  };

  return (
    <div className="layout">
      <Sidebar />

      <main className="content shop-content">
        <h1 className="section-title">Профиль</h1>

        <div className="profile-card">
          <img src="/avatar.png" alt="Аватар" className="avatar-img" />
          <div className="profile-info">
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-class">{profile.className}</p>
          </div>
        </div>

        <h2 className="section-title">Инвентарь</h2>
        <div className="shop-grid">
          {items.map(({ id, image, cost }) => (
            <div className="shop-item" key={id}>
              <img src={image} alt={`Товар ${id}`} className="shop-img" />
              <button className="buy-btn">Использовать</button>
            </div>
          ))}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </main>
    </div>
  );
};

export default SettingsPage;
