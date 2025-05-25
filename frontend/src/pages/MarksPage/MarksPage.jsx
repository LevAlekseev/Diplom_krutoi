// src/pages/ResultPage/ResultPage.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MarksPage.css";

const MarksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const score = Number(params.get("score"));
  const total = Number(params.get("total"));
  const points = params.get("points");
  const coins = params.get("coins");
  const time = params.get("time");

  if (!score || !total || !points || !coins || !time) {
    return <div className="container" style={{color: 'red', fontSize: 22, marginTop: 40}}>Ошибка: результат не найден. Попробуйте пройти тест ещё раз.</div>;
  }

  // Функция для расчёта оценки
  const getMark = () => {
    const percent = (score / total) * 100;
    if (percent >= 90) return 5;
    if (percent >= 70) return 4;
    if (percent >= 50) return 3;
    return 2;
  };

  return (
    <div className="container">
      <div className="marks-card">
        <div className="marks-header">
          <h1>Результат</h1>
        </div>
        <div className="marks-content">
          <div className="marks-number">
            <div className="span">{getMark()}</div>
          </div>
          <div className="marks-info">
            <p>
              Время: <span className="value">{time}</span>
            </p>
            <p>
              Очки: <span className="value">{points}</span>
            </p>
            <p>
              Валюта: <span className="value">{coins}</span>
            </p>
            <p>
              Кол-во верных ответов: <span className="value">{score}/{total}</span>
            </p>
          </div>
        </div>
        <button className="main-btn" onClick={() => navigate("/")}>Главная</button>
      </div>
    </div>
  );
};

export default MarksPage;