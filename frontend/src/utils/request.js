import axios from 'axios'
import { message } from 'antd'
import { refreshToken, isTokenExpired, shouldRefreshToken } from './auth'

/**
 * 缓存管理器类
 * 用于管理API请求的缓存，提高性能并减少重复请求
 */
class CacheManager {
  constructor() {
    this.cache = new Map()
    this.maxAge = 5 * 60 * 1000 // 5分钟缓存
  }

  /**
   * 生成缓存键
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @returns {string} 缓存键
   */
  generateKey(url, params) {
    const key = `${url}${params ? JSON.stringify(params) : ''}`
    return key
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键
   * @returns {Object|null} 缓存数据或null
   */
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    const { data, timestamp } = item
    if (Date.now() - timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return data
  }

  /**
   * 设置缓存数据
   * @param {string} key - 缓存键
   * @param {Object} data - 要缓存的数据
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 清除缓存
   * @param {string} [key] - 缓存键，不传则清除所有缓存
   */
  clear(key) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }
}

// 创建缓存实例
const cacheManager = new CacheManager()

// 并行请求管理，用于避免重复请求
const pendingRequests = new Map()

/**
 * 创建axios实例
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/**
 * 请求拦截器
 * 处理token验证、缓存检查和并行请求管理
 */
request.interceptors.request.use(
  async config => {
    // 公共接口不需要token
    const publicEndpoints = ['/user/login', '/user/register', '/user/refresh-token', '/books', '/books/search', '/books/category']
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint))

    if (!isPublicEndpoint) {
      let token = localStorage.getItem('token')

      if (token) {
        // 检查token是否过期
        if (isTokenExpired(token)) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          return Promise.reject(new Error('Token expired'))
        } 
        // 检查是否需要刷新token
        else if (shouldRefreshToken(token)) {
          refreshToken().catch(() => { })
        }

        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // 处理GET请求的缓存和并行请求
    if (config.method === 'get') {
      const cacheKey = cacheManager.generateKey(config.url, config.params)
      
      // 检查缓存
      const cachedData = cacheManager.get(cacheKey)
      if (cachedData) {
        return Promise.resolve(cachedData)
      }

      // 检查是否有相同请求正在进行
      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey)
      }

      // 标记请求为挂起状态
      const requestPromise = new Promise((resolve, reject) => {
        pendingRequests.set(cacheKey, { resolve, reject })
      })
      
      // 继续执行请求
      return config
    }

    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 处理响应数据、缓存和错误
 */
request.interceptors.response.use(
  response => {
    const { data, config } = response

    if (data.code === 200) {
      // 缓存GET请求的响应
      if (config.method === 'get') {
        const cacheKey = cacheManager.generateKey(config.url, config.params)
        cacheManager.set(cacheKey, data)
        // 移除挂起的请求
        if (pendingRequests.has(cacheKey)) {
          const { resolve } = pendingRequests.get(cacheKey)
          resolve(data)
          pendingRequests.delete(cacheKey)
        }
      }
      return data
    } else {
      const error = new Error(data.message || '请求失败')
      error.response = { data }
      return Promise.reject(error)
    }
  },
  async error => {
    console.error('响应错误:', error)

    // 移除挂起的请求
    if (error.config?.method === 'get') {
      const cacheKey = cacheManager.generateKey(error.config.url, error.config.params)
      if (pendingRequests.has(cacheKey)) {
        const { reject } = pendingRequests.get(cacheKey)
        reject(error)
        pendingRequests.delete(cacheKey)
      }
    }

    // 处理响应错误
    if (error.response) {
      const { status, data } = error.response
      const publicEndpoints = ['/user/login', '/user/register', '/user/refresh-token']
      const isPublicEndpoint = publicEndpoints.some(endpoint => error.config.url?.includes(endpoint))

      // 处理401错误（未授权）
      if (status === 401 && !error.config._retry && !isPublicEndpoint) {
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

      // 处理其他错误状态码
      switch (status) {
        case 400:
          message.error(data.message || '请求参数错误')
          break
        case 401:
          if (!isPublicEndpoint) {
            message.error(data.message || '登录已过期，请重新登录')
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            window.location.href = '/login'
          }
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

/**
 * 并行请求处理
 * @param {Array<Promise>} requests - 请求数组
 * @returns {Promise<Array>} 所有请求的结果数组
 */
export const parallelRequest = async (requests) => {
  try {
    const results = await Promise.all(requests)
    return results
  } catch (error) {
    console.error('并行请求失败:', error)
    throw error
  }
}

/**
 * 清除缓存
 * @param {string} [url] - 请求URL
 * @param {Object} [params] - 请求参数
 */
export const clearCache = (url, params) => {
  if (url) {
    const cacheKey = cacheManager.generateKey(url, params)
    cacheManager.clear(cacheKey)
  } else {
    cacheManager.clear()
  }
}

export default request
