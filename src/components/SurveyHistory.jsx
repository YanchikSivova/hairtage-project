import React from "react";
import { authApi } from "../api/hairtageApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrow_left from '../assets/icons/left.svg';
import arrow_right from '../assets/icons/right.svg';

function SurveyHistory() {

    const [surveys, setSurveys] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userData = await authApi.getMe();
                const historyData = userData?.history || [];
                setSurveys(historyData);
            } catch (err) {
                console.error('Ошибка загрузки опросов: ', err);
                setError(err.message || 'Не удалось загрузить опросы');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + surveys.length) % surveys.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % surveys.length);
    }

    const goToResults = (hairTypeId) => {
        navigate('/results', {state: {mode: 'history', hairTypeId}});
    }

    const goToSurvey = () => {
        navigate('/survey');
    }

    if (loading) {
        return (
            <div className="surveyHistory-card">
                <p>Загрузка опросов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="surveyHistory-card error">
                <p>Ошибка: {error}</p>
                <button className="btn-secondary" onClick={goToSurvey}>
                    Пройти опрос
                </button>
            </div>
        );
    }

    if (surveys.length === 0){
        const today = new Date().toLocaleDateString("ru-RU");
        return(
            <>
                <div className="surveyHistory-card">
                    <h3>{today}</h3>
                    <p>Данных о прохождении опроса нет</p>
                    <button className="btn-secondary" onClick={goToSurvey}>
                        Пройти опрос
                    </button>
                </div>
                <button className="arrow left" style={{display:'none'}}></button>
                <button className="arrow right" style={{display:'none'}}></button>
            </>
        );
    }
    const survey = surveys[currentIndex];
    return(
        <>
            <button
            className="arrow left"
            onClick={goToPrevious}
            disabled={surveys.length <= 1}>
                <img src={arrow_left} alt=""/>
            </button>
            <div className="surveyHistory-card">
                <h3>{new Date(survey.createdAt).toLocaleDateString("ru-RU")}</h3>
                <ul>
                    <li> Тип волос: {survey.hairTypeName} </li>
                </ul>
                <div className="survey-actions">
                    <button className="btn-secondary" onClick={() => goToResults(survey.hairTypeId)}>
                        Посмотреть подбор
                    </button>
                    <button className="btn-secondary" onClick={goToSurvey}>
                        Перепройти опрос
                    </button>
                </div>
            </div>
            <button 
            className="arrow right"
            onClick={goToNext}
            disabled={surveys.length <= 1}>
                <img src={arrow_right} alt=""/>
            </button>
        </>
    );
}

export default SurveyHistory;