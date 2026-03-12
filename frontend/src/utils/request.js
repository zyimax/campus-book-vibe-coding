import axios from 'axios'
import { message } from 'antd'
import { refreshToken, isTokenExpired, shouldRefreshToken } from './auth'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(
  async config => {
    let token = localStorage.getItem('token')
    
    if (token) {
      if (isTokenExpired(token)) {
        try {
          token = await refreshToken()
          config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
          return Promise.reject(error)
        }
      } else if (shouldRefreshToken(token)) {
        refreshToken().catch(() => {})
      }
      
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const { data } = response
    
    if (data.code === 200) {
      return data
    } else {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  async error => {
    console.error('响应错误:', error)
    
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401 && !error.config._retry) {
        try {
          const newToken = await refreshToken()
          error.config._retry = true
          error.config.headers.Authorization = `Bearer ${newToken}`
          return request(error.config)
        } catch (refreshError) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      switch (status) {
        case 401:
          message.error(data.message || '登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          break
        case 403:
          message.error(data.message || '没有权限访问')
          break
        case 404:
          message.error(data.message || '请求的资源不存在')
          break
        case 500:
          message.error(data.message || '服务器错误，请稍后重试')
          break
        default:
          message.error(data.message || '网络错误，请稍后重试')
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default request
