import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api/hairtageApi'
import ImageUrlModal from '../../components/ImageUrlModal'
import logo from '../../assets/icons/logo.svg'
import '../../styles/pages/admin-product.css'

const PRICE_OPTIONS = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'HIGH', label: 'HIGH' },
]

// Латиница + цифры + пробелы + знаки, часто встречающиеся в INCI
const INGREDIENTS_PATTERN = /^[A-Za-z0-9\s,.\-()/]+$/

export default function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [productName, setProductName] = useState('')
  const [productTypeName, setProductTypeName] = useState('')
  const [price, setPrice] = useState('LOW')
  const [ingredientsInput, setIngredientsInput] = useState('')
  const [picUrl, setPicUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    document.body.classList.add('admin-product-body')

    return () => {
      document.body.classList.remove('admin-product-body')
    }
  }, [])

  useEffect(() => {
    if (!isEdit) return

    const loadProduct = async () => {
      setLoading(true)
      setError(null)

      try {
        const products = await adminApi.getProducts()
        const product = products.find((item) => item.productId === Number(id))

        if (!product) {
          setError('Продукт не найден')
          return
        }

        setProductName(product.productName || '')
        setProductTypeName(product.productTypeName || '')
        setPrice(product.price || 'LOW')
        setIngredientsInput(
          Array.isArray(product.ingredients) ? product.ingredients.join(', ') : ''
        )
        setPicUrl(product.picUrl || '')
      } catch (err) {
        setError(err?.response?.data?.message || 'Не удалось загрузить продукт')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, isEdit])

  const validateForm = () => {
    const errors = {}

    const trimmedName = productName.trim()
    const trimmedType = productTypeName.trim()
    const trimmedIngredients = ingredientsInput.trim()

    if (!trimmedName) {
      errors.productName = 'Введите название продукта'
    }

    if (!trimmedType) {
      errors.productTypeName = 'Введите тип продукта'
    }

    if (!price || !['LOW', 'MEDIUM', 'HIGH'].includes(price)) {
      errors.price = 'Выберите ценовую категорию'
    }

    if (!trimmedIngredients) {
      errors.ingredients = 'Введите состав продукта'
    } else if (!INGREDIENTS_PATTERN.test(trimmedIngredients)) {
      errors.ingredients =
        'Состав должен содержать только латиницу, цифры, пробелы, запятые, точки, дефисы, скобки и слэш'
    }

    const ingredientList = trimmedIngredients
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (trimmedIngredients && ingredientList.length === 0) {
      errors.ingredients = 'Состав не должен быть пустым'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError(null)
    setSuccessMessage('')
    const validationErrors = validateForm()
    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)

    const productData = {
      productName: productName.trim(),
      productTypeName: productTypeName.trim(),
      ingredients: ingredientsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      picUrl: picUrl.trim(),
      price,
    }

    try {
      if (isEdit) {
        await adminApi.updateProduct(id, productData)
        setSuccessMessage('Продукт успешно обновлён')
      } else {
        await adminApi.createProduct(productData)
        setSuccessMessage('Продукт успешно добавлен')
      }

      setTimeout(() => {
        navigate('/admin/products')
      }, 700)
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось сохранить продукт')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/admin/products')
  }

  const openImageModal = () => {
    setShowImageModal(true)
  }

  const handleSaveImage = (newUrl) => {
    setPicUrl(newUrl)
    setShowImageModal(false)
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
  }

  return (
    <>
      <header className='admin-top'>
        <div className='admin-top-left'>
          <button type='button' className='logout-btn' onClick={handleBack} title='Назад'>
            <svg width='34' height='34' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path
                d='M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
              <path
                d='M3 12h10'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
              <path
                d='M7 8l-4 4 4 4'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          <div className='admin-user'>Администратор</div>
        </div>

        <div className='admin-top-right'>
          <button
            type='button'
            className='brand brand-button'
            onClick={() => navigate('/')}
          >
            <span>Hairtage</span>
            <img src={logo} alt='Hairtage logo' />
          </button>
        </div>
      </header>

      <section className='admin-editor'>
        <form id='admin-product-form' className='editor-card' onSubmit={handleSubmit}>
          <div className='editor-grid'>
            <div className='photo-col'>
              <div className='photo-frame'>
                {picUrl ? (
                  <img src={picUrl} alt={productName || 'product'} />
                ) : (
                  <span>Нет изображения</span>
                )}
              </div>
            </div>

            <div className='fields-col'>
              <label className='field'>
                <span>Название</span>
                <input
                  type='text'
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, productName: '' }))
                  }}
                  disabled={loading}
                />
                {fieldErrors.productName && <p className='warn'>{fieldErrors.productName}</p>}
              </label>

              <label className='field'>
                <span>Тип продукта</span>
                <input
                  type='text'
                  value={productTypeName}
                  onChange={(e) => {
                    setProductTypeName(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, productTypeName: '' }))
                  }}
                  disabled={loading}
                />
                {fieldErrors.productTypeName && (
                  <p className='warn'>{fieldErrors.productTypeName}</p>
                )}
              </label>

              <label className='field'>
                <span>Ценовая категория</span>
                <select
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, price: '' }))
                  }}
                  disabled={loading}
                >
                  {PRICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.price && <p className='warn'>{fieldErrors.price}</p>}
              </label>
            </div>
          </div>

          <label className='field field-full'>
            <span>Состав</span>
            <textarea
              value={ingredientsInput}
              onChange={(e) => {
                setIngredientsInput(e.target.value)
                setFieldErrors((prev) => ({ ...prev, ingredients: '' }))
              }}
              placeholder='Введите ингредиенты через запятую'
              disabled={loading}
            />
            {fieldErrors.ingredients && <p className='warn'>{fieldErrors.ingredients}</p>}
          </label>

          {successMessage && <p className='success-note'>{successMessage}</p>}
          {error && <p className='warn'>{error}</p>}
        </form>

        <aside className='editor-actions'>
          <button
            type='button'
            className='green-btn'
            onClick={openImageModal}
            disabled={loading}
          >
            Изменить изображение
          </button>

          <button type='button' className='green-btn' onClick={handleBack} disabled={loading}>
            Отменить
          </button>

          <button type='submit' form='admin-product-form' className='green-btn' disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </aside>
      </section>

      <ImageUrlModal
        isOpen={showImageModal}
        initialValue={picUrl}
        onSave={handleSaveImage}
        onCancel={handleCloseImageModal}
      />
    </>
  )
}