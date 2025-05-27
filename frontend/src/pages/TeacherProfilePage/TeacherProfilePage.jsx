import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./TeacherProfilePage.css";
import { authAPI } from "../../services/api";
import { teacherAPI } from "../../services/api";
import UserProfileCard from "../../components/UserProfileCard";
import defaultAvatar from "../../assets/images/avatar1.png";
import { useNavigate } from "react-router-dom";

const TeacherProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await authAPI.getProfile();
        setProfile(profileRes.data);
        // Уведомления временно не загружаем, чтобы не было 404
      } catch (e) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !profile) return <div>Загрузка...</div>;

  return (
    <div className="layout">
      <Sidebar />
      <main className="content teacher-profile-content">
        <UserProfileCard
          first_name={profile.first_name}
          last_name={profile.last_name}
          school_class={""}
          avatar={defaultAvatar}
          role="teacher"
        />

        <h2 className="section-title">Мои классы</h2>
        <div className="classes-block">
          {(profile.teacher_classes || []).map(({ id, name }) => (
            <button key={id} className="class-btn" onClick={() => navigate(`/classes/${id}`)}>
              {name}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherProfilePage;