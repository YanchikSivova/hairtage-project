import { useEffect, useMemo, useState } from 'react'
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

function getProductTypeName(product) {
  return (
    product?.productTypeName ||
    product?.productType?.productTypeName ||
    ''
  )
}

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

  const [productTypes, setProductTypes] = useState([])
  const [typesLoading, setTypesLoading] = useState(true)

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
    const loadProductTypes = async () => {
      setTypesLoading(true)

      try {
        const products = await adminApi.getProducts()
        const uniqueTypes = Array.from(
          new Set(
            (Array.isArray(products) ? products : [])
              .map(getProductTypeName)
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b, 'ru'))

        setProductTypes(uniqueTypes)
      } catch (err) {
        setProductTypes([])
      } finally {
        setTypesLoading(false)
      }
    }

    loadProductTypes()
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

        const currentTypeName = getProductTypeName(product)

        setProductName(product.productName || '')
        setProductTypeName(currentTypeName)
        setPrice(product.price || 'LOW')
        setIngredientsInput(
          Array.isArray(product.ingredients || product.ingredientsList)
            ? (product.ingredients || product.ingredientsList).join(', ')
            : ''
        )
        setPicUrl(product.picUrl || '')

        setProductTypes((prev) => {
          if (!currentTypeName || prev.includes(currentTypeName)) {
            return prev
          }

          return [...prev, currentTypeName].sort((a, b) => a.localeCompare(b, 'ru'))
        })
      } catch (err) {
        setError(err?.response?.data?.message || 'Не удалось загрузить продукт')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, isEdit])

  const isSubmitDisabled = useMemo(() => {
    return loading || typesLoading || productTypes.length === 0
  }, [loading, typesLoading, productTypes.length])

  const validateForm = () => {
    const errors = {}

    const trimmedName = productName.trim()
    const trimmedType = productTypeName.trim()
    const trimmedIngredients = ingredientsInput.trim()
    const trimmedPicUrl = picUrl.trim()

    if (!trimmedName) {
      errors.productName = 'Введите название продукта'
    }

    if (!trimmedType) {
      errors.productTypeName = 'Выберите тип продукта'
    } else if (!productTypes.includes(trimmedType)) {
      errors.productTypeName = 'Выберите тип продукта из списка'
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

    if (!trimmedPicUrl) {
      errors.picUrl = 'Добавьте ссылку на изображение'
    }

    if (productTypes.length === 0) {
      errors.productTypeName = 'Не удалось загрузить типы продуктов'
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
    setFieldErrors((prev) => ({ ...prev, picUrl: '' }))
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
          <div className='brand admin-brand-static' aria-label='Hairtage'>
            <span>Hairtage</span>
            <img src={logo} alt='Hairtage logo' />
          </div>
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
              {fieldErrors.picUrl && <p className='warn'>{fieldErrors.picUrl}</p>}
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
                <select
                  value={productTypeName}
                  onChange={(e) => {
                    setProductTypeName(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, productTypeName: '' }))
                  }}
                  disabled={loading || typesLoading || productTypes.length === 0}
                >
                  <option value=''>
                    {typesLoading
                      ? 'Загрузка типов продуктов...'
                      : productTypes.length === 0
                        ? 'Типы продуктов недоступны'
                        : 'Выберите тип продукта'}
                  </option>

                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
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

          <button
            type='submit'
            form='admin-product-form'
            className='green-btn'
            disabled={isSubmitDisabled}
          >
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