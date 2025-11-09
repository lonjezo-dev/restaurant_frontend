import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { menuAPI } from '../services/api'

export default function MenuPage() {
  const { tableId } = useParams()
  const navigate = useNavigate()

  const { data: menuItems, loading, error } = useApi(menuAPI.getMenuItems)

   if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Menu Unavailable</h2>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Group menu items by category
  const menuByCategory = menuItems?.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Our Menu</h1>
            <p className="text-sm text-gray-500">Table {tableId}</p>
          </div>
          <button 

           onClick={() => navigate(`/table/${tableId}/cart`)}
           className="bg-orange-500 text-white px-4 py-2 rounded-lg"
           >
            Cart (0)
          </button>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* <div className="text-center py-12">
          <div className="text-6xl mb-4">🍕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Menu Coming Soon!
          </h2>
          <p className="text-gray-500">
            We're working on loading our delicious menu items...
          </p>
        </div> */}
         {Object.entries(menuByCategory || {}).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  tableId={tableId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}