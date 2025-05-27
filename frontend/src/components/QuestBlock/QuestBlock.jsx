import React, { useState, useEffect, useRef } from "react";
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
    if (!file) return;

    // Допустимые MIME-типы
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Можно загружать только изображения в формате PNG или JPEG.");
      e.target.value = null;
      return;
    }

    // Максимальный размер файла 2 Мб
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Максимальный размер файла ${maxSizeMB} Мб.`);
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setQuestion((prev) => {
        const updated = { ...prev, image: reader.result };
        onChange(id, updated);
        return updated;
      });
    };
    reader.readAsDataURL(file);
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
      {question.type === "Тестовый" &&
        question.variants?.map((variant, idx) => (
          <div className="form-item" key={idx}>
            <label htmlFor={`variant-${id}-${idx}`}>{idx === 0 ? 'Верный ответ' : 'Неверный ответ'}</label>
            <input
              type="text"
              id={`variant-${id}-${idx}`}
              placeholder={`Введите ${idx === 0 ? 'верный' : 'неверный'} ответ`}
              value={variant}
              onChange={handleVariantChange(idx)}
            />
          </div>
        ))}

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
          accept=".png, .jpeg, .jpg"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default QuestionBlock;
