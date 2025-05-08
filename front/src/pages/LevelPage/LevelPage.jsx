import React from "react";
import axios from "axios";
import "./LevelPage.css";

const LevelsPage = () => {
  const handleLevelSelect = async (level) => {
    try {
      await axios.post("/api/choose-level", {
        taskId: 123, // можно передавать динамически
        level: level
      });
      console.log("Выбор отправлен:", level);
      // Можно сделать редирект, оповещение, смену страницы и т.д.
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    }
  };

  return (
    <div className="container">
      <div className="header-box">
        <button className="back-btn">&lt;</button>
        <h1 className="title">Там семь плюсы и минусы</h1>
      </div>

      <div className="cards-wrapper">
        <div className="card easy">
          <div className="card-content">
            <p className="card-description">
              Найдите угол между высотой BN и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.
            </p>
            <button className="level-btn easy-btn" onClick={() => handleLevelSelect("easy")}>
              Легкий
            </button>
          </div>
        </div>

        <div className="card medium">
          <div className="card-content">
            <p className="card-description">
              Найдите угол между высотой BN и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.
            </p>
            <button className="level-btn medium-btn" onClick={() => handleLevelSelect("medium")}>
              Средний
            </button>
          </div>
        </div>

        <div className="card hard">
          <div className="card-content">
            <p className="card-description">
              Найдите угол между высотой BN и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.
            </p>
            <button className="level-btn hard-btn" onClick={() => handleLevelSelect("hard")}>
              Сложный
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
