import { useState } from 'react'

export default function MenuItemCard({ item, tableId }) {
  const [quantity, setQuantity] = useState(0)

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', { item, quantity, tableId })
    setQuantity(0)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Placeholder for food image */}
      <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
        <span className="text-4xl">
          {item.category === 'main' ? '🍕' : 
           item.category === 'starter' ? '🥗' : 
           item.category === 'dessert' ? '🍰' : '🍹'}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
          <span className="font-bold text-green-600">${item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="flex justify-between items-center">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
            >
              +
            </button>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`px-4 py-2 rounded-lg font-semibold ${
              quantity === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}