import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaEnvelope, FaLock, FaUser, FaArrowLeft, FaPhone } from 'react-icons/fa'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password) {
      localStorage.setItem('token', 'demo-token')
      localStorage.setItem('user', JSON.stringify({ email, name }))
      // New users must complete KYC first
      localStorage.removeItem('neobank_kyc')
      localStorage.removeItem('neobank_kyc_status')
      window.location.href = '/kyc'
    } else {
      setError('Please fill all fields')
    }
  }

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col px-6 pt-4 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 mb-4 text-sm">
          <FaArrowLeft /> Back
        </Link>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Get started with NeoBank</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="Full Name"
            />
          </div>

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
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="Phone number"
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
            Sign Up
          </button>
        </form>

        <p className="text-center py-4 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </PhoneFrame>
  )
}
