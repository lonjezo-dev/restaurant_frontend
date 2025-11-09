import axios from 'axios'

const API_BASE_URL = 'https://codealpha-restaurant-management-system-1.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const menuAPI = {
  // Get all menu items
  getMenuItems: () => api.get('/menu-items'),
  
  // Get specific menu item
  getMenuItem: (id) => api.get(`/menu-items/${id}`),
}

export const ordersAPI = {
  // Create new order
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Get order details
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Update order status
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}

export const tablesAPI = {
  // Get all tables
  getTables: () => api.get('/table'),
  
  // Get specific table
  getTable: (id) => api.get(`/table/${id}`),
}

export default api