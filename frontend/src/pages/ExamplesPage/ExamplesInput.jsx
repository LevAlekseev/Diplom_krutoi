import React, { useEffect, useState } from "react";
import axios from "axios";
import ExampleImage from "../../assets/images/b1c78b52-6309-486f-a88f-8c3a1bd3944e.jpg";
import Input from "../../components/Input/Input";
import "./ExamplesPage.css";

const TaskPage = () => {
  const taskStub = {
    id: 4,
    title: "Название теста",
    number: 4,
    description:
      "Найдите угол между высотой BH и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.",
    progress: 50,
    image: ExampleImage,
  };

  const [task, setTask] = useState(taskStub);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 минут в секундах

  useEffect(() => {
    // Заглушка загрузки
    setTask(taskStub);

    const timerId = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    axios
      .post("/api/task/answer", { taskId: task.id, answer })
      .then(() => {
        console.log("Ответ отправлен:", answer);
        setAnswer("");
      })
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
          />
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
          <Input
            type="text"
            placeholder="Введите ответ..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="option-input"
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
