import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaHome, FaWallet, FaPaperPlane, FaIdCard, FaHistory, FaArrowLeft, FaQrcode, FaPlus } from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'

export default function Wallet() {
  const [balance, setBalance] = useState(0)
  const [addAmount, setAddAmount] = useState('')
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [status, setStatus] = useState('')
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)

  const walletAddress = '0x519f8179A81C42468bBeAf559e70dd3eF94D1644'

  useEffect(() => {
    const saved = localStorage.getItem('neobank_balance')
    if (saved) setBalance(parseFloat(saved))
  }, [])

  async function handleAddMoney() {
    const amt = parseFloat(addAmount)
    if (!amt || amt <= 0) {
      setStatus('Enter a valid amount')
      return
    }
    if (!email || !email.includes('@')) {
      setStatus('Enter a valid email')
      return
    }
    
    const newBalance = balance + amt
    setBalance(newBalance)
    localStorage.setItem('neobank_balance', newBalance.toString())
    
    // Save transaction
    const transaction = {
      id: Date.now(),
      type: 'received' as const,
      amount: amt,
      address: walletAddress,
      date: new Date().toISOString(),
      status: 'completed'
    }
    const existing = JSON.parse(localStorage.getItem('neobank_transactions') || '[]')
    existing.unshift(transaction)
    localStorage.setItem('neobank_transactions', JSON.stringify(existing))
    
    // Send email confirmation
    try {
      const response = await fetch('http://localhost:3001/api/send-add-money-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: amt,
          balance: newBalance
        })
      })
      const result = await response.json()
      if (result.success) {
        setStatus(`Added $${amt.toLocaleString()} - Email sent!`)
      } else {
        setStatus(`Added $${amt.toLocaleString()} - Email failed`)
      }
    } catch (err) {
      console.error('Email error:', err)
      setStatus(`Added $${amt.toLocaleString()} - Email failed`)
    }
    
    setAddAmount('')
    setEmail('')
    setShowAddMoney(false)
    setShowEmailInput(false)
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col">
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-500">
            <FaArrowLeft />
          </Link>
          <h1 className="font-semibold text-lg">My Wallet</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
            <p className="text-blue-100 text-xs mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold">${balance.toLocaleString()}</h2>
          </div>

          {/* Add Money Section */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            {!showAddMoney ? (
              <button
                onClick={() => setShowAddMoney(true)}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <FaPlus /> Add Money
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Add Money to Wallet</h3>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  min="1"
                  step="1"
                />
                {!showEmailInput ? (
                  <button
                    onClick={() => {
                      if (!addAmount || parseFloat(addAmount) <= 0) {
                        setStatus('Enter a valid amount first')
                        return
                      }
                      setShowEmailInput(true)
                      setStatus('')
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm"
                  >
                    Next: Enter Email
                  </button>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for confirmation"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddMoney}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm"
                      >
                        Confirm & Send Email
                      </button>
                      <button
                        onClick={() => { setShowAddMoney(false); setAddAmount(''); setEmail(''); setShowEmailInput(false); setStatus('') }}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {status && <p className="text-green-600 text-sm text-center mt-2">{status}</p>}
          </div>

          <div className="bg-white rounded-2xl p-6 text-center mb-6 shadow-sm">
            <p className="text-xs text-gray-500 mb-4">Wallet Address</p>
            <p className="font-mono text-xs bg-gray-100 p-3 rounded-xl mb-4">0x519f...D1644</p>
            <div className="w-40 h-40 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 p-2">
              <QRCodeSVG value={walletAddress} size={144} level="M" />
            </div>
            <p className="text-xs text-gray-500">Scan to receive payments</p>
          </div>

          <Link to="/send" className="block w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-center">
            Send Money
          </Link>
        </div>

        <BottomNav current="/wallet" />
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
