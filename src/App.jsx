import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Toast from './components/common/Toast'
import CreateBoardModal from './components/board/CreateBoardModal'

import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import PinDetailPage from './pages/PinDetailPage'
import CreatePinPage from './pages/CreatePinPage'
import ProfilePage from './pages/ProfilePage'
import BoardDetailPage from './pages/BoardDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/common/ProtectedRoute'

export default function App() {
  const [isGlobalCreateBoardOpen, setIsGlobalCreateBoardOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-pin-gray-900 font-sans selection:bg-pin-red selection:text-white flex flex-col">
      {/* Global Navigation Bar */}
      <Navbar onOpenCreateBoard={() => setIsGlobalCreateBoardOpen(true)} />

      {/* Main Page Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/pin/:id" element={<PinDetailPage />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePinPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/board/:id" element={<BoardDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Toast Notifications */}
      <Toast />

      {/* Global Quick Create Board Modal */}
      <CreateBoardModal
        isOpen={isGlobalCreateBoardOpen}
        onClose={() => setIsGlobalCreateBoardOpen(false)}
      />
    </div>
  )
}
