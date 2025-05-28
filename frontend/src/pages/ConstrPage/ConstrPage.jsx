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
    { id: 1, text: "", type: "Письменный", answer: "", variants: [] },
  ]);

  useEffect(() => {
    teacherAPI.getMyCourses()
      .then(res => {
        const courseList = res.data.results || res.data;
        console.log('Полученные курсы:', courseList);  // Для отладки
        setSubjects(courseList);
      })
      .catch(() => setSubjects([]));
  }, []);

  const handleMetaChange = (setter) => (e) => {
    const value = e.target.value;
    const fieldName = e.target.id;
    console.log('Изменение поля:', fieldName);
    console.log('Новое значение:', value);
    console.log('Текущее название теста:', title);
    console.log('Текущий предмет:', subject);
    setter(value);
  };

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
      { id: qs.length + 1, text: "", type: "Письменный", answer: "", variants: [] },
    ]);
  };

  const handlePublish = async () => {
    // Проверяем заполненность основных полей
    if (!title.trim()) {
      alert("Пожалуйста, введите название теста");
      return;
    }
    if (!subject) {
      alert("Пожалуйста, выберите предмет");
      return;
    }
    if (!time) {
      alert("Пожалуйста, укажите время на выполнение теста");
      return;
    }

    // Проверяем, что все вопросы заполнены
    const isQuestionsValid = questions.every(q => {
      if (!q.text.trim()) {
        alert(`Пожалуйста, заполните текст задания для вопроса ${q.id}`);
        return false;
      }
      if (q.type === "Письменный" && !q.answer?.trim()) {
        alert(`Пожалуйста, укажите ответ для письменного задания ${q.id}`);
        return false;
      }
      if (q.type === "Тестовый" && !q.variants?.length) {
        alert(`Пожалуйста, заполните все варианты ответов для тестового задания ${q.id}`);
        return false;
      }
      return true;
    });

    if (!isQuestionsValid) return;

    try {
      // Автоматический расчет points: 10 базовых + 10 за каждый вопрос
      const calculatedPoints = 10 + (questions.length * 10);

      // 1. Создаем тест
      const testData = {
        title: title.trim(),
        course_id: parseInt(subject),
        time_limit_minutes: parseInt(time),
        points: calculatedPoints,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        coins: calculatedPoints,
        questions: questions.map(({ id, ...q }) => ({  // Деструктурируем id, чтобы исключить его
          text: q.text.trim(),
          type: q.type === "Письменный" ? "text" : "choice",
          answers: q.type === "Письменный" 
            ? [{ text: q.answer.trim(), is_correct: true }]
            : q.variants.map((variant, idx) => ({
                text: variant.trim(),
                is_correct: idx === 0
              }))
        }))
      };

      console.log('Отправляемые данные теста:', testData);  // Для отладки

      const testResponse = await teacherAPI.createTest(testData);
      const testId = testResponse.data.id;

      alert("Тест успешно создан!");
      navigate(-1);
    } catch (error) {
      console.error("Ошибка при создании теста:", error.response?.data || error.message);
      alert(`Не удалось опубликовать тест: ${error.response?.data?.detail || 'Проверьте все поля и попробуйте снова'}`);
    }
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
                  {subjects.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
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
