import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { testsAPI } from "../../services/api";
import Input from "../../components/Input/Input";
import "./ExamplesPage.css";

const MODE_MAP = {
  easy: "slow",
  normal: "normal",
  hard: "fast"
};

const ExamplesPage = () => {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("test");
  const level = searchParams.get("level") || "easy";
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timerRef = useRef();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setLoading(true);
    testsAPI.getById(testId)
      .then(res => {
        setTest(res.data);
        const base = (res.data.time_limit_minutes || 10) * 60;
        let t = base;
        if (level === "easy") t = Math.round(base * 1.2);
        if (level === "hard") t = Math.round(base * 0.8);
        setTimeLeft(t);
        startTimeRef.current = Date.now();
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки теста");
        setLoading(false);
      });
  }, [testId, level]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [test]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <div className="container">Загрузка...</div>;
  if (error || !test) return <div className="container">{error || "Тест не найден"}</div>;

  const questions = test.questions || [];
  const question = questions[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);

  const handleOption = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    setInputValue("");
    if (current < questions.length - 1) {
      setCurrent((i) => i + 1);
    } else {
      handleFinish({ ...answers, [questionId]: answerId });
    }
  };

  const handleText = (questionId) => {
    if (!inputValue.trim()) return;
    setAnswers((prev) => ({ ...prev, [questionId]: inputValue.trim() }));
    if (current < questions.length - 1) {
      setCurrent((i) => i + 1);
      setInputValue("");
    } else {
      handleFinish({ ...answers, [questionId]: inputValue.trim() });
    }
  };

  const handleFinish = (finalAnswers = null) => {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    testsAPI.passTest(testId, {
      mode: MODE_MAP[level],
      answers: finalAnswers || answers,
      time_spent_seconds: timeSpent,
    })
      .then((res) => {
        navigate(
          `/marks?score=${res.data.score}&total=${res.data.total}&points=${res.data.points}&coins=${res.data.coins}&time=${formatTime(res.data.time)}`
        );
      })
      .catch((err) => {
        let msg = "Ошибка отправки результатов. Попробуйте ещё раз.";
        if (err.response && err.response.data && typeof err.response.data === "object") {
          msg += "\n" + JSON.stringify(err.response.data);
        }
        setError(msg);
      });
  };

  return (
    <div className="container">
      <div className="header-box">
        <button className="back-btn" onClick={() => navigate(-1)}>&lt;</button>
        <div className="title">{test.title}</div>
        <div className="timer">{formatTime(timeLeft)}</div>
      </div>
      <div className="task-container">
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="task-content">
          {question.image && (
            <img src={question.image} alt="Task" className="task-img" />
          )}
          <div className="task-description">
            <h2>Вопрос {current + 1}</h2>
            <p>{question.text}</p>
          </div>
        </div>
        <div className="options">
          {question.type === "text" ? (
            <>
              <Input
                type="text"
                placeholder="Введите ответ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="option-input"
                onKeyDown={(e) => e.key === "Enter" && handleText(question.id)}
              />
              <button className="submit-btn" onClick={() => handleText(question.id)}>
                Отправить
              </button>
            </>
          ) : (
            question.answers && question.answers.map((option, idx) => (
              <div
                key={option.id}
                className={`option-btn ${["blue", "yellow", "pink", "purple"][idx % 4]}`}
                onClick={() => handleOption(question.id, option.id)}
              >
                {option.text}
              </div>
            ))
          )}
        </div>
        {error && <div style={{color: 'red', marginTop: 20, fontSize: 18}}>{error}</div>}
      </div>
    </div>
  );
};

export default ExamplesPage;
