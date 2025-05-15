import React, { useState, useEffect } from "react";
import "./QuestBlock.css";

const QuestionBlock = ({ id, initial = {}, onChange }) => {
  const [question, setQuestion] = useState({
    text: initial.text || "",
    type: initial.type || "Письменный",
    answer: initial.answer || "",
    variants: initial.variants || ["", "", "", ""]
  });

  // Notify parent on any change
  useEffect(() => {
    onChange && onChange(id, question);
  }, [id, question, onChange]);

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index) => (e) => {
    const value = e.target.value;
    setQuestion((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const selectType = (type) => () => {
    setQuestion((prev) => ({ ...prev, type }));
  };

  return (
    <div className="question-block">
      {/* Поле для текста задания */}
      <div className="form-item">
        <label htmlFor={`question-${id}`}>Задание</label>
        <input
          type="text"
          id={`question-${id}`}
          placeholder="Введите задание"
          value={question.text}
          onChange={handleFieldChange("text")}
        />
      </div>

      {/* Кастомный селектор типа задания */}
      <div className="form-item">
        <label>Тип задания</label>
        <div className="type-selector">
          {['Письменный', 'Тестовый'].map((t) => (
            <button
              key={t}
              type="button"
              className={`type-btn ${question.type === t ? 'active' : ''}`}
              onClick={selectType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Для письменного задания */}
      {question.type === "Письменный" && (
        <div className="form-item">
          <label htmlFor={`answer-${id}`}>Ответ</label>
          <input
            type="text"
            id={`answer-${id}`}
            placeholder="Введите ответ"
            value={question.answer}
            onChange={handleFieldChange("answer")}
          />
        </div>
      )}

      {/* Для тестового задания: четыре варианта */}
      {question.type === "Тестовый" && (
        question.variants.map((variant, idx) => (
          <div className="form-item" key={idx}>
            <label htmlFor={`variant-${id}-${idx}`}>Вариант {idx + 1}</label>
            <input
              type="text"
              id={`variant-${id}-${idx}`}
              placeholder={`Введите вариант ${idx + 1}`}
              value={variant}
              onChange={handleVariantChange(idx)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionBlock;
