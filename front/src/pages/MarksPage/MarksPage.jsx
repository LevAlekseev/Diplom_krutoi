// src/pages/ResultPage/ResultPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MarksPage.css";

const ResultPage = () => {
  // Заглушка с дефолтными данными
  const defaultResult = {
    score: 4,
    time: "10:00",
    points: 5000,
    currency: 9329,
  };

  const [result, setResult] = useState(defaultResult);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем задержку ответа от бэка
    const timer = setTimeout(() => {
      // Здесь можно заменить на реальный axios.get(...)
      setResult(defaultResult);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="marks-card">
          <div className="marks-header">
            <h1>Результат</h1>
          </div>
          <div className="marks-content">
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="marks-card">
        <div className="marks-header">
          <h1>Результат</h1>
        </div>

        <div className="marks-content">
          <div className="marks-number">
            <div className="span">{result.score}</div>
          </div>
          
         <div className="marks-info">
  <p>
    Время: <span className="value">{result.time}</span>
  </p>
  <p>
    Очки: <span className="value">{result.points}</span>
  </p>
  <p>
    Валюта: <span className="value">{result.currency}</span>
  </p>
</div>

        </div>

        <button className="main-btn" onClick={() => window.location.href = "/"}>
          Главная
        </button>
      </div>
    </div>
  );
};

export default ResultPage;