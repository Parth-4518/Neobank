import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaHome, FaWallet, FaPaperPlane, FaIdCard, FaHistory, FaArrowLeft } from 'react-icons/fa'

interface Transaction {
  id: number
  type: 'sent' | 'received'
  amount: number
  address: string
  date: string
  status: string
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const loadTransactions = () => {
      const saved = localStorage.getItem('neobank_transactions')
      if (saved) setTransactions(JSON.parse(saved))
    }
    
    // Load on mount
    loadTransactions()
    
    // Listen for storage changes from other pages
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'neobank_transactions') {
        loadTransactions()
      }
    }
    
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col">
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-500">
            <FaArrowLeft />
          </Link>
          <h1 className="font-semibold text-lg">Transactions</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaHistory className="text-4xl mx-auto mb-4" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: Transaction) => (
                <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <span className={`font-bold text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'received' ? '+' : '-'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize text-gray-800">{tx.type}</p>
                      <p className="text-xs text-gray-500">{tx.address.slice(0, 8)}...{tx.address.slice(-6)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'received' ? '+' : '-'} ${tx.amount}
                    </p>
                    <p className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                    <p className="text-[10px] text-green-500">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav current="/transactions" />
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
      <NavItem icon={<FaIdCard />} label="KYC" link="/kyc" active={current === '/kyc'} />
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
