import { useEffect, useState } from 'react'
import { adminApi } from '../api/hairtageApi'
import '../styles/assign-admin-modal.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AssignAdminModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setLoading(false)
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()

    setError('')
    setSuccess('')

    if (!trimmedEmail) {
      setError('Введите email пользователя')
      return
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Введите корректный email')
      return
    }

    setLoading(true)

    try {
      await adminApi.addRole(trimmedEmail)
      setSuccess('Роль администратора успешно назначена')

      setTimeout(() => {
        onClose()
      }, 800)
    } catch (err) {
      const backendError = err?.response?.data?.error
      const backendMessage = err?.response?.data?.message

      if (backendError === 'person_not_found') {
        setError('Пользователь с таким email не найден')
      } else {
        setError(backendMessage || 'Не удалось назначить роль администратора')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='modal-content assign-admin-modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='assign-admin-title'>Назначение роли администратора</h2>

        <form className='assign-admin-form' onSubmit={handleSubmit}>
          <label className='assign-admin-label'>
            <span>Email пользователя</span>
            <input
              type='email'
              className='assign-admin-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='user@example.com'
              disabled={loading}
            />
          </label>

          {error && <p className='warn'>{error}</p>}
          {success && <p className='success-note'>{success}</p>}

          <div className='modal-buttons assign-admin-buttons'>
            <button
              type='submit'
              className='modal-btn confirm-btn'
              disabled={loading}
            >
              {loading ? 'Назначение...' : 'Назначить'}
            </button>

            <button
              type='button'
              className='modal-btn cancel-btn'
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}