import React from "react";

const Progress = ({current, total}) =>{
    return(
        <div className="survey-counter">
            {current}/{total}
        </div>
    );
};

export default Progress;