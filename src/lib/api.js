import axios from 'axios'
import { config } from './config.js'
import { tokenStorage } from './storage.js'

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 20000,
})

api.interceptors.request.use((req) => {
  const token = tokenStorage.get()
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

