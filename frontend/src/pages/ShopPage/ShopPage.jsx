import React, { useEffect, useState } from "react";
import axios from "axios";
import { authAPI } from "../../services/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserProfileCard from "../../components/UserProfileCard";
import "./ShopPage.css";

const ShopPage = () => {
  const [profile, setProfile] = useState(null);

  // Заглушка товаров
  const itemsStub = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    image: `/store/item-${i + 1}.png`,
    cost: (i + 1) * 100,
  }));
  const [items, setItems] = useState(itemsStub);

  useEffect(() => {
    authAPI.getProfile()
      .then((res) => {
        setProfile(res.data);
      })
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
        {profile ? (
          <UserProfileCard first_name={profile.first_name} last_name={profile.last_name} school_class={profile.school_class} />
        ) : (
          <div>Загрузка...</div>
        )}

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
