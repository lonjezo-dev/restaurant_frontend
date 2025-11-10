import { useState, useEffect } from 'react'
import { ordersAPI } from '../services/api'

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchKitchenOrders = async () => {
    try {
      const response = await ordersAPI.getKitchenOrders()
      console.log('Fetched Orders:', response.data)
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch kitchen orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateItemStatus = async (orderId, itemId, newStatus) => {
    try {
      await ordersAPI.updateItemStatus(orderId, itemId, newStatus)

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                order_Items: order.order_Items.map(item =>
                  item.id === itemId ? { ...item, item_status: newStatus } : item
                ),
              }
            : order
        )
      )

      console.log(`Updated order ${orderId} item ${itemId} to ${newStatus}`)
    } catch (error) {
      console.error('Failed to update item status:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus)
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      )
      console.log(`Updated order ${orderId} to ${newStatus}`)
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  useEffect(() => {
    fetchKitchenOrders()
    const interval = setInterval(fetchKitchenOrders, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const pendingOrders = orders.filter(o => o.order_status === 'pending')
  const inProgressOrders = orders.filter(o => o.order_status === 'in_progress')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading kitchen orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">👨‍🍳 Kitchen Dashboard</h1>
          <div className="flex space-x-6 mt-2 text-sm">
            <span className="bg-red-500 px-3 py-1 rounded-full">
              New: {pendingOrders.length}
            </span>
            <span className="bg-orange-500 px-3 py-1 rounded-full">
              Cooking: {inProgressOrders.length}
            </span>
            <span className="text-gray-400">
              Total: {orders.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* New Orders */}
        <Section
          title="🆕 New Orders"
          color="text-red-400"
          orders={pendingOrders}
          onUpdateItemStatus={updateItemStatus}
          onUpdateOrderStatus={updateOrderStatus}
          emptyText="No new orders at the moment"
        />

        {/* Orders in Progress */}
        <Section
          title="👨‍🍳 Orders in Progress"
          color="text-orange-400"
          orders={inProgressOrders}
          onUpdateItemStatus={updateItemStatus}
          onUpdateOrderStatus={updateOrderStatus}
          emptyText="No orders in progress"
        />
      </div>
    </div>
  )
}

function Section({ title, color, orders, onUpdateItemStatus, onUpdateOrderStatus, emptyText }) {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${color}`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateItemStatus={onUpdateItemStatus}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">{emptyText}</div>
        )}
      </div>
    </div>
  )
}

// Order Card Component
function OrderCard({ order, onUpdateItemStatus, onUpdateOrderStatus }) {
  const getTimeSinceOrder = (orderTime) => {
    const diff = Math.floor((new Date() - new Date(orderTime)) / 60000)
    return `${diff} min ago`
  }

  const handleStartOrder = () => onUpdateOrderStatus(order.id, 'in_progress')
  const handleCompleteOrder = () => onUpdateOrderStatus(order.id, 'completed')

  const allItemsReady = order.order_Items?.every(item => item.item_status === 'ready')

  return (
    <div
      className={`bg-gray-800 rounded-lg border-l-4 ${
        order.order_status === 'pending' ? 'border-red-500' : 'border-orange-500'
      } p-4`}
    >
      {/* Order Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">Order #{order.id}</h3>
          <p className="text-gray-400 text-sm">Table {order.table?.table_number}</p>
          <p className="text-gray-500 text-xs">{getTimeSinceOrder(order.order_time)}</p>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-bold ${
            order.order_status === 'pending' ? 'bg-red-500' : 'bg-orange-500'
          }`}
        >
          {order.order_status.toUpperCase()}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.order_Items?.map(item => (
          <div key={item.id} className="flex justify-between items-center py-1">
            <div className="flex-1">
              <span className="font-medium">
                {item.quantity}x {item.MenuItem?.name}
              </span>
              {item.special_instructions && (
                <p className="text-xs text-gray-400 mt-1">💡 {item.special_instructions}</p>
              )}
            </div>
            <select
              value={item.item_status}
              onChange={e => onUpdateItemStatus(order.id, item.id, e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
            </select>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {order.order_status === 'pending' && (
          <button
            onClick={handleStartOrder}
            className="flex-1 bg-orange-500 text-white py-2 px-3 rounded text-sm font-semibold hover:bg-orange-600"
          >
            Start Cooking
          </button>
        )}
        {order.order_status === 'in_progress' && allItemsReady && (
          <button
            onClick={handleCompleteOrder}
            className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm font-semibold hover:bg-green-600"
          >
            Complete Order
          </button>
        )}
      </div>
    </div>
  )
}
