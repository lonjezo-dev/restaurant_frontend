import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TableLanding from './components/TableLanding'
import MenuPage from './components/MenuPage'
import CartPage from './components/CartPage'
import OrderTracking from './components/OrderTracking'
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/table/:tableId" element={<TableLanding />} />
          <Route path="/table/:tableId/menu" element={<MenuPage />} />
          <Route path="/table/:tableId/cart" element={<CartPage />} /> 
          <Route path="/order/:orderId/tracking" element={<OrderTracking />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🍽️ Restaurant System
        </h1>
        <p className="text-gray-600">Go to /table/1 to test the customer view</p>
      </div>
    </div>
  )
}

export default App