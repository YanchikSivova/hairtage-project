import { useEffect, useState } from 'react'
import { getSurveys } from '../api/hairtageApi'
import { useNavigate } from 'react-router-dom'
import arrow_left from '../assets/icons/left.svg'
import arrow_right from '../assets/icons/right.svg'

function SurveyHistory() {
  const [surveys, setSurveys] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getSurveys()
        setSurveys(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Не удалось загрузить опросы')
      } finally {
        setLoading(false)
      }
    }

    fetchSurveys()
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + surveys.length) % surveys.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % surveys.length)
  }

  const goToResults = () => {
    const currentSurvey = surveys[currentIndex]
    if (!currentSurvey?.hairTypeId) return

    navigate(`/results?hairTypeId=${currentSurvey.hairTypeId}`)
  }

  const goToSurvey = () => {
    navigate('/survey')
  }

  if (loading) {
    return (
      <div className='surveyHistory-card'>
        <p>Загрузка опросов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='surveyHistory-card error'>
        <p>Ошибка: {error}</p>
        <button className='btn-secondary' onClick={goToSurvey}>
          Пройти опрос
        </button>
      </div>
    )
  }

  if (surveys.length === 0) {
    const today = new Date().toLocaleDateString('ru-RU')

    return (
      <>
        <div className='surveyHistory-card'>
          <h3>{today}</h3>
          <p>Данных о прохождении опроса нет</p>
          <button className='btn-secondary' onClick={goToSurvey}>
            Пройти опрос
          </button>
        </div>
        <button className='arrow left' style={{ display: 'none' }}></button>
        <button className='arrow right' style={{ display: 'none' }}></button>
      </>
    )
  }

  const survey = surveys[currentIndex]

  return (
    <>
      <button className='arrow left' onClick={goToPrevious} disabled={surveys.length <= 1}>
        <img src={arrow_left} alt='' />
      </button>

      <div className='surveyHistory-card'>
        <h3>{new Date(survey.createdAt).toLocaleDateString('ru-RU')}</h3>

        <ul>
          <li>Тип волос: {survey.hairTypeName || 'Не указан'}</li>
        </ul>

        <div className='survey-actions'>
          <button className='btn-secondary' onClick={goToResults}>
            Посмотреть подборку
          </button>
          <button className='btn-secondary' onClick={goToSurvey}>
            Перепройти опрос
          </button>
        </div>
      </div>

      <button className='arrow right' onClick={goToNext} disabled={surveys.length <= 1}>
        <img src={arrow_right} alt='' />
      </button>
    </>
  )
}

export default SurveyHistory