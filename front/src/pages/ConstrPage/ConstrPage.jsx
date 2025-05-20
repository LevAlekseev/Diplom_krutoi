import React, { useState } from "react";
import QuestionBlock from "../../components/QuestBlock/QuestBlock";

import "./ConstrPage.css";

const ConstructorPage = () => {
  // Заглушка списка предметов
  const [subjects, setSubjects] = useState([
    "Русский",
    "Математика",
    "История",
    "Физика",
    "Химия",
    "Биология",
    "География",
    "Английский",
  ]);

  // Метаданные теста
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState(""); // будет строка с минутами, например "15"
  const [points, setPoints] = useState(0);

  // Список вопросов
  const [questions, setQuestions] = useState([
    { id: 1, text: "", type: "Письменный", answer: "", variant: "" },
  ]);

  // Варианты времени (10, 15, 20, 25, 30)
  const timeOptions = [10, 15, 20, 25, 30];

  const handleMetaChange = (setter) => (e) => setter(e.target.value);

  const handleQuestionChange = (id, updated) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...updated } : q)));
  };

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      { id: qs.length + 1, text: "", type: "Письменный", answer: "", variant: "" },
    ]);
  };

  const handlePublish = () => {
    console.log("Опубликовать тест", { title, subject, time, points, questions });
  };

  return (
    <div className="layout">
      <main className="content">
        <div className="container">
          <div className="header-box">
            <button className="back-btn">&lt;</button>
            <h1>Создание тестов</h1>
            <div className="footer-btns">
              <button className="publish-btn" onClick={handlePublish}>
                Выставить
              </button>
            </div>
          </div>

          <div className="container__huini">
            <div className="form-box">
              <div className="form-item">
                <label htmlFor="title">Название</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Введите название теста"
                  value={title}
                  onChange={handleMetaChange(setTitle)}
                />
              </div>

              <div className="form-item">
                <label htmlFor="subject">Предмет</label>
                <select
                  id="subject"
                  value={subject}
                  onChange={handleMetaChange(setSubject)}
                  className="custom-select"
                >
                  <option value="" disabled>
                    Выберите предмет
                  </option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-item">
                <label htmlFor="time">Время (минуты)</label>
                <select
                  id="time"
                  value={time}
                  onChange={handleMetaChange(setTime)}
                  className="custom-select"
                >
                  <option value="" disabled>
                    Выберите время
                  </option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="tasks-box">
              {questions.map((q) => (
                <QuestionBlock
                  key={q.id}
                  id={q.id}
                  initial={q}
                  onChange={handleQuestionChange}
                  onAddContent={addQuestion}
                />
              ))}
            </div>

            <button className="add-btn" onClick={addQuestion}>
              Добавить вопрос
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConstructorPage;
