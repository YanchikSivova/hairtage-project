import React from "react";

const QuestionCard = ({question, selectedOptionIndex, onOptionSelect}) =>{
    return(
        <div className="survey-card card">
            <h2>{question.question}</h2>
            {question.options.map((option, index) =>(
                <label key={index} className="option">
                    <input 
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedOptionIndex === index}
                    onChange={()=>onOptionSelect(index)}/>
                    {option}
                </label>
            ))}
        </div>
    );
};

export default QuestionCard;