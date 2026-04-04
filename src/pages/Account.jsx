import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import SurveyHistory from '../components/SurveyHistory'
import '../styles/pages/account.css'

function Account() {
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false)
    await logout()
    navigate('/')
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  const goToSettings = () => {
    navigate('/account/settings')
  }

  useEffect(() => {
    document.body.classList.add('with-pic')

    return () => {
      document.body.classList.remove('with-pic')
    }
  }, [])

  return (
    <main className='account'>
      <section className='profile-card'>
        <h2>{user?.username || 'Пользователь'}</h2>
        <p>{user?.email || ''}</p>

        <div className='buttons'>
          <button className='btn-account' onClick={goToSettings}>
            Изменить
          </button>
          <button className='btn-account' onClick={handleLogoutClick}>
            Выйти
          </button>
        </div>
      </section>

      <section className='survey-section'>
        <SurveyHistory />
      </section>

      <ConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        message='Вы хотите выйти из аккаунта?'
      />
    </main>
  )
}

export default Account