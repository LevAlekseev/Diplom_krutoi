import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Classes.css";
import api from "../../services/api";
import { useLocation, useParams } from "react-router-dom";

const ClassRankingPage = () => {
  const [sortMode, setSortMode] = useState("points");
  const [students, setStudents] = useState([]);
  const { classId } = useParams();

  useEffect(() => {
    if (!classId) return;
    api.get(`/classes/${classId}/students/`)
      .then(res => {
        setStudents(res.data.results || res.data);
      })
      .catch(() => setStudents([]));
  }, [classId]);

  // Преобразуем данные: фамилия и имя отдельно (фамилия всегда первая, остальное — имя)
  const studentsWithSplit = students.map((stu) => {
    const parts = stu.name.trim().split(' ');
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return {
      ...stu,
      lastName,
      firstName,
    };
  });

  const sorted = [...studentsWithSplit].sort((a, b) => {
    if (sortMode === "points") {
      return b.points - a.points || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    } else {
      return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
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
              <span className="top-name">{stu.lastName} {stu.firstName}</span>
              <span className="top-points">{stu.points} баллов</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ClassRankingPage;
