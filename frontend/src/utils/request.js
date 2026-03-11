import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        message.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        message.error(data.message || '请求失败')
      }
    } else {
      message.error('网络错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request
