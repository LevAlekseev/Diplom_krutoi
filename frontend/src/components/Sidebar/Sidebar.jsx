import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Sidebar.css";
import img1 from "../../assets/svg/interface-setting-cog--work-loading-cog-gear-settings-machine.svg";
import img2 from "../../assets/svg/programming-script-1--language-programming-code.svg";
import img3 from "../../assets/svg/image-photo-four--photos-camera-picture-photography-pictures-four-photo.svg";
import img4 from "../../assets/svg/interface-user-circle--circle-geometric-human-person-single-user.svg";

const Sidebar = () => {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';
    const profilePath = '/profile';

    return (
        <>
            <aside className="sidebar">
                <div className="logo">Класс</div>
                <nav>
                    <ul>
                        <li><Link to="/main">Главная</Link></li>
                        {isTeacher ? (
                            <li><Link to="/constructor">Конструктор</Link></li>
                        ) : (
                            <li><Link to="/shop">Магазин</Link></li>
                        )}
                        <li><Link to={profilePath}>Профиль</Link></li>
                        <li><Link to="/settings">Настройки</Link></li>
                    </ul>
                </nav>
            </aside>
            <div className="mobile-nav">
                <Link to="/main"><img src={img2} alt="Задания" /></Link>
                {isTeacher ? (
                    <Link to="/constructor"><img src={img3} alt="Конструктор" /></Link>
                ) : (
                    <Link to="/shop"><img src={img3} alt="Магазин" /></Link>
                )}
                <Link to={profilePath}><img src={img4} alt="Профиль" /></Link>
                <Link to="/settings"><img src={img1} alt="Настройки" /></Link>
            </div>
        </>
    );
};

export default Sidebar;
