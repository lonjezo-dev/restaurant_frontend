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

   // Get kitchen display orders
  getKitchenOrders: () => api.get('/orders/kitchen/display'),
  
  // Update order item status
  updateItemStatus: (orderId, itemId, status) => 
    api.patch(`/orders/${orderId}/items/${itemId}/status`, { item_status: status }),
}

export const tablesAPI = {
  // Get all tables
  getTables: () => api.get('/table'),
  
  // Get specific table
  getTable: (id) => api.get(`/table/${id}`),
}


export const tableAvailabilityAPI = {
  // Get all tables status
  getAllTablesStatus: () => api.get('/tables/status'),
  
  // Check table availability for specific time
  checkTableAvailability: (tableId, datetime, duration = 90) => 
    api.get(`/tables/availability/${tableId}`, {
      params: { datetime, duration }
    }),
  
  // Check immediate table availability
  checkImmediateAvailability: (tableId) => 
    api.get(`/tables/availability/${tableId}/immediate`),
  
  // Find available tables based on search criteria
  findAvailableTables: (searchCriteria) => 
    api.post('/tables/availability/search', searchCriteria),
  
  // Get detailed table status
  getTableStatus: (tableId) => api.get(`/tables/${tableId}/status`),
}





export default api