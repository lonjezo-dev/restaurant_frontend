import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'

export default function CartPage() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotal, 
    clearCart,
    getTotalItems 
  } = useCartStore()

  const handleCheckout = async () => {
    // TODO: Implement order submission
    console.log('Checking out:', { tableId, items })
    alert('Order functionality coming soon!')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious items from our menu</p>
          <button
            onClick={() => navigate(`/table/${tableId}/menu`)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Your Order</h1>
            <p className="text-sm text-gray-500">Table {tableId}</p>
          </div>
          <button 
            onClick={() => navigate(`/table/${tableId}/menu`)}
            className="text-orange-500 font-semibold"
          >
            Add More Items
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.special_instructions && (
                  <p className="text-sm text-gray-500 mt-1">{item.special_instructions}</p>
                )}
                <p className="text-green-600 font-semibold">${item.price} each</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-green-600">${getTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-md"
        >
          Place Order (${getTotal().toFixed(2)})
        </button>
        
        {/* Clear Cart */}
        <button
          onClick={clearCart}
          className="w-full mt-3 text-gray-500 py-2 px-6 rounded-lg font-medium hover:text-gray-700"
        >
          Clear Cart
        </button>
      </div>
    </div>
  )
}