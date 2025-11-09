import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'


export default function TableLanding() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const setTable = useCartStore(state => state.setTable)

  const handleStartOrder = () => {
    // Set the table ID in the cart store
    setTable(tableId)
    navigate(`/table/${tableId}/menu`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🍽️ Bella Restaurant</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Welcome Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👋</span>
          </div>
          
          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome!
          </h2>
          <p className="text-gray-600 mb-2">
            You're at <span className="font-semibold text-orange-600">Table {tableId}</span>
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Ready to explore our menu and place your order?
          </p>

          {/* Start Button */}
          <button
            onClick={handleStartOrder}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
          >
            Start Ordering
          </button>

          {/* Help Text */}
          <p className="text-gray-400 text-sm mt-6">
            No app download required • Order directly from your phone
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">⚡</span>
            </div>
            <p className="text-xs text-gray-600">Fast Ordering</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📱</span>
            </div>
            <p className="text-xs text-gray-600">Easy to Use</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🎯</span>
            </div>
            <p className="text-xs text-gray-600">Live Tracking</p>
          </div>
        </div>
      </div>
    </div>
  )
}