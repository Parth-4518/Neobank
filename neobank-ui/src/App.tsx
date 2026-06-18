import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import KYC from './pages/KYC'
import Wallet from './pages/Wallet'
import SendMoney from './pages/SendMoney'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'

function App() {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/kyc" element={isLoggedIn ? <KYC /> : <Navigate to="/" />} />
        <Route path="/wallet" element={isLoggedIn ? <Wallet /> : <Navigate to="/" />} />
        <Route path="/send" element={isLoggedIn ? <SendMoney /> : <Navigate to="/" />} />
        <Route path="/transactions" element={isLoggedIn ? <Transactions /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
