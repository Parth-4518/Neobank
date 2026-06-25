import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaHome, FaWallet, FaPaperPlane, FaIdCard, FaHistory, FaArrowLeft, FaUser, FaQrcode, FaExchangeAlt } from 'react-icons/fa'

interface KYCData {
  firstName: string
  lastName: string
  dob: string
  address: string
  pan: string
  aadhaar: string
}

interface Transaction {
  id: number
  type: 'sent' | 'received'
  amount: number
  address: string
  date: string
  status: string
}

export default function Profile() {
  const [kycData, setKycData] = useState<KYCData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)

  const walletAddress = '0x519f8179A81C42468bBeAf559e70dd3eF94D1644'

  useEffect(() => {
    const savedKyc = localStorage.getItem('neobank_kyc')
    if (savedKyc) setKycData(JSON.parse(savedKyc))

    const savedTransactions = localStorage.getItem('neobank_transactions')
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))

    const savedBalance = localStorage.getItem('neobank_balance')
    if (savedBalance) setBalance(parseFloat(savedBalance))
  }, [])

  const totalTransactions = transactions.length
  const totalSent = transactions.filter(t => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0)
  const totalReceived = transactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0)

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
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
              {kycData ? `${kycData.firstName} ${kycData.lastName}` : 'User'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">Verified Member</p>
            <div className="mt-4 inline-block bg-white/20 px-4 py-1 rounded-full">
              <p className="text-xs text-white">KYC Status: Completed</p>
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
                <span className="text-sm text-gray-500">Current Balance</span>
                <span className="text-sm font-bold text-blue-600">${balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Network</span>
                <span className="text-sm text-green-600 font-medium">Sepolia Testnet</span>
              </div>
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

          {/* KYC Details */}
          {kycData && (
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
          )}

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
              <Link to="/transactions" className="text-xs text-blue-600">View All</Link>
            </div>
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <span className={`text-xs font-bold ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'received' ? '+' : '-'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-gray-500">{tx.address.slice(0, 8)}...{tx.address.slice(-6)}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'received' ? '+' : '-'} ${tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNav current="/profile" />
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
      <NavItem icon={<FaIdCard />} label="Profile" link="/profile" active={current === '/profile'} />
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