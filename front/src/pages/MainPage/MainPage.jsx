import React from "react";
import "./MainPageCSS.css";
import "./MainPageContentCSS.css";
// import avatar from "../../assets/images/avatar.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import CourseCard from "../../components/CourseCard/CourseCard";


const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <div className="header">
          {/* <img src={avatar} alt="Аватар" className="avatar" /> */}
          <h1>Привет, Тигр</h1>
        </div>

        <div className="recent">
          <h2>Достижения</h2>  
                    
            <div className="recent-text-block">
              <h3>Русский язык</h3>
              <p>Название теста.<br />ЖИ ШИ пиши с буквой и. Часть 1</p>
              <span className="status">Статус: срочно или не решён</span>
    
          </div>
        </div>

        <div className="courses">
          <h2>Все курсы</h2>
          <div className="courses-grid">
  {[
    { letter: "Р", name: "Русский", color: "#9d7dfc" },
    { letter: "М", name: "Математика", color: "#f48fb1" },
    { letter: "И", name: "История", color: "#81d4fa" },
    { letter: "Б", name: "Биология", color: "#7986cb" },
    { letter: "Ф", name: "Физика", color: "#c5e1a5" },
    { letter: "Х", name: "Химия", color: "#ef9a9a" },
    { letter: "Г", name: "География", color: "#ce93d8" },
    { letter: "А", name: "Английский", color: "#81c784" },
  ].map(({ letter, name, color }) => (
    <CourseCard key={name} letter={letter} name={name} color={color} />
  ))}
</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
