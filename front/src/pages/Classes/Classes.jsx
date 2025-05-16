import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Classes.css";

const ClassRankingPage = () => {
  const [sortMode, setSortMode] = useState("points");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // TODO: заменить на реальный запрос к API
    const stub = [
      { id: 1, name: "Иванов Иван", points: 95 },
      { id: 2, name: "Петров Петр", points: 88 },
      { id: 3, name: "Сидорова Мария", points: 102 },
      { id: 4, name: "Козлова Анна", points: 76 },
      { id: 5, name: "Новиков Алексей", points: 88 },
    ];
    setStudents(stub);
  }, []);

  const sorted = [...students].sort((a, b) => {
    if (sortMode === "points") {
      return b.points - a.points || a.name.localeCompare(b.name);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="layout">
      <Sidebar />

      <main className="content ranking-content">
        <div className="sort-block">
          <button
            className={sortMode === "points" ? "sort-btn active" : "sort-btn"}
            onClick={() => setSortMode("points")}
          >
            По баллам
          </button>
          <button
            className={sortMode === "alphabet" ? "sort-btn active" : "sort-btn"}
            onClick={() => setSortMode("alphabet")}
          >
            По алфавиту
          </button>
        </div>

        <div className="top-block">
          {sorted.map((stu, index) => (
            <div
              key={stu.id}
              className={`top-row ${sortMode === "points" ? `top-${index + 1}` : ""}`}
            >
              <span className="top-rank">{index + 1}</span>
              <span className="top-name">{stu.name}</span>
              <span className="top-points">{stu.points} баллов</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ClassRankingPage;
