import React, { useEffect, useState } from "react";
import axios from "axios";
import { authAPI } from "../../services/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserProfileCard from "../../components/UserProfileCard";
import "./ShopPage.css";

// Импорты изображений товаров
import name1 from "../../assets/images/name1.png";
import name2 from "../../assets/images/name2.png";
import name3 from "../../assets/images/name3.png";
import name4 from "../../assets/images/name4.png";
import class1 from "../../assets/images/class1.png";
import class2 from "../../assets/images/class2.png";
import class3 from "../../assets/images/class3.png";
import class4 from "../../assets/images/class4.png";

// Импорт дефолтного аватара
import defaultAvatar from "../../assets/images/avatar1.png";

const ShopPage = () => {
  const [profile, setProfile] = useState(null);

  // Заглушка для товаров
  const itemsStub = [
    { id: 1, image: name1, cost: 100 },
    { id: 2, image: name2, cost: 100 },
    { id: 3, image: name3, cost: 100 },
    { id: 4, image: name4, cost: 100 },
    { id: 5, image: class1, cost: 100 },
    { id: 6, image: class2, cost: 100 },
    { id: 7, image: class3, cost: 100 },
    { id: 8, image: class4, cost: 100 },
  ];

  const [items, setItems] = useState(itemsStub);

  useEffect(() => {
    // Получение профиля пользователя
    authAPI.getProfile()
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {});

    // Получение товаров (можно убрать, если используем только заглушку)
    axios.get("/api/shop/items")
      .then(({ data }) => Array.isArray(data) && setItems(data))
      .catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="content shop-content">
        {/* Блок профиля */}
        <h1 className="section-title">Профиль</h1>
        {profile ? (
          <UserProfileCard
            first_name={profile.first_name}
            last_name={profile.last_name}
            school_class={'school_class'}
            avatar={defaultAvatar}
            role={'teacher'}
          />
        ) : (
          <div>Загрузка...</div>
        )}

        {/* Блок магазина */}
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
