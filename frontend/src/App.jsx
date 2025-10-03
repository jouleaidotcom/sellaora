import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Editor from './pages/Editor'
import StoreChatbox from './pages/dashboard/StoreChatbox'
import StoreApproval from './pages/dashboard/StoreApproval'
import ProtectedRoute from './components/ProtectedRoute'
import { getAuthToken } from './utils/api'

// Home Page Component
function HomePage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isAuthenticated = !!getAuthToken()

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/hello')
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const data = await response.json()
        setMessage(data.message)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Sellaora
        </h1>
        <p className="text-gray-600 mb-8">
          The AI alternative to Shopify
        </p>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Backend Connection Status:
          </h2>
          
          {loading && (
            <div className="text-blue-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading...
            </div>
          )}
          
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
              <p className="text-sm mt-2">Make sure the backend server is running on port 3001</p>
            </div>
          )}
          
          {message && !loading && !error && (
            <div className="text-green-600 bg-green-50 p-4 rounded-lg">
              <p className="font-medium">✅ Connected!</p>
              <p className="text-lg mt-2">"{message}"</p>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="space-y-3 mb-6">
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </a>
          ) : (
            <>
              <a
                href="/login"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Account
              </a>
            </>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Frontend: React + Vite + TailwindCSS</p>
          <p>Backend: Node.js + Express + MongoDB</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/store/:storeId/chatbox" 
          element={
            <ProtectedRoute>
              <StoreChatbox />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/store/:storeId/approval" 
          element={
            <ProtectedRoute>
              <StoreApproval />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/store/:storeId/editor" 
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/products" 
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/products/new" 
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/dashboard/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:themeId"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
