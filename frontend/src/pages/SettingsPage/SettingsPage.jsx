import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./SettingsPage.css";
import { useAuth } from "../../contexts/AuthContext";
import UserProfileCard from "../../components/UserProfileCard";
// Импорты изображений товаров
import name1 from "../../assets/images/name1.png";
import name2 from "../../assets/images/name2.png";
import name3 from "../../assets/images/name3.png";
import name4 from "../../assets/images/name4.png";
import class1 from "../../assets/images/class1.png";
import class2 from "../../assets/images/class2.png";
import class3 from "../../assets/images/class3.png";
import class4 from "../../assets/images/class4.png";
import defaultAvatar from "../../assets/images/avatar1.png";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const itemsStub = [
    { id: 1, image: name1, cost: 100, label: 'Тигров Лев (розовый)' },
    { id: 2, image: name2, cost: 100, label: 'Тигров Лев (красный)' },
    { id: 3, image: name3, cost: 100, label: 'Тигров Лев (зелёный)' },
    { id: 4, image: name4, cost: 100, label: 'Тигров Лев (оранжевый)' },
    { id: 5, image: class1, cost: 100, label: '1А Класс (зелёный)' },
    { id: 6, image: class2, cost: 100, label: '1А Класс (жёлтый)' },
    { id: 7, image: class3, cost: 100, label: '1А Класс (чёрный)' },
    { id: 8, image: class4, cost: 100, label: '1А Класс (красный)' },
  ];
  const [items, setItems] = useState(itemsStub);

  useEffect(() => {
    axios.get("/api/shop/items")
      .then(({ data }) => Array.isArray(data) && setItems(data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content shop-content">
        <h1 className="section-title">Профиль</h1>
        {user && (
          <UserProfileCard
            first_name={user.first_name}
            last_name={user.last_name}
            school_class={user.school_class}
            avatar={defaultAvatar}
          />
        )}
        <h2 className="section-title">Инвентарь</h2>
        <div className="shop-grid">
          {items.map(({ id, image, cost, label }) => (
            <div className="shop-item" key={id}>
              <img src={image} alt={label} className="shop-img" />
              <div style={{textAlign: 'center', fontSize: 14, margin: '6px 0'}}>{label}</div>
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
