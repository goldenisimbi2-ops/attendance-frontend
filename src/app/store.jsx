import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import api from './api'

const AuthContext = createContext(null)
const TOKEN_KEY = 'attendance_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(
    async (currentToken = token) => {
      if (!currentToken) {
        setUser(null)
        return null
      }

      try {
        const { data } = await api.get('/auth/me')
        // Backend wraps the user object as { success, data: user }.
        const nextUser = data?.data ?? data?.user ?? data
        setUser(nextUser)
        return nextUser
      } catch (error) {
        setUser(null)
        setToken(null)
        localStorage.removeItem(TOKEN_KEY)
        throw error
      }
    },
    [token],
  )

  const login = useCallback(
    async (credentials) => {
      const { data } = await api.post('/auth/login', credentials)
      // Backend returns { success, message, data: { token, user } }.
      const payload = data?.data ?? data
      const nextToken = payload.token || payload.accessToken

      if (!nextToken) {
        throw new Error('No token returned from the server.')
      }

      localStorage.setItem(TOKEN_KEY, nextToken)
      setToken(nextToken)

      const nextUser = payload.user || (await refreshUser(nextToken))
      setUser(nextUser)
      return nextUser
    },
    [refreshUser],
  )

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    const body = data?.data ?? data
    if (body.token) {
      localStorage.setItem(TOKEN_KEY, body.token)
      setToken(body.token)
    }

    const nextUser = body.user || null
    if (nextUser) {
      setUser(nextUser)
    }

    return body
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }, [])

  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY)

      if (!savedToken) {
        setLoading(false)
        return
      }

      try {
        const nextUser = await refreshUser(savedToken)
        if (active && nextUser) {
          setUser(nextUser)
        }
      } catch {
        if (active) {
          setUser(null)
          setToken(null)
          localStorage.removeItem(TOKEN_KEY)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [login, logout, refreshUser, token, user, loading, register],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
export const StoreProvider = AuthProvider

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
export const useStore = useAuth

export default AuthContext
