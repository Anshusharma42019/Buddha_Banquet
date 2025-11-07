import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Root API
export const rootAPI = {
  healthCheck: () => api.get('/'),
}

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings/create', data),
  getAll: () => api.get('/bookings'),
  getPaginated: (page = 1) => api.get(`/bookings/pg?page=${page}`),
  search: (query) => api.get(`/bookings/search?q=${query}`),
  getById: (id) => api.get(`/bookings/get/${id}`),
  update: (id, data) => api.put(`/bookings/update/${id}`, data),
  delete: (id) => api.delete(`/bookings/delete/${id}`),
}

// Category APIs
export const categoryAPI = {
  create: (data) => api.post('/categories/create', data),
  getAll: () => api.get('/categories/all'),
  getById: (id) => api.get(`/categories/get/${id}`),
  update: (id, data) => api.put(`/categories/update/${id}`, data),
  delete: (id) => api.delete(`/categories/delete/${id}`),
}

// Menu APIs
export const menuAPI = {
  getByBookingId: (bookingId) => api.get(`/menus/${bookingId}`),
  getByCustomerRef: (customerRef) => api.get(`/menus/all/${customerRef}`),
  updateByCustomerRef: (customerRef, data) => api.put(`/menus/update/${customerRef}`, data),
}

// Plan Limit APIs
export const planLimitAPI = {
  getAll: () => api.get('/plan-limits/get'),
  getFormatted: () => api.get('/plan-limits/formatted'),
  getByPlan: (ratePlan, foodType) => api.get(`/plan-limits/${ratePlan}/${foodType}`),
  upsert: (data) => api.post('/plan-limits', data),
  initialize: () => api.post('/plan-limits/initialize'),
}

export default api