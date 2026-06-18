import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaHome, FaWallet, FaPaperPlane, FaIdCard, FaHistory, FaArrowLeft, FaCheckCircle, FaUser, FaExchangeAlt, FaQrcode } from 'react-icons/fa'

export default function KYC() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', address: '', pan: '', aadhaar: ''
  })
  const [status, setStatus] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [kycCompleted, setKycCompleted] = useState(false)

  // Check if KYC already completed
  useEffect(() => {
    const kycStatus = localStorage.getItem('neobank_kyc_status')
    if (kycStatus === 'completed') {
      setKycCompleted(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save KYC data to localStorage
    localStorage.setItem('neobank_kyc', JSON.stringify(formData))
    localStorage.setItem('neobank_kyc_status', 'completed')
    setStatus('KYC submitted successfully!')
    setIsSubmitted(true)
    
    // Redirect to profile after 2 seconds
    setTimeout(() => {
      navigate('/profile')
    }, 2000)
  }

  // If KYC already completed, show profile view instead of form
  if (kycCompleted) {
    const kycData = JSON.parse(localStorage.getItem('neobank_kyc') || '{}')
    const walletAddress = '0x519f8179A81C42468bBeAf559e70dd3eF94D1644'
    
    // Get transaction stats
    const transactions = JSON.parse(localStorage.getItem('neobank_transactions') || '[]')
    const totalTransactions = transactions.length
    const totalSent = transactions.filter((t: any) => t.type === 'sent').reduce((sum: number, t: any) => sum + t.amount, 0)
    const totalReceived = transactions.filter((t: any) => t.type === 'received').reduce((sum: number, t: any) => sum + t.amount, 0)
    const balance = parseFloat(localStorage.getItem('neobank_balance') || '0.80')
    
    return (
      <PhoneFrame>
        <div className="h-full flex flex-col">
          <div className="px-6 pt-6 pb-4 flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-500">
              <FaArrowLeft />
            </Link>
            <h1 className="font-semibold text-lg">My Profile</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-20">
            {/* Profile Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaUser className="text-3xl text-blue-600" />
              </div>
              <h2 className="text-xl font-bold">
                {kycData.firstName || 'User'} {kycData.lastName || ''}
              </h2>
              <p className="text-blue-100 text-sm mt-1">Verified Member</p>
              <div className="mt-4 inline-block bg-white/20 px-4 py-1 rounded-full">
                <p className="text-xs text-white">KYC Status: Completed</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <FaExchangeAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
                <p className="text-xs text-gray-500">Total Transactions</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <FaQrcode className="text-2xl text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">${totalReceived.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Received</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <FaPaperPlane className="text-2xl text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">${totalSent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Sent</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <FaWallet className="text-2xl text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">${balance.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Net Balance</p>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Wallet Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Wallet Address</span>
                  <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg">0x519f...D1644</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Network</span>
                  <span className="text-sm text-green-600 font-medium">Sepolia Testnet</span>
                </div>
              </div>
            </div>

            {/* KYC Details */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">KYC Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <span className="text-sm font-medium">{kycData.firstName} {kycData.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Date of Birth</span>
                  <span className="text-sm font-medium">{kycData.dob}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Address</span>
                  <span className="text-sm font-medium text-right max-w-[200px]">{kycData.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">PAN</span>
                  <span className="text-sm font-medium">{kycData.pan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Aadhaar</span>
                  <span className="text-sm font-medium">{kycData.aadhaar}</span>
                </div>
              </div>
            </div>
          </div>

          <BottomNav current="/kyc" />
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-500">
            <FaArrowLeft />
          </Link>
          <h1 className="font-semibold text-lg">Complete KYC</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20">
          {isSubmitted ? (
            <div className="text-center py-12">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">KYC Completed!</h2>
              <p className="text-gray-500 mb-4">Redirecting to your profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">PAN Number</label>
                <input type="text" name="pan" value={formData.pan} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Aadhaar Number</label>
                <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>

              {status && <p className="text-green-600 text-sm text-center font-medium">{status}</p>}

              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Submit KYC
              </button>
            </form>
          )}
        </div>

        <BottomNav current="/kyc" />
      </div>
    </PhoneFrame>
  )
}

function BottomNav({ current }: { current: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-10">
      <NavItem icon={<FaHome />} label="Home" link="/dashboard" active={current === '/dashboard'} />
      <NavItem icon={<FaWallet />} label="Wallet" link="/wallet" active={current === '/wallet'} />
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-6 shadow-lg">
        <Link to="/send" className="text-white">
          <FaPaperPlane />
        </Link>
      </div>
      <NavItem icon={<FaHistory />} label="History" link="/transactions" active={current === '/transactions'} />
      <NavItem icon={<FaIdCard />} label="Profile" link="/kyc" active={current === '/kyc'} />
    </div>
  )
}

function NavItem({ icon, label, link, active }: { icon: React.ReactNode, label: string, link: string, active?: boolean }) {
  return (
    <Link to={link} className={`flex flex-col items-center gap-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      <span className="text-lg">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </Link>
  )
}
