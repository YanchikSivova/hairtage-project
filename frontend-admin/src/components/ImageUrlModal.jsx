import { useEffect, useState } from 'react'
import '../styles/image-url-modal.css'

export default function ImageUrlModal({
  isOpen,
  initialValue = '',
  onSave,
  onCancel,
}) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue || '')
    }
  }, [isOpen, initialValue])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(value.trim())
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content image-modal-content'>
        <p className='modal-message'>Ссылка на изображение</p>

        <form onSubmit={handleSubmit} className='image-modal-form'>
          <label className='image-modal-label'>
            <span>Путь или URL</span>
            <input
              type='text'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='assets/products/....jpg'
              className='image-modal-input'
              autoFocus
            />
          </label>

          <div className='modal-buttons image-modal-buttons'>
            <button type='submit' className='modal-btn confirm-btn'>
              Сохранить
            </button>
            <button type='button' className='modal-btn cancel-btn' onClick={onCancel}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}