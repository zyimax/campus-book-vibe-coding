import request from '../utils/request'

/**
 * 用户相关API
 */
export const userAPI = {
  /**
   * 用户注册
   * @param {Object} data - 注册信息
   * @param {string} data.username - 用户名
   * @param {string} data.email - 邮箱
   * @param {string} data.phone - 手机号
   * @param {string} data.password - 密码
   * @returns {Promise} - 注册结果
   */
  register: (data) => request.post('/user/register', data),
  
  /**
   * 用户登录
   * @param {Object} data - 登录信息
   * @param {string} data.username - 用户名/邮箱/手机号
   * @param {string} data.password - 密码
   * @returns {Promise} - 登录结果，包含token
   */
  login: (data) => request.post('/user/login', data),
  
  /**
   * 获取用户个人资料
   * @returns {Promise} - 用户资料信息
   */
  getProfile: () => request.get('/user/profile'),
  
  /**
   * 更新用户个人资料
   * @param {Object} data - 资料更新信息
   * @returns {Promise} - 更新结果
   */
  updateProfile: (data) => request.put('/user/profile', data),
  
  /**
   * 用户登出
   * @returns {Promise} - 登出结果
   */
  logout: () => request.post('/user/logout'),
  
  /**
   * 刷新Token
   * @param {string} token - 刷新token
   * @returns {Promise} - 新的token
   */
  refreshToken: (token) => request.post('/user/refresh-token', { token })
}

/**
 * 图书相关API
 */
export const bookAPI = {
  /**
   * 获取图书列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.category - 分类
   * @param {string} params.keyword - 关键词
   * @returns {Promise} - 图书列表
   */
  getList: (params) => request.get('/books', { params }),
  
  /**
   * 获取图书详情
   * @param {string} id - 图书ID
   * @returns {Promise} - 图书详情
   */
  getDetail: (id) => request.get(`/books/${id}`),
  
  /**
   * 发布图书
   * @param {Object} data - 图书信息
   * @returns {Promise} - 发布结果
   */
  publish: (data) => request.post('/books', data),
  
  /**
   * 更新图书信息
   * @param {string} id - 图书ID
   * @param {Object} data - 更新信息
   * @returns {Promise} - 更新结果
   */
  update: (id, data) => request.put(`/books/${id}`, data),
  
  /**
   * 删除图书
   * @param {string} id - 图书ID
   * @returns {Promise} - 删除结果
   */
  delete: (id) => request.delete(`/books/${id}`),
  
  /**
   * 搜索图书
   * @param {Object} params - 搜索参数
   * @param {string} params.keyword - 关键词
   * @param {string} params.category - 分类
   * @returns {Promise} - 搜索结果
   */
  search: (params) => request.get('/books/search', { params }),
  
  /**
   * 获取图书分类
   * @param {string} type - 分类类型
   * @returns {Promise} - 分类列表
   */
  getCategory: (type) => request.get(`/books/category/${type}`)
}

/**
 * 订单相关API
 */
export const orderAPI = {
  /**
   * 创建订单
   * @param {Object} data - 订单信息
   * @returns {Promise} - 创建结果
   */
  create: (data) => request.post('/orders', data),
  
  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.status - 订单状态
   * @returns {Promise} - 订单列表
   */
  getList: (params) => request.get('/orders', { params }),
  
  /**
   * 获取订单详情
   * @param {string} id - 订单ID
   * @returns {Promise} - 订单详情
   */
  getDetail: (id) => request.get(`/orders/${id}`),
  
  /**
   * 取消订单
   * @param {string} id - 订单ID
   * @returns {Promise} - 取消结果
   */
  cancel: (id) => request.put(`/orders/${id}/cancel`),
  
  /**
   * 支付订单
   * @param {string} id - 订单ID
   * @returns {Promise} - 支付结果
   */
  pay: (id) => request.put(`/orders/${id}/pay`),
  
  /**
   * 发货
   * @param {string} id - 订单ID
   * @returns {Promise} - 发货结果
   */
  ship: (id) => request.put(`/orders/${id}/ship`),
  
  /**
   * 确认收货
   * @param {string} id - 订单ID
   * @returns {Promise} - 确认结果
   */
  confirm: (id) => request.put(`/orders/${id}/confirm`)
}

/**
 * 上传相关API
 */
export const uploadAPI = {
  /**
   * 上传图片
   * @param {File} file - 图片文件
   * @returns {Promise} - 上传结果，包含图片URL
   */
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  /**
   * 删除图片
   * @param {string} filename - 图片文件名
   * @returns {Promise} - 删除结果
   */
  deleteImage: (filename) => request.delete(`/upload/image/${filename}`)
}

/**
 * 地址相关API
 */
export const addressAPI = {
  /**
   * 获取地址列表
   * @returns {Promise} - 地址列表
   */
  getList: () => request.get('/addresses'),
  
  /**
   * 添加地址
   * @param {Object} data - 地址信息
   * @returns {Promise} - 添加结果
   */
  add: (data) => request.post('/addresses', data),
  
  /**
   * 更新地址
   * @param {string} id - 地址ID
   * @param {Object} data - 更新信息
   * @returns {Promise} - 更新结果
   */
  update: (id, data) => request.put(`/addresses/${id}`, data),
  
  /**
   * 删除地址
   * @param {string} id - 地址ID
   * @returns {Promise} - 删除结果
   */
  delete: (id) => request.delete(`/addresses/${id}`),
  
  /**
   * 设置默认地址
   * @param {string} id - 地址ID
   * @returns {Promise} - 设置结果
   */
  setDefault: (id) => request.put(`/addresses/${id}/default`)
}
