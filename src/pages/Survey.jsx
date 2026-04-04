import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/survey.css'
import comb from '../assets/icons/comb.svg'
import brush from '../assets/icons/brush.svg'
import QuestionCard from '../components/QuestionCard'
import Progress from '../components/Progress'
import arrowLeft from '../assets/icons/arrow-left.svg'
import arrowRight from '../assets/icons/arrow-right.svg'
import { useAuth } from '../hooks/useAuth'
import { useSurvey } from '../hooks/useSurvey'
import { postAuthSurveys } from '../api/hairtageApi'

const Survey = () => {
  const { authenticated } = useAuth()
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    currentIndex,
    currentQuestion,
    selectedOptionIndex,
    totalQuestions,
    isLastQuestion,
    handleOptionSelect,
    saveAnswer,
    goToNext,
    goToPrevious,
    submitAnswers,
    answers,
  } = useSurvey()

  const handleNext = async () => {
    if (selectedOptionIndex === null) {
      setShowWarning(true)
      return
    }

    setShowWarning(false)
    setSubmitError('')

    const saved = saveAnswer()

    if (!saved) return

    if (!isLastQuestion) {
      goToNext()
      return
    }

    try {
      const finalAnswers = await submitAnswers()

      if (authenticated) {
        await postAuthSurveys(finalAnswers)
        navigate('/results')
      } else {
        navigate('/survey/success')
      }
    } catch (error) {
      setSubmitError(error?.message || 'Не удалось сохранить ответы')
    }
  }

  const handlePrevious = () => {
    setShowWarning(false)
    goToPrevious()
  }

  return (
    <div>
      <div className='decor-left'>
        <img src={comb} alt='' />
      </div>
      <div className='decor-right'>
        <img src={brush} alt='' />
      </div>

      <main className='survey-container'>
        <Progress current={currentIndex + 1} total={totalQuestions} />

        <QuestionCard
          question={currentQuestion}
          selectedOptionIndex={selectedOptionIndex}
          onOptionSelect={handleOptionSelect}
        />

        <div className='survey-controls'>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className='nav-btn'
            id='prevBtn'
          >
            <img src={arrowLeft} alt='' />
          </button>

          <button onClick={handleNext} className='nav-btn' id='nextBtn'>
            {isLastQuestion ? 'Конец' : <img src={arrowRight} alt='' />}
          </button>
        </div>

        {showWarning && <p className='warning'>Пожалуйста, выберите вариант ответа</p>}
        {submitError && <p className='warning'>{submitError}</p>}
      </main>
    </div>
  )
}

export default Survey