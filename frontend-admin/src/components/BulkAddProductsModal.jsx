import { useEffect, useState } from 'react'
import { adminApi } from '../api/hairtageApi'
import '../styles/bulk-add-products-modal.css'

const EXAMPLE_JSON = `[
  {
    "productName": "Тестовый шампунь",
    "productTypeName": "Шампунь",
    "ingredients": ["Aqua", "Glycerin"],
    "picUrl": "assets/products/test-shampoo.jpg",
    "price": "LOW"
  },
  {
    "productName": "Тестовая маска",
    "productTypeName": "Маска",
    "ingredients": ["Aqua", "Panthenol"],
    "picUrl": "assets/products/test-mask.jpg",
    "price": "MEDIUM"
  }
]`

function validateProducts(products) {
  if (!Array.isArray(products)) {
    return 'Нужно вставить JSON-массив продуктов'
  }

  if (products.length === 0) {
    return 'Массив продуктов не должен быть пустым'
  }

  for (let i = 0; i < products.length; i += 1) {
    const item = products[i]

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return `Элемент ${i + 1} должен быть объектом`
    }

    if (!String(item.productName || '').trim()) {
      return `У продукта ${i + 1} отсутствует productName`
    }

    if (!String(item.productTypeName || '').trim()) {
      return `У продукта ${i + 1} отсутствует productTypeName`
    }

    if (!Array.isArray(item.ingredients) || item.ingredients.length === 0) {
      return `У продукта ${i + 1} поле ingredients должно быть непустым массивом`
    }

    if (!String(item.picUrl || '').trim()) {
      return `У продукта ${i + 1} отсутствует picUrl`
    }

    if (!['LOW', 'MEDIUM', 'HIGH'].includes(String(item.price || '').trim())) {
      return `У продукта ${i + 1} поле price должно быть LOW, MEDIUM или HIGH`
    }
  }

  return ''
}

export default function BulkAddProductsModal({ isOpen, onClose, onSuccess }) {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setJsonInput(EXAMPLE_JSON)
      setLoading(false)
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    let parsed

    try {
      parsed = JSON.parse(jsonInput)
    } catch (parseError) {
      setError('Некорректный JSON')
      return
    }

    const validationError = validateProducts(parsed)

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      await adminApi.addProducts(parsed)
      setSuccess('Продукты успешно добавлены')

      if (typeof onSuccess === 'function') {
        await onSuccess()
      }

      setTimeout(() => {
        onClose()
      }, 900)
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось массово добавить продукты')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='modal-content bulk-add-products-modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='bulk-add-products-title'>Массовое добавление продуктов</h2>

        <form className='bulk-add-products-form' onSubmit={handleSubmit}>
          <label className='bulk-add-products-label'>
            <span>JSON-массив продуктов</span>
            <textarea
              className='bulk-add-products-textarea'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              disabled={loading}
            />
          </label>

          <p className='bulk-add-products-hint'>
            Вставьте массив объектов с полями: productName, productTypeName,
            ingredients, picUrl, price.
          </p>

          {error && <p className='warn'>{error}</p>}
          {success && <p className='success-note'>{success}</p>}

          <div className='modal-buttons bulk-add-products-buttons'>
            <button
              type='submit'
              className='modal-btn confirm-btn'
              disabled={loading}
            >
              {loading ? 'Добавление...' : 'Добавить'}
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