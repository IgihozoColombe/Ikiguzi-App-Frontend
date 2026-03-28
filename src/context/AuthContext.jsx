import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { tokenStorage } from '../lib/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStorage.get())

  const value = useMemo(() => {
    async function login({ email, password }) {
      const res = await api.post('/api/auth/login', { email, password })
      tokenStorage.set(res.data.token)
      setToken(res.data.token)
    }

    async function register({ name, phone, email, password }) {
      const res = await api.post('/api/auth/register', {
        name,
        phone: phone || undefined,
        email,
        password,
      })
      tokenStorage.set(res.data.token)
      setToken(res.data.token)
    }

    function logout() {
      tokenStorage.clear()
      setToken(null)
    }

    return {
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }
  }, [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

