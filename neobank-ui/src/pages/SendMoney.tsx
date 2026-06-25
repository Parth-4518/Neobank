import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { FaHome, FaWallet, FaPaperPlane, FaIdCard, FaHistory, FaArrowLeft } from 'react-icons/fa'

// Sepolia testnet config
const SEPOLIA_CHAIN_ID = '0xaa36a7' // 11155111 in hex
const SEPOLIA_RPC = 'https://rpc.sepolia.org'

interface Transaction {
  id: number
  type: 'sent' | 'received'
  amount: number
  address: string
  date: string
  status: string
  txHash?: string
}

export default function SendMoney() {
  const [receiverAddress, setReceiverAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('neobank_balance')
    return saved ? parseFloat(saved) : 0
  })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [ethBalance, setEthBalance] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if MetaMask is installed and connected
  useEffect(() => {
    // Delay check to let MetaMask fully inject
    const timer = setTimeout(() => {
      checkConnection()
    }, 500)
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkConnection)
      window.ethereum.on('chainChanged', () => window.location.reload())
    }
    
    return () => clearTimeout(timer)
  }, [])

  async function checkConnection() {
    if (!window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask extension.')
      return
    }
    try {
      // Use a timeout to prevent stuck requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 3000)
      )
      const accountsPromise = window.ethereum.request({ method: 'eth_accounts' })
      const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[]
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        setIsConnected(true)
        await getEthBalance(accounts[0])
      }
    } catch (err) {
      console.error('Error checking connection:', err)
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask extension.')
      return
    }
    try {
      // Force clear any pending permissions by requesting fresh
      setError('')
      setStatus('Opening MetaMask...')
      
      // Use a timeout to prevent stuck requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout. Please unlock MetaMask and try again.')), 10000)
      )
      
      const accountsPromise = window.ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[]
      
      setWalletAddress(accounts[0])
      setIsConnected(true)
      await getEthBalance(accounts[0])
      setStatus('')
      setError('')
    } catch (err: any) {
      setStatus('')
      if (err.message?.includes('already pending')) {
        setError('MetaMask is busy. Please: 1) Open MetaMask extension 2) Check for pending requests 3) Click Cancel on any pending popups 4) Try again')
      } else {
        setError(err.message || 'Failed to connect wallet')
      }
    }
  }

  function disconnectWallet() {
    setWalletAddress('')
    setEthBalance('')
    setIsConnected(false)
    setStatus('Wallet disconnected')
    setTimeout(() => setStatus(''), 3000)
  }

  async function getEthBalance(address: string) {
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      const balanceWei = parseInt(balanceHex, 16)
      const balanceEth = (balanceWei / 1e18).toFixed(4)
      setEthBalance(balanceEth)
    } catch (err) {
      console.error('Error getting balance:', err)
    }
  }

  async function switchToSepolia() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }]
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Chain not added, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Testnet',
              rpcUrls: [SEPOLIA_RPC],
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          })
        } catch (addError) {
          throw new Error('Failed to add Sepolia network')
        }
      } else {
        throw switchError
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('')

    if (!isConnected) {
      setError('Please connect your MetaMask wallet first')
      return
    }

    const amt = parseFloat(amount)
    if (!receiverAddress || !amount) {
      setError('Please fill all fields')
      return
    }
    if (amt <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (amt > balance) {
      setError('Insufficient balance')
      return
    }

    // Validate Ethereum address
    if (!receiverAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Invalid Ethereum address format')
      return
    }

    setLoading(true)

    try {
      // Switch to Sepolia
      await switchToSepolia()

      // Convert amount to Wei (1 ETH = 10^18 Wei)
      const amountWei = BigInt(Math.floor(amt * 1e18))

      // Send transaction via MetaMask
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: receiverAddress,
          value: '0x' + amountWei.toString(16)
        }]
      })

      // Update local balance
      const newBalance = balance - amt
      setBalance(newBalance)
      localStorage.setItem('neobank_balance', newBalance.toString())

      // Save transaction
      const transaction: Transaction = {
        id: Date.now(),
        type: 'sent',
        amount: amt,
        address: receiverAddress,
        date: new Date().toISOString(),
        status: 'completed',
        txHash
      }
      const existing = JSON.parse(localStorage.getItem('neobank_transactions') || '[]')
      existing.unshift(transaction)
      localStorage.setItem('neobank_transactions', JSON.stringify(existing))
      
      // Dispatch storage event to update other tabs/pages
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'neobank_transactions',
        newValue: JSON.stringify(existing)
      }))

      setStatus(`Sent $${amt} to ${receiverAddress.slice(0, 10)}...${receiverAddress.slice(-8)} | Tx: ${txHash.slice(0, 10)}...`)
      setReceiverAddress('')
      setAmount('')

      // Refresh ETH balance
      await getEthBalance(walletAddress)
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col">
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-500">
            <FaArrowLeft />
          </Link>
          <h1 className="font-semibold text-lg">Send Money</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20">
          {/* Wallet Connection */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white mb-4">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold text-sm"
              >
                Connect MetaMask
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-xs">Connected Wallet</p>
                  <button
                    onClick={disconnectWallet}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition"
                  >
                    Disconnect
                  </button>
                </div>
                <p className="font-mono text-sm">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                <p className="text-blue-100 text-xs mt-1">Sepolia ETH: {ethBalance} ETH</p>
              </div>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-6">Available Balance: <span className="font-bold text-green-600">${balance.toLocaleString()}</span></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Receiver MetaMask Address</label>
              <input
                type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount ($ / ETH)</label>
              <input
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Enter amount" required min="0.0001" step="0.0001"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {status && <p className="text-green-600 text-sm text-center font-medium">{status}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Money'}
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    </PhoneFrame>
  )
}

function BottomNav() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-10">
      <NavItem icon={<FaHome />} label="Home" link="/dashboard" />
      <NavItem icon={<FaWallet />} label="Wallet" link="/wallet" />
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -mt-6 shadow-lg">
        <Link to="/send" className="text-white">
          <FaPaperPlane />
        </Link>
      </div>
      <NavItem icon={<FaHistory />} label="History" link="/transactions" />
      <NavItem icon={<FaIdCard />} label="KYC" link="/kyc" />
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
