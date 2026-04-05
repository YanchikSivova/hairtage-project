import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, authApi } from '../../api/hairtageApi'
import { useAuth } from '../../hooks/useAuth'
import ConfirmModal from '../../components/ConfirmModal'
import AssignAdminModal from '../../components/AssignAdminModal'
import BulkAddProductsModal from '../../components/BulkAddProductsModal'
import logo from '../../assets/icons/logo.svg'
import '../../styles/pages/admin-products.css'

const PRICE_LABELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  low: 'low',
  medium: 'medium',
  high: 'high',
}

function normalizeProduct(product) {
  return {
    ...product,
    productTypeName:
      product.productTypeName ||
      product.productType?.productTypeName ||
      'Без категории',
    ingredients:
      product.ingredients ||
      product.ingredientsList ||
      [],
  }
}

function buildAdminDisplayName(profile) {
  const username = String(profile?.username || '').trim()

  if (username) {
    return `admin_${username}`
  }

  return 'Администратор'
}

export default function AdminProducts() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAssignAdminModal, setShowAssignAdminModal] = useState(false)
  const [showBulkAddProductsModal, setShowBulkAddProductsModal] = useState(false)
  const [adminName, setAdminName] = useState('Администратор')

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await adminApi.getProducts()
      const normalized = Array.isArray(data)
        ? data.map(normalizeProduct)
        : []

      setProducts(normalized)
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось загрузить продукты')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.body.classList.add('admin-products-body')

    return () => {
      document.body.classList.remove('admin-products-body')
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const profile = await authApi.getMe()
        setAdminName(buildAdminDisplayName(profile))
      } catch (err) {
        setAdminName('Администратор')
      }
    }

    loadAdminProfile()
  }, [])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return products

    return products.filter((product) => {
      const ingredientsText = Array.isArray(product.ingredients)
        ? product.ingredients.join(' ').toLowerCase()
        : ''

      return (
        String(product.productName || '').toLowerCase().includes(query) ||
        String(product.productTypeName || '').toLowerCase().includes(query) ||
        ingredientsText.includes(query) ||
        String(product.price || '').toLowerCase().includes(query)
      )
    })
  }, [products, search])

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const type = product.productTypeName || 'Без категории'

      if (!acc[type]) {
        acc[type] = []
      }

      acc[type].push(product)
      return acc
    }, {})
  }, [filteredProducts])

  const selectedProduct =
    products.find((product) => product.productId === selectedId) || null

  const handleCreate = () => {
    navigate('/admin/products/new')
  }

  const handleEdit = () => {
    if (!selectedProduct) return
    navigate(`/admin/products/${selectedProduct.productId}/edit`)
  }

  const openDeleteModal = () => {
    if (!selectedProduct) return
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedProduct) return

    try {
      await adminApi.deleteProduct(selectedProduct.productId)

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.productId !== selectedProduct.productId
        )
      )
      setSelectedId(null)
      setShowDeleteModal(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось удалить продукт')
      setShowDeleteModal(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const handleBulkAddSuccess = async () => {
    await fetchProducts()
  }

  return (
    <>
      <header className='admin-top'>
        <div className='admin-top-left'>
          <button type='button' className='logout-btn' onClick={handleLogout} title='Выйти'>
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

          <div className='admin-user'>{adminName}</div>
        </div>

        <div className='admin-top-right'>
          <div className='admin-service-toolbar'>
            <button
              type='button'
              className='admin-top-action-btn'
              onClick={() => setShowAssignAdminModal(true)}
              disabled={loading}
            >
              Добавить админа
            </button>

            <button
              type='button'
              className='admin-top-action-btn'
              onClick={() => setShowBulkAddProductsModal(true)}
              disabled={loading}
            >
              Загрузить базу (JSON)
            </button>
          </div>

          <div className='brand admin-brand-static' aria-label='Hairtage'>
            <span>Hairtage</span>
            <img src={logo} alt='Hairtage logo' />
          </div>
        </div>
      </header>

      <section className='admin-toolbar'>
        <div className='admin-search'>
          <input
            type='text'
            placeholder=''
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className='search-icon' aria-hidden='true'>
            <svg width='26' height='26' viewBox='0 0 24 24' fill='none'>
              <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
              <path
                d='M20 20l-3.5-3.5'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </span>
        </div>

        <div className='admin-actions'>
          <button
            type='button'
            className='action-btn'
            onClick={handleEdit}
            title='Редактировать'
            disabled={!selectedProduct || loading}
          >
            <svg width='30' height='30' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M12 20h9' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              <path
                d='M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          <button
            type='button'
            className='action-btn'
            onClick={openDeleteModal}
            title='Удалить'
            disabled={!selectedProduct || loading}
          >
            <svg width='30' height='30' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M3 6h18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              <path d='M8 6V4h8v2' stroke='currentColor' strokeWidth='2' strokeLinejoin='round' />
              <path d='M6.5 6l1 15h9l1-15' stroke='currentColor' strokeWidth='2' strokeLinejoin='round' />
              <path d='M10 11v6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              <path d='M14 11v6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </button>

          <button
            type='button'
            className='action-btn'
            onClick={handleCreate}
            title='Добавить'
            disabled={loading}
          >
            <svg width='30' height='30' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='2' />
              <path d='M12 8v8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              <path d='M8 12h8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </button>
        </div>
      </section>

      <main className='admin-content'>
        {loading ? (
          <section className='category'>
            <h2 className='category-title'>Загрузка...</h2>
          </section>
        ) : error ? (
          <section className='category'>
            <h2 className='category-title'>Ошибка</h2>
            <p>{error}</p>
          </section>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <section className='category'>
            <h2 className='category-title'>Ничего не найдено</h2>
          </section>
        ) : (
          Object.entries(groupedProducts).map(([type, items]) => (
            <section className='category' key={type}>
              <h2 className='category-title'>{type}</h2>

              <div className='products-grid'>
                {items.map((product) => (
                  <article
                    key={product.productId}
                    className={`product-card ${
                      selectedId === product.productId ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedId(product.productId)}
                  >
                    {product.picUrl ? (
                      <img src={product.picUrl} alt={product.productName} />
                    ) : (
                      <div>Нет фото</div>
                    )}

                    <div className='product-info'>
                      <p>{product.productName}</p>
                      <p className='price'>
                        {PRICE_LABELS[product.price] || String(product.price || '')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        message={
          selectedProduct
            ? `Удалить продукт "${selectedProduct.productName}"?`
            : 'Удалить продукт?'
        }
      />

      <AssignAdminModal
        isOpen={showAssignAdminModal}
        onClose={() => setShowAssignAdminModal(false)}
      />

      <BulkAddProductsModal
        isOpen={showBulkAddProductsModal}
        onClose={() => setShowBulkAddProductsModal(false)}
        onSuccess={handleBulkAddSuccess}
      />
    </>
  )
}