import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaHome, FaWallet, FaPaperPlane, FaIdCard, FaHistory, FaSignOutAlt, FaUser } from 'react-icons/fa'

interface Transaction {
  id: number
  type: 'sent' | 'received'
  amount: number
  address: string
  date: string
  status: string
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const balance = parseFloat(localStorage.getItem('neobank_balance') || '0.80')
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('neobank_transactions')
    if (saved) {
      const all = JSON.parse(saved)
      setRecentTransactions(all.slice(0, 2)) // Show only last 2
    }
  }, [])

  const quickActions = [
    { icon: <FaPaperPlane />, label: 'Send', color: 'bg-blue-100 text-blue-600', link: '/send' },
    { icon: <FaWallet />, label: 'Receive', color: 'bg-green-100 text-green-600', link: '/wallet' },
    { icon: <FaIdCard />, label: 'KYC', color: 'bg-purple-100 text-purple-600', link: '/kyc' },
  ]

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Good Morning</p>
              <p className="font-semibold text-sm">{user.name || 'User'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              // Clear all auth data to fully logout
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/'
            }}
            className="text-red-500 text-sm"
          >
            <FaSignOutAlt />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-20">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
            <p className="text-blue-100 text-xs mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold mb-4">${balance.toLocaleString()}</h2>
            <div className="flex gap-4 text-xs text-blue-100">
              <span>Wallet: 0x519f...D1644</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
              <Link to="/transactions" className="text-xs text-blue-600">View All</Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-sm">No transactions yet</p>
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <span className={`font-bold text-xs ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'received' ? '+' : '-'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800 capitalize">{tx.type}</p>
                        <p className="text-xs text-gray-500">{tx.address.slice(0, 8)}...{tx.address.slice(-6)}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'received' ? '+' : '-'} ${tx.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-10">
          <NavItem icon={<FaHome />} label="Home" link="/dashboard" active />
          <NavItem icon={<FaWallet />} label="Wallet" link="/wallet" />
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-6 shadow-lg">
            <Link to="/send" className="text-white">
              <FaPaperPlane />
            </Link>
          </div>
          <NavItem icon={<FaHistory />} label="History" link="/transactions" />
          <NavItem icon={<FaIdCard />} label="KYC" link="/kyc" />
        </div>
      </div>
    </PhoneFrame>
  )
}

function NavItem({ icon, label, link, active }: { icon: React.ReactNode, label: string, link: string, active?: boolean }) {
  const location = useLocation()
  const isActive = active || location.pathname === link
  return (
    <Link to={link} className={`flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
      <span className="text-lg">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </Link>
  )
}
