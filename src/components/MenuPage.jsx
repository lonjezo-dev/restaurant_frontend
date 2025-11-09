import { useParams } from 'react-router-dom'

export default function MenuPage() {
  const { tableId } = useParams()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Our Menu</h1>
            <p className="text-sm text-gray-500">Table {tableId}</p>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Cart (0)
          </button>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Menu Coming Soon!
          </h2>
          <p className="text-gray-500">
            We're working on loading our delicious menu items...
          </p>
        </div>
      </div>
    </div>
  )
}