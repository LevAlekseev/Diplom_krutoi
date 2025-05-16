import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LevelPage.css";

const LevelsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const testId = params.get("test");

  const handleLevelSelect = (level) => {
    // Переход на ExamplesPage с параметрами test и level
    navigate(`/examples?test=${testId}&level=${level}`);
  };

  const handleBack = () => {
    // Вернуться на страницу курса (lessons/:courseId)
    // testId известен, нужно получить courseId (можно прокидывать через query или хранить в state)
    // Для простоты: history.back() (или navigate(-1)), если всегда переход с курса
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="header-box">
        <button className="back-btn" onClick={handleBack}>&lt;</button>
        <h1 className="title">Выбери уровень сложности</h1>
      </div>

      <div className="cards-wrapper">
        <div className="card easy">
          <div className="card-content">
            <p className="card-description">
              Простой режим прохождения теста, у тебя будет больше времени на решение задач.
            </p>
            <button className="level-btn easy-btn" onClick={() => handleLevelSelect("easy")}>Легкий</button>
          </div>
        </div>

        <div className="card medium">
          <div className="card-content">
            <p className="card-description">
              Классический режим прохождения теста, у тебя будет столько времени, сколько нужно.
            </p>
            <button className="level-btn medium-btn" onClick={() => handleLevelSelect("medium")}>Средний</button>
          </div>
        </div>

        <div className="card hard">
          <div className="card-content">
            <p className="card-description">
              Сложный режим прохождения теста, у тебя будет меньше времени на решение задач.
            </p>
            <button className="level-btn hard-btn" onClick={() => handleLevelSelect("hard")}>Сложный</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
