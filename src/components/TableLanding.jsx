// TableLanding.jsx - Updated version
import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useState, useEffect } from 'react'
import { tableAvailabilityAPI } from '../services/api'

export default function TableLanding() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const setTable = useCartStore(state => state.setTable)
  const [tableStatus, setTableStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkTableAvailability()
  }, [tableId])

  const checkTableAvailability = async () => {
    try {
      setLoading(true)
      const response = await tableAvailabilityAPI.checkImmediateAvailability(tableId)
      setTableStatus(response.data)
      setError(null)
    } catch (err) {
      setError('Unable to verify table availability')
      console.error('Table availability check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartOrder = () => {
    if (tableStatus && !tableStatus.available) {
      alert(`Table ${tableId} is currently ${tableStatus.current_status}. Please see host for assistance.`)
      return
    }
    
    setTable(tableId)
    navigate(`/table/${tableId}/menu`)
  }

  const getStatusBadge = () => {
    if (loading) return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">Checking...</span>
    if (error) return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Unavailable</span>
    if (!tableStatus?.available) return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Occupied</span>
    return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Available</span>
  }

  const getStatusMessage = () => {
    if (loading) return "Checking table status..."
    if (error) return "Unable to verify table status"
    if (!tableStatus?.available) {
      return `Table is currently ${tableStatus?.current_status}. Estimated available: ${tableStatus?.estimated_available_time ? new Date(tableStatus.estimated_available_time).toLocaleTimeString() : 'Unknown'}`
    }
    return "Table is ready for ordering!"
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
          
          {/* Table Status */}
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              You're at <span className="font-semibold text-orange-600">Table {tableId}</span>
            </p>
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getStatusBadge()}
            </div>
            <p className="text-sm text-gray-500">
              {getStatusMessage()}
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartOrder}
            disabled={loading || (tableStatus && !tableStatus.available)}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-md hover:shadow-lg ${
              loading || (tableStatus && !tableStatus.available)
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {loading ? 'Checking...' : 'Start Ordering'}
          </button>

          {/* Help Text */}
          <p className="text-gray-400 text-sm mt-6">
            No app download required • Order directly from your phone
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={checkTableAvailability}
              className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              🔄 Refresh Table Status
            </button>
            {/* <button
              onClick={() => navigate('/reservations')}
              className="w-full bg-green-50 text-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors"
            >
              📅 Make Reservation
            </button> */}
          </div>
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