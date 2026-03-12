import { userAPI } from '../api'
import { message } from 'antd'

let isRefreshing = false
let refreshSubscribers = []

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

export const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      addRefreshSubscriber((token) => {
        resolve(token)
      })
    })
  }

  isRefreshing = true
  try {
    const oldToken = localStorage.getItem('token')
    const res = await userAPI.refreshToken(oldToken)
    const newToken = res.data
    
    localStorage.setItem('token', newToken)
    isRefreshing = false
    onRefreshed(newToken)
    
    return newToken
  } catch (error) {
    isRefreshing = false
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    message.error('登录已过期，请重新登录')
    window.location.href = '/login'
    throw error
  }
}

export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    return Date.now() >= exp
  } catch (error) {
    return true
  }
}

export const shouldRefreshToken = (token) => {
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    const timeUntilExpiry = exp - Date.now()
    return timeUntilExpiry < 5 * 60 * 1000
  } catch (error) {
    return false
  }
}
