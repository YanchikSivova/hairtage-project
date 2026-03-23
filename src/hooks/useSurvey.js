import { useState, useCallback } from "react";
import { surveyQuestions } from "../data/survey";
import { postSurvey } from "../api/hairtageApi";

export const useSurvey = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

    const [error, setError] = useState(null);
    
    const currentQuestion = surveyQuestions[currentIndex]
    const totalQuestions = surveyQuestions.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;

    const handleOptionSelect = useCallback((optionIndex) => {
        setSelectedOptionIndex(optionIndex);
    }, []);

    const saveAnswer = useCallback(() => {
        if(selectedOptionIndex === null) return false;

        const newAnswers = [...answers]
        newAnswers[currentIndex] = selectedOptionIndex+1;
        setAnswers(newAnswers);
        return true;
    }, [selectedOptionIndex, currentIndex, answers]);

    const goToNext = useCallback(()=>{
        if (currentIndex < totalQuestions-1){
            setCurrentIndex(prev => prev+1);
            setSelectedOptionIndex(null);
        }
    }, [currentIndex, totalQuestions]);

    const goToPrevious = useCallback(() => {
        if(currentIndex > 0){
            setCurrentIndex(prev => prev-1);
            const prevAnswer = answers[currentIndex - 1];
            setSelectedOptionIndex(prevAnswer? prevAnswer-1:null);
        }
    }, [currentIndex, answers]);

    const submitAnswers = async()=>{
        setError(null);
        try{
            localStorage.setItem("answers", answers);
        } catch(err){
            setError(err.message);
            throw err;
        }
    };

    return{
        currentIndex,
        currentQuestion,
        answers,
        selectedOptionIndex,
        error,
        totalQuestions,
        isLastQuestion,
        handleOptionSelect,
        saveAnswer,
        goToNext,
        goToPrevious,
        submitAnswers
    };
};