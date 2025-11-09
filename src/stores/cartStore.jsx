import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      
      // Clear cart
      clearCart: () => set({ items: [] }),
      
      // Set table ID
      setTable: (tableId) => set({ tableId }),
    }),
    {
      name: 'restaurant-cart-storage',
    }
  )
)