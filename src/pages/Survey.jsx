import React from "react";
import "../styles/pages/survey.css";
import comb from '../assets/icons/comb.svg';
import brush from '../assets/icons/brush.svg';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSurvey } from "../hooks/useSurvey";
import QuestionCard from "../components/QuestionCard";
import Progress from "../components/Progress";
import arrowLeft from "../assets/icons/arrow-left.svg";
import arrowRight from "../assets/icons/arrow-right.svg";
import { useAuth } from "../hooks/useAuth";

const Survey = () => {
    const {user} = useAuth;
    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(false);

    const {
        currentIndex,
        currentQuestion,
        selectedOptionIndex,
        error,
        answers,
        totalQuestions,
        isLastQuestion,
        handleOptionSelect,
        saveAnswer,
        goToNext,
        goToPrevious,
        submitAnswers,
    } = useSurvey();

    const handleNext = async () => {
        if (selectedOptionIndex === null) {
            setShowWarning(true);
            return;
        }
        setShowWarning(false);

        const saved = saveAnswer();
        // console.log('answer:', selectedOptionIndex)
        if (saved && isLastQuestion) {
            try {
                await submitAnswers();
                if (user){
                    navigate('/results');
                }else{
                    navigate('/survey/success')
                }
            } catch (error) {
                console.error();
                console.log(answers);
            }
        } else if (saved) {
            goToNext();
        }
    };

    const handlePrevious = () => {
        setShowWarning(false);
        goToPrevious();
    }
    return (
        <div>
            <div className="decor-left">
                <img src={comb} alt=""/>
            </div>
            <div className="decor-right">
                <img src={brush} alt=""/>
            </div>
            <main className="survey-container">
                <Progress current={currentIndex + 1} total={totalQuestions} />

                <QuestionCard
                    question={currentQuestion}
                    selectedOptionIndex={selectedOptionIndex}
                    onOptionSelect={handleOptionSelect} />

                <div className="survey-controls">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="nav-btn"
                        id="prevBtn">
                        <img src={arrowLeft} alt="" />
                    </button>

                    <button onClick={handleNext}
                        className="nav-btn"
                        id="nextBtn">
                        {isLastQuestion ? "Конец" : <img src={arrowRight} alt="" />}
                    </button>
                </div>
                {showWarning && (
                    <p className="warning">Пожалуйста, выберите вариант ответа</p>
                )}
            </main>
        </div>
    );
};

export default Survey;