import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import '../styles/pages/survey-success.css';
function SurveySuccess() {
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate("/login")
    };
    const goToResults = () => {
        navigate("/results", {state: {mode: 'survey'}})
    };
    useEffect(() => {
        document.body.classList.add('with-pic');
        return () => {
            document.body.classList.remove('with-pic');
        };
    }, []);
    return (
        <main className="success-container">
            <div className="success-card">
                <h3>Опрос успешно пройден</h3>
                <p className="banner">Хотите войти в аккаунт / пройти регистрацию,
                    чтобы сохранить результаты* или сразу перейти к ним?</p>
                <button id="loginBtn" className="btn-primary" onClick={goToLogin}>
                    Вход / Регистрация
                </button>
                <button id="resultsBtn" className="btn-primary" onClick={goToResults}>
                    Перейти к результатам
                </button>
                <p className="note">
                    *Все продукты носят лишь рекомендательный характер
                </p>
            </div>
        </main>
    );
}

export default SurveySuccess;