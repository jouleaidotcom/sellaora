import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          Full-Stack App
        </h1>
        
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
        
        <div className="text-sm text-gray-500">
          <p>Frontend: React + Vite + TailwindCSS (Port 5173)</p>
          <p>Backend: Node.js + Express (Port 3001)</p>
        </div>
      </div>
    </div>
  )
}

export default App
