import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Editor from './pages/Editor'
import StoreChatbox from './pages/dashboard/StoreChatbox'
import StoreApproval from './pages/dashboard/StoreApproval'
import StoreDashboard from './pages/dashboard/StoreDashboard'
import Team from './pages/dashboard/Team'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/store/:storeId" 
          element={
            <ProtectedRoute>
              <StoreDashboard />
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
          path="/dashboard/team/:teamId?" 
          element={
            <ProtectedRoute>
              <Team />
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
