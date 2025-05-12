import React from "react";
import "./LevelPage.css";

const LevelsPage = () => {
  return (
    <div className="container">
      <div className="header-box">
        <button className="back-btn">&lt;</button>
        <h1 className="title">Там семь плюсы и минусы</h1>
      </div>

      <div className="cards-wrapper">
        <div className="card easy">
          {/* <img src="/image1.jpg" alt="Легкий" className="card-img" /> */}
          <div className="card-content">
            <p className="card-description">
              Найдите угол между высотой BN и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.
            </p>
            <button className="level-btn easy-btn">Легкий</button>
          </div>
        </div>

        <div className="card medium">
          {/* <img src="/image2.jpg" alt="Средний" className="card-img" /> */}
          <div className="card-content">
            <p className="card-description">
              Найдите угол между высотой BN и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.
            </p>
            <button className="level-btn medium-btn">Средний</button>
          </div>
        </div>

        <div className="card hard">
          {/* <img src="/image3.jpg" alt="Сложный" className="card-img" /> */}
          <div className="card-content">
            <p className="card-description">
              Найдите угол между высотой BN и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.
            </p>
            <button className="level-btn hard-btn">Сложный</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
