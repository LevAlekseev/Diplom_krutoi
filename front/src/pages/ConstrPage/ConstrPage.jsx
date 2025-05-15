import React, { useState } from "react";
import QuestionBlock from "../../components/QuestBlock/QuestBlock";
import "./ConstrPage.css";

const ConstructorPage = () => {
    // Заголовок теста
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [time, setTime] = useState("");
    const [points, setPoints] = useState(0);

    // Список вопросов
    const [questions, setQuestions] = useState([
        { id: 1, text: "", type: "Письменный", answer: "", variant: "" }
    ]);

    const handleMetaChange = (setter) => (e) => setter(e.target.value);

    const handleQuestionChange = (id, updated) => {
        setQuestions((qs) => qs.map(q => q.id === id ? { ...q, ...updated } : q));
    };

    const addQuestion = () => {
        setQuestions(qs => [
            ...qs,
            { id: qs.length + 1, text: "", type: "Письменный", answer: "", variant: "" }
        ]);
    };


    const handlePublish = () => {
        // TODO: axios.post /api/tests/publish при публикации
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
                        {/* <h2 className="section-title">Тест</h2> */}
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
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="Введите предмет"
                                    value={subject}
                                    onChange={handleMetaChange(setSubject)}
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="time">Время</label>
                                <input
                                    type="text"
                                    id="time"
                                    placeholder="Укажите время"
                                    value={time}
                                    onChange={handleMetaChange(setTime)}
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="points">Баллы</label>
                                <input
                                    type="number"
                                    id="points"
                                    placeholder="Введите количество баллов"
                                    value={points}
                                    onChange={e => setPoints(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* <h2 className="section-title">Вопросы</h2> */}
                        <div className="tasks-box">
                            {questions.map(q => (
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
