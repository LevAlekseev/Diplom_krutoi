import React from "react";
import "../pages/ProfilePage/ProfilePage.css";

const UserProfileCard = ({ first_name, last_name, school_class }) => (
  <div className="profile-card">
    <img src="/avatar.png" alt="Аватар" className="avatar-img" />
    <div className="profile-info">
      <h2 className="profile-name">{first_name} {last_name}</h2>
      <p className="profile-class">{school_class} класс</p>
    </div>
  </div>
);

export default UserProfileCard; 