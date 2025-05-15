import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ShopPage.css";

const ShopPage = () => {
  // Заглушка профиля
  const profileStub = { name: "Тигровый Лев", className: "1А Класс" };
  const [profile, setProfile] = useState(profileStub);

  // Заглушка товаров
  const itemsStub = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    image: `/store/item-${i + 1}.png`,
    cost: (i + 1) * 100,
  }));
  const [items, setItems] = useState(itemsStub);

  useEffect(() => {
    // Пример загрузки профиля и магазина
    axios.get("/api/profile")
      .then(({ data }) => setProfile({ name: data.name, className: data.className }))
      .catch(() => {});
    axios.get("/api/shop/items")
      .then(({ data }) => Array.isArray(data) && setItems(data))
      .catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="content shop-content">
        {/* Профиль */}
        <h1 className="section-title">Профиль</h1>

<div className="profile-card">
  <img src="/avatar.png" alt="Аватар" className="avatar-img" />
  <div className="profile-info">
    <h2 className="profile-name">{profile.name}</h2>
    <p className="profile-class">{profile.className}</p>
  </div>
</div>

        {/* Магазин */}
        <h2 className="section-title">Магазин</h2>
        <div className="shop-grid">
          {items.map(({ id, image, cost }) => (
            <div className="shop-item" key={id}>
              <img src={image} alt={`Товар ${id}`} className="shop-img" />
              <button className="buy-btn">Купить за {cost} очков</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopPage;
