import request from '../utils/request'

export const userAPI = {
  register: (data) => request.post('/user/register', data),
  login: (data) => request.post('/user/login', data),
  getProfile: () => request.get('/user/profile'),
  updateProfile: (data) => request.put('/user/profile', data),
  logout: () => request.post('/user/logout')
}

export const bookAPI = {
  getList: (params) => request.get('/books', { params }),
  getDetail: (id) => request.get(`/books/${id}`),
  publish: (data) => request.post('/books', data),
  update: (id, data) => request.put(`/books/${id}`, data),
  delete: (id) => request.delete(`/books/${id}`),
  search: (params) => request.get('/books/search', { params }),
  getCategory: (type) => request.get(`/books/category/${type}`)
}

export const orderAPI = {
  create: (data) => request.post('/orders', data),
  getList: (params) => request.get('/orders', { params }),
  getDetail: (id) => request.get(`/orders/${id}`),
  cancel: (id) => request.put(`/orders/${id}/cancel`),
  confirm: (id) => request.put(`/orders/${id}/confirm`)
}

export const addressAPI = {
  getList: () => request.get('/addresses'),
  add: (data) => request.post('/addresses', data),
  update: (id, data) => request.put(`/addresses/${id}`, data),
  delete: (id) => request.delete(`/addresses/${id}`),
  setDefault: (id) => request.put(`/addresses/${id}/default`)
}
