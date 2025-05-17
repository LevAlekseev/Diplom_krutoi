import React, { useEffect, useState } from "react";
import axios from "axios";
import ExampleImage from "../../assets/images/b1c78b52-6309-486f-a88f-8c3a1bd3944e.jpg";
import "./ExamplesPage.css";

const TaskPage = () => {
  const defaultTask = {
    id: 4,
    title: "название теста",
    number: 4,
    description:
      "Найдите угол между высотой BH и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.",
    progress: 50,
    image: ExampleImage,
    options: [
      { label: "20%", value: "20%", color: "blue" },
      { label: "10%", value: "10%", color: "yellow" },
      { label: "5%", value: "5%", color: "pink" },
      { label: "52%", value: "52%", color: "purple" },
    ],
  };

  const [task, setTask] = useState(defaultTask);
  const [timeLeft, setTimeLeft] = useState(600); // 10 минут в секундах

  useEffect(() => {
    axios
      .get("/api/task/4")
      .then((res) => {
        const data = res.data;
        // Если приходят данные с опциями - используем, иначе оставляем заглушку
        if (data && Array.isArray(data.options)) {
          setTask(data);
        } else {
          setTask(defaultTask);
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки задания:", err);
        setTask(defaultTask);
      });

    const timerId = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswer = (value) => {
    axios
      .post("/api/task/answer", { taskId: task.id, answer: value })
      .then(() => console.log("Ответ отправлен: ", value))
      .catch((err) => console.error("Ошибка отправки ответа:", err));
  };

  return (
    <div className="container">
      <div className="header-box">
        <button className="back-btn">&lt;</button>
        <div className="title">{task.title}</div>
        <div className="timer">{formatTime(timeLeft)}</div>
      </div>

      <div className="task-container">
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>

        <div className="task-content">
          {task.image && (
            <img src={task.image} alt="Task" className="task-img" />
          )}
          <div className="task-description">
            <h2>Задача {task.number}</h2>
            <p>{task.description}</p>
          </div>
        </div>

        <div className="options">
          {task.options.map((option, index) => (
            <div
              key={index}
              className={`option-btn ${option.color}`}
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
