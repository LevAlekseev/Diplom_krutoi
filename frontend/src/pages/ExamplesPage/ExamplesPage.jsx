import React, { useEffect, useState } from "react";
import axios from "axios";
import ExampleImage from "../../assets/images/b1c78b52-6309-486f-a88f-8c3a1bd3944e.jpg";
import "./ExamplesPage.css";

const TaskPage = () => {
  const task1 = {
    id: 4,
    title: "название теста",
    number: 4,
    description:
      "Найдите угол между высотой BH и биссектрисой BD. В треугольнике ABC углы A и C равны 40° и 60° соответственно.",
    progress: 50,
    image: {ExampleImage},
    options: [
      { label: "20%", value: "20%", color: "blue" },
      { label: "10%", value: "10%", color: "yellow" },
      { label: "5%", value: "5%", color: "pink" },
      { label: "52%", value: "52%", color: "purple" },
    ],
  };

  const [task, setTask] = useState(task1);

  useEffect(() => {
    axios
      .get("/api/task/4")
      .then((res) => {
        // Предполагаем, что res.data имеет ту же структуру, включая options
        setTask(res.data);
      })
      .catch((err) => console.error("Ошибка загрузки задания:", err));
  }, []);

  const handleAnswer = (value) => {
    axios
      .post("/api/task/answer", {
        taskId: task.id,
        answer: value,
      })
      .then(() => console.log("Ответ отправлен: ", value))
      .catch((err) => console.error("Ошибка отправки ответа:", err));
  };

  return (
    <div className="container">
      <div className="header-box">
        <button className="back-btn">&lt;</button>
        <div className="title">{task1.title}</div>
      </div>

      <div className="task-container">
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${task1.progress}%` }}
          ></div>
        </div>

        <div className="task-content">
          {task1.image && (
            <img src={task1.image} alt="Task" className="task-img" />
          )}
          <div className="task-description">
            <h2>Задача {task1.number}</h2>
            <p>{task1.description}</p>
          </div>
        </div>

        <div className="options">
          {task1.options.map((option, index) => (
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
