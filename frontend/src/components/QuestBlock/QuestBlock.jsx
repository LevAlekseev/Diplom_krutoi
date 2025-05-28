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
    const { id: _, ...rest } = question;  // Исключаем id из обновленных данных
    const updated = { ...rest, [field]: value };
    setQuestion({ ...question, [field]: value });  // Для локального состояния сохраняем id
    onChange(id, updated);
  };

  const selectType = (type) => () => {
    const { id: _, ...rest } = question;  // Исключаем id из обновленных данных
    const updated = { ...rest, type };
    if (type === "Письменный") {
      updated.variants = [];
    } else if (type === "Тестовый" && (!question.variants || question.variants.length === 0)) {
      updated.variants = ["", "", "", ""];
    }
    setQuestion({ ...question, ...updated });  // Для локального состояния сохраняем id
    onChange(id, updated);
  };

  const handleVariantChange = (index) => (e) => {
    const val = e.target.value;
    const variants = [...(question.variants || ["", "", "", ""])];
    variants[index] = val;
    const { id: _, ...rest } = question;  // Исключаем id из обновленных данных
    const updated = { ...rest, variants };
    setQuestion({ ...question, variants });  // Для локального состояния сохраняем id
    onChange(id, updated);
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
      const updated = { ...question, image: reader.result };
      setQuestion(updated);
      onChange(id, updated);
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
