import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/apiClient'

const AuthContext = createContext(null)

const ADMIN_CHECK_ENDPOINT = '/isAdmin'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAccountInfo = useCallback(async () => {
    const response = await api.get('/person/accountInfo')
    const data = response?.data ?? null

    setUser(
      data
        ? {
            username: data.username ?? '',
            email: data.email ?? '',
            hairTypeId: data.hairTypeId ?? null,
            history: Array.isArray(data.history) ? data.history : [],
          }
        : null
    )

    return data
  }, [])

  const checkAdmin = useCallback(async () => {
    try {
      const response = await api.get(ADMIN_CHECK_ENDPOINT)
      const value = Boolean(response?.data)
      setIsAdmin(value)
      return value
    } catch {
      setIsAdmin(false)
      return false
    }
  }, [])

  const checkAuth = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await loadAccountInfo()
      setAuthenticated(true)

      const admin = await checkAdmin()
      return { authenticated: true, isAdmin: admin }
    } catch {
      setAuthenticated(false)
      setUser(null)
      setIsAdmin(false)
      return { authenticated: false, isAdmin: false }
    } finally {
      setLoading(false)
    }
  }, [checkAdmin, loadAccountInfo])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      await api.post(
        '/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return await checkAuth()
    } catch (err) {
      setAuthenticated(false)
      setUser(null)
      setIsAdmin(false)

      const backendError = err?.response?.data?.error
      if (backendError === 'bad_credentials') {
        setError('Неверный email или пароль')
      } else {
        setError(err?.response?.data?.message || 'Ошибка входа')
      }

      return { authenticated: false, isAdmin: false }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)

    try {
      await api.post('/person/registration', {
        email,
        username: name,
        password,
      })

      return await login(email, password)
    } catch (err) {
      setError(err?.response?.data?.message || 'Ошибка регистрации')
      return { authenticated: false, isAdmin: false }
    } finally {
      setLoading(false)
    }
  }

  const settings = async (name, email, password) => {
    setLoading(true)
    setError(null)

    try {
      await api.post('/person/update', {
        username: name,
        email,
        password,
      })

      await checkAuth()
      return true
    } catch (err) {
      setError(err?.response?.data?.message || 'Ошибка обновления данных аккаунта')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)

    try {
      await api.post('/logout', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Ошибка при выходе')
    } finally {
      setAuthenticated(false)
      setUser(null)
      setIsAdmin(false)
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({
      user,
      authenticated,
      isAdmin,
      loading,
      error,
      login,
      register,
      settings,
      logout,
      checkAuth,
      setError,
    }),
    [user, authenticated, isAdmin, loading, error, checkAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}