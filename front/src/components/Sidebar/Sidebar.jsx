import React from "react";
import "./Sidebar.css";
import img1 from "../../assets/svg/interface-setting-cog--work-loading-cog-gear-settings-machine.svg";
import img2 from "../../assets/svg/programming-script-1--language-programming-code.svg";
import img3 from "../../assets/svg/image-photo-four--photos-camera-picture-photography-pictures-four-photo.svg";
import img4 from "../../assets/svg/interface-user-circle--circle-geometric-human-person-single-user.svg";


const Sidebar = () => {
    return (
        <>
            <aside className="sidebar">
                <div className="logo">Класс</div>
                <nav>
                    <ul>
                        <li><a href="#">Главная</a></li>
                        <li><a href="#">Курсы</a></li>
                        <li><a href="#">Профиль</a></li>
                        <li><a href="#">Настройки</a></li>
                    </ul>
                </nav>
            </aside>
            <div className="mobile-nav">
                <a href="#"><img src={img2} alt="Задания" /></a>
                <a href="#"><img src={img3} alt="Курсы" /></a>
                <a href="#"><img src={img4} alt="Профиль" /></a>
                <a href="#"><img src={img1} alt="Настройки" /></a>
            </div>
        </>
    );
};

export default Sidebar;
