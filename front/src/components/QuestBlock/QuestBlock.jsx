import React, { useState, useEffect, useRef } from "react";
import AutoTextarea from "../AutoTextarea/AutoTextarea";
import "./QuestBlock.css";

const QuestionBlock = ({ id, initial, onChange, onAddContent }) => {
  const [question, setQuestion] = useState(initial);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuestion(initial);
  }, [initial]);

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setQuestion((prev) => {
      const updated = { ...prev, [field]: value };
      onChange(id, updated);
      return updated;
    });
  };

  const selectType = (type) => () => {
    setQuestion((prev) => {
      const updated = { ...prev, type };
      if (type === "Письменный") {
        updated.variants = [];
      } else if (type === "Тестовый" && (!prev.variants || prev.variants.length === 0)) {
        updated.variants = ["", "", "", ""];
      }
      onChange(id, updated);
      return updated;
    });
  };

  const handleVariantChange = (index) => (e) => {
    const val = e.target.value;
    setQuestion((prev) => {
      const variants = [...(prev.variants || ["", "", "", ""])];
      variants[index] = val;
      const updated = { ...prev, variants };
      onChange(id, updated);
      return updated;
    });
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQuestion((prev) => {
          const updated = { ...prev, image: reader.result };
          onChange(id, updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="question-block">
      {/* Поле для текста задания */}
      <div className="form-item">
        <label htmlFor={`question-${id}`}>Задание</label>
        <AutoTextarea
  id={`question-${id}`}
  value={question.text}
  onChange={(e) => handleFieldChange("text")(e)}
  placeholder="Введите задание"
  className="form-textarea"
/>
      </div>

      {/* Кастомный селектор типа задания */}
      <div className="form-item">
        <label>Тип задания</label>
        <div className="type-selector">
          {["Письменный", "Тестовый"].map((t) => (
            <button
              key={t}
              type="button"
              className={`type-btn ${question.type === t ? "active" : ""}`}
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
      {question.type === "Тестовый" && question.variants && (
        <>
          {/* Первый вариант - правильный */}
          <div className="form-item correct-variant">
            <label htmlFor={`variant-${id}-0`}>Правильный вариант</label>
            <input
              type="text"
              id={`variant-${id}-0`}
              placeholder="Введите правильный вариант"
              value={question.variants[0]}
              onChange={handleVariantChange(0)}
              style={{ fontWeight: "bold", borderColor: "#4CAF50" }} // можно выделить стилем
            />
          </div>

          {/* Остальные варианты */}
          {question.variants.slice(1).map((variant, idx) => (
            <div className="form-item" key={idx + 1}>
              <label htmlFor={`variant-${id}-${idx + 1}`}>Вариант {idx + 1}</label>
              <input
                type="text"
                id={`variant-${id}-${idx + 1}`}
                placeholder={`Введите вариант ${idx + 1}`}
                value={variant}
                onChange={handleVariantChange(idx + 1)}
              />
            </div>
          ))}
        </>
      )}

      {/* Блок загрузки картинки */}
      <div
        className="image-upload-block"
        onClick={handleImageClick}
        title="Загрузить изображение"
      >
        {question.image ? (
          <img src={question.image} alt="Превью" className="image-preview" />
        ) : (
          "Загрузить изображение"
        )}
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default QuestionBlock;
