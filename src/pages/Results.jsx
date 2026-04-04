import { useSearchParams } from 'react-router-dom'
import { useResults } from '../hooks/useResults'
import '../styles/pages/results.css'

const PRICE_LABELS = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
}

function Results() {
  const [searchParams] = useSearchParams()
  const hairTypeIdParam = searchParams.get('hairTypeId')
  const hairTypeId = hairTypeIdParam ? Number(hairTypeIdParam) : null

  const { results, shampoos, masks, conditioners, error, loading } = useResults(hairTypeId)

  const renderProductGrid = (products, categoryTitle) => {
    if (!products || products.length === 0) return null

    return (
      <div className='categoryContainer'>
        <p className='category-title'>{categoryTitle}</p>

        <div className='products-grid'>
          {products.map((product, index) => (
            <div
              key={product.productId || `${product.productName}-${index}`}
              className='product-card'
            >
              {product.picUrl ? (
                <img src={product.picUrl} alt={product.productName} />
              ) : (
                <div className='product-image-placeholder'>Нет изображения</div>
              )}

              <div className='product-info'>
                <p>{product.productName}</p>
                <div className='price'>
                  Ценовой сегмент: {PRICE_LABELS[product.price] || product.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <main className='results'>
        <h1 className='results-title'>Ваша персональная подборка</h1>
        <div className='categoryContainer'>
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className='results'>
        <h1 className='results-title'>Ваша персональная подборка</h1>
        <div className='categoryContainer'>
          <p>Ошибка: {error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className='results'>
      <h1 className='results-title'>Ваша персональная подборка</h1>

      {results.length === 0 && (
        <div className='categoryContainer'>
          <p>Не удалось получить результаты опроса</p>
        </div>
      )}

      {renderProductGrid(shampoos, 'Шампуни')}
      {renderProductGrid(masks, 'Маски')}
      {renderProductGrid(conditioners, 'Бальзамы и кондиционеры')}
    </main>
  )
}

export default Results