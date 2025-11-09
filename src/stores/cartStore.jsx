import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ordersAPI } from '../services/api'

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart items
      items: [],
      tableId: null,
      
      // Add item to cart
      addItem: (item, quantity, specialInstructions = '') => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          cartItem => cartItem.menu_item_id === item.id && 
          cartItem.special_instructions === specialInstructions
        )

        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          // Add new item
          const newItem = {
            menu_item_id: item.id,
            quantity,
            price: item.price,
            name: item.name,
            special_instructions: specialInstructions
          }
          set({ items: [...items, newItem] })
        }
      },
      
      // Remove item from cart
      removeItem: (index) => {
        const { items } = get()
        const updatedItems = items.filter((_, i) => i !== index)
        set({ items: updatedItems })
      },
      
      // Update item quantity
      updateQuantity: (index, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          get().removeItem(index)
          return
        }
        
        const updatedItems = [...items]
        updatedItems[index].quantity = quantity
        set({ items: updatedItems })
      },
      
      // Calculate total
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      // Get total items count
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      
      // // Clear cart
      clearCart: () => set({ items: [] }),
      
      // // Set table ID
      setTable: (tableId) => set({ tableId }),


      // Submit order to backend
      submitOrder: async (customerNotes = '') => {
        const { items, tableId } = get()
        
        if (items.length === 0) {
          throw new Error('Cart is empty')
        }
        
        if (!tableId) {
          throw new Error('Table number is required')
        }

        try {
          const orderData = {
            table_id: parseInt(tableId),
            customer_notes: customerNotes,
            order_items: items.map(item => ({
              menu_item_id: item.menu_item_id,
              quantity: item.quantity,
              special_instructions: item.special_instructions || ''
            }))
          }

          const response = await ordersAPI.createOrder(orderData)
          const order = response.data.order
          
          // Clear cart after successful order
          get().clearCart()
          
          return order
        } catch (error) {
          console.error('Order submission failed:', error)
          throw new Error(error.response?.data?.error || 'Failed to submit order')
        }
      },
      
      // Set table ID when user starts ordering
      setTable: (tableId) => set({ tableId: parseInt(tableId) }),
    }),
    {
      name: 'restaurant-cart-storage',
    }
  )
)