import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getResults, postResults, getSelectionByHairTypeId } from '../api/hairtageApi'

export const useResults = (hairTypeId = null) => {
  const { authenticated } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const receiveResults = async () => {
      setLoading(true)
      setError(null)

      try {
        let data = []

        if (hairTypeId) {
          data = await getSelectionByHairTypeId(hairTypeId)
        } else if (authenticated) {
          data = await getResults()
        } else {
          const answers = localStorage.getItem('answers')

          if (!answers) {
            throw new Error('Нет сохранённых ответов')
          }

          data = await postResults(answers)
        }

        setResults(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Ошибка получения результатов')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    receiveResults()
  }, [authenticated, hairTypeId])

  const shampoos = results.filter((p) =>
    String(p.productTypeName || '').toLowerCase().includes('shampoo')
  )

  const conditioners = results.filter((p) => {
    const type = String(p.productTypeName || '').toLowerCase()
    return type.includes('conditioner') || type.includes('balm')
  })

  const masks = results.filter((p) =>
    String(p.productTypeName || '').toLowerCase().includes('mask')
  )

  return { results, shampoos, conditioners, masks, error, loading }
}