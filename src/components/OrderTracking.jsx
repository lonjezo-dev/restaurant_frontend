import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ordersAPI } from '../services/api'

export default function OrderTracking() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock order data for development (remove when backend is ready)
  const mockOrder = {
    id: orderId,
    order_status: 'pending',
    total_amount: '25.97',
    order_time: new Date().toISOString(),
    Order_Items: [
      { id: 1, quantity: 1, item_status: 'pending', MenuItem: { name: 'Margherita Pizza' } },
      { id: 2, quantity: 1, item_status: 'pending', MenuItem: { name: 'Caesar Salad' } }
    ]
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      // TODO: Replace with real API call when backend is ready
      // const response = await ordersAPI.getOrder(orderId)
      // setOrder(response.data)
      
      // Using mock data for now
      setTimeout(() => {
        setOrder(mockOrder)
        setLoading(false)
      }, 1000)
      
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000)
    
    return () => clearInterval(interval)
  }, [orderId])

  const statusStages = [
    { key: 'pending', label: 'Order Received', description: 'We got your order!' },
    { key: 'in_progress', label: 'Preparing', description: 'Kitchen is cooking...' },
    { key: 'completed', label: 'Ready', description: 'Your food is ready!' }
  ]

  const currentStatusIndex = statusStages.findIndex(stage => stage.key === order?.order_status)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-600 mt-2">
              Placed at {new Date(order.order_time).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Order Status
          </h2>
          
          <div className="space-y-6">
            {statusStages.map((stage, index) => {
              const isCompleted = index < currentStatusIndex
              const isCurrent = index === currentStatusIndex
              const isUpcoming = index > currentStatusIndex
              
              return (
                <div key={stage.key} className="flex items-start space-x-4">
                  {/* Status Indicator */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-orange-500 text-white animate-pulse' : 
                      'bg-gray-200 text-gray-400'}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  
                  {/* Status Text */}
                  <div className="flex-1 pt-1">
                    <h3 className={`font-semibold ${
                      isCompleted ? 'text-green-600' : 
                      isCurrent ? 'text-orange-600' : 
                      'text-gray-400'
                    }`}>
                      {stage.label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
                    
                    {/* Item Status for current stage */}
                    {isCurrent && order.Order_Items && (
                      <div className="mt-3 space-y-2">
                        {order.Order_Items.map(item => (
                          <div key={item.id} className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                            <span>{item.quantity}x {item.MenuItem.name}</span>
                            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                              {item.item_status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {order.Order_Items?.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div>
                  <span className="font-medium">{item.quantity}x {item.MenuItem.name}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.item_status === 'ready' ? 'bg-green-100 text-green-800' :
                  item.item_status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.item_status}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-green-600">${order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-3">
          <button
            onClick={() => navigate(`/table/${location.state?.tableId || '1'}/menu`)}
            className="block w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600"
          >
            Order More Food
          </button>
          <button
            onClick={() => navigate('/')}
            className="block w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}