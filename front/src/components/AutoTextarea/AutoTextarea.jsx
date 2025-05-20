import React, { useState, useEffect, useRef } from "react";
import "./AutoTextarea.css";
const AutoTextarea = ({ value, onChange, placeholder, id, className }) => {
  const textareaRef = useRef(null);

  // Функция, которая подгоняет высоту textarea по контенту
  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";  // Сбрасываем высоту
      ta.style.height = ta.scrollHeight + "px";  // Устанавливаем высоту под контент
    }
  };

  // При изменении value подгоняем высоту
  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      id={id}
      ref={textareaRef}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={1}
      style={{
        resize: "none", // Запрет ручного изменения размера пользователем
        overflow: "hidden" // Чтобы не было полос прокрутки
      }}
    />
  );
};

export default AutoTextarea;
