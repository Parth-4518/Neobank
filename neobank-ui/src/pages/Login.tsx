import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaEnvelope, FaLock } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      localStorage.setItem('token', 'demo-token')
      localStorage.setItem('user', JSON.stringify({ email, name: 'User' }))
      // Check if KYC is already completed
      const kycStatus = localStorage.getItem('neobank_kyc_status')
      if (kycStatus === 'completed') {
        window.location.href = '/dashboard'
      } else {
        // Redirect to KYC for new users
        window.location.href = '/kyc'
      }
    } else {
      setError('Please fill all fields')
    }
  }

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col px-6 pt-8 pb-4">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white text-3xl font-bold">N</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center py-4 text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </PhoneFrame>
  )
}
