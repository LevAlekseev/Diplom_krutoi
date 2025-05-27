import React from "react";
import "../pages/ProfilePage/ProfilePage.css";

const UserProfileCard = ({ first_name, last_name, school_class, avatar, role }) => (
  <div className="profile-card">
    <img src={avatar} alt="Аватар пользователя" className="avatar-img" />
    <div className="profile-info">
      <h2 className="profile-name">{first_name} {last_name}</h2>
      <p className="profile-class">{role === 'teacher' ? 'Учитель' : school_class ? `Класс: ${school_class}` : ''}</p>
    </div>
  </div>
);

export default UserProfileCard;
