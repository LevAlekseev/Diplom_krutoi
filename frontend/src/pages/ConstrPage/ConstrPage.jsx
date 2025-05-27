import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { teacherAPI } from "../../services/api";
import QuestionBlock from "../../components/QuestBlock/QuestBlock";

import "./ConstrPage.css";

const ConstructorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Курсы учителя
  const [subjects, setSubjects] = useState([]);
  // Метаданные теста
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState(""); // строка с минутами
  const [points, setPoints] = useState(0);

  // Список вопросов
  const [questions, setQuestions] = useState([
    { id: 1, text: "", type: "Письменный", answer: "", variant: "" },
  ]);

  useEffect(() => {
    teacherAPI.getMyCourses()
      .then(res => {
        const courseList = res.data.results || res.data;
        setSubjects(courseList.map(course => course.title));
      })
      .catch(() => setSubjects([]));
  }, []);

  const handleMetaChange = (setter) => (e) => setter(e.target.value);

  // Валидация времени
  const handleTimeChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val !== "" && (+val > 120 || +val < 1)) val = "";
    setTime(val);
  };

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
            <button className="back-btn" onClick={() => navigate(-1)}>&lt;</button>
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
                <input
                  type="text"
                  id="time"
                  placeholder="Введите время (1-120)"
                  value={time}
                  onChange={handleTimeChange}
                  maxLength={3}
                />
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
