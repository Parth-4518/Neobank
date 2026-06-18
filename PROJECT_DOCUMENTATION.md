# NeoBank - Full Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Why NeoBank Was Created](#why-neobank-was-created)
3. [What is NeoBank](#what-is-neobank)
4. [Features](#features)
5. [Architecture](#architecture)
6. [Frontend Process & Architecture](#frontend-process--architecture)
7. [Backend Process & Architecture](#backend-process--architecture)
8. [Full Workflow Architecture](#full-workflow-architecture)
9. [File Structure](#file-structure)
10. [Blockages Faced & Solutions](#blockages-faced--solutions)
11. [Technology Stack](#technology-stack)
12. [Setup & Installation](#setup--installation)
13. [Future Enhancements](#future-enhancements)

---

## Overview

NeoBank is a modern, mobile-first digital banking application built with React and TypeScript. It simulates a real neobank experience with features like wallet management, money transfers, transaction history, and MetaMask integration for blockchain transactions on the Sepolia testnet.

**Project Location:** `/home/parth/Neobank/neobank-ui`
**Server Port:** 3000 (Vite dev server)
**Backend API:** `/home/parth/neobank` (Express.js, port 4000)

---

## Why NeoBank Was Created

1. **Learning Purpose**: To understand modern fintech application architecture
2. **Mobile-First Design**: Practice building phone-optimized UI components
3. **Blockchain Integration**: Learn how to connect web apps with MetaMask and Ethereum testnets
4. **Full-Stack Experience**: Combine frontend React with backend Express API
5. **Real-World Simulation**: Mimic actual neobank apps like Revolut, Chime, or N26

---

## What is NeoBank

NeoBank is a **digital-only bank simulation** that includes:

- **User Dashboard**: View balance, quick actions, recent transactions
- **Wallet Management**: Add money, view QR code, check wallet address
- **Send Money**: Transfer funds to other MetaMask addresses
- **Transaction History**: View all past transactions with status
- **MetaMask Integration**: Connect crypto wallet for real blockchain transactions
- **KYC Page**: Know Your Customer verification placeholder

**Key Characteristics:**
- Mobile-first responsive design (phone frame UI)
- Uses localStorage for client-side data persistence
- Sepolia testnet for blockchain transactions (free test ETH)
- In-memory backend (resets on server restart)

---

## Features

### 1. User Dashboard
- Total balance display with gradient card
- Quick action buttons: Send, Wallet, History, KYC
- Recent transaction preview (last 2 transactions)
- Wallet address display

### 2. Wallet Page
- Balance display
- **Add Money** feature (instant balance top-up)
- Wallet QR code placeholder
- Wallet address display (0x519f...D1644)
- Send Money button

### 3. Send Money
- **MetaMask Connect/Disconnect** button
- Real-time Sepolia ETH balance display
- Receiver address input (Ethereum address validation)
- Amount input in USD/ETH
- Real blockchain transaction via MetaMask
- Transaction hash display on success
- Local balance deduction after send

### 4. Transaction History
- List of all sent/received transactions
- Amount with +/- indicators
- Date and status display
- Transaction hash link (for blockchain verification)

### 5. KYC Page
- Placeholder for identity verification
- Form fields for personal information
- Document upload simulation

### 6. MetaMask Integration
- Auto-detect MetaMask installation
- Connect wallet button
- Disconnect wallet button
- Network switching (Sepolia testnet)
- Real ETH balance fetch
- Transaction signing via MetaMask popup

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│  ┌─────────────────┐      ┌─────────────────────────────┐  │
│  │   NeoBank UI    │      │        MetaMask             │  │
│  │  (React + Vite) │◄────►│    (Browser Extension)      │  │
│  │                 │      │                             │  │
│  │  localhost:3000 │      │  - Wallet Management        │  │
│  │                 │      │  - Transaction Signing      │  │
│  └─────────────────┘      │  - Sepolia Testnet          │  │
│           │               └─────────────────────────────┘  │
│           │                                                 │
│           │ localStorage                                    │
│           │ (balance, transactions, user)                   │
│           │                                                 │
│  ┌─────────────────┐                                       │
│  │  Backend API      │                                      │
│  │  (Express.js)     │◄───── Optional API calls              │
│  │  localhost:4000  │                                      │
│  │                  │                                      │
│  │  - Auth Routes    │                                      │
│  │  - Account Routes │                                      │
│  │  - Transaction    │                                      │
│  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
           │
           │ Blockchain (Sepolia Testnet)
           │
    ┌─────────────────────────┐
    │   Sepolia Network       │
    │   - Free Test ETH       │
    │   - Transaction Mining  │
    │   - Block Explorer      │
    └─────────────────────────┘
```

---

## Frontend Process & Architecture

### Technology Stack
- **React 19.2.6** - UI framework
- **TypeScript** - Type safety
- **Vite 8.0.12** - Build tool and dev server
- **Tailwind CSS 4.3.1** - Utility-first styling
- **React Router DOM 7.17.0** - Client-side routing
- **React Icons 5.6.0** - Icon library

### Component Architecture

```
src/
├── components/
│   └── PhoneFrame.tsx          # Mobile phone frame wrapper
├── pages/
│   ├── Dashboard.tsx           # Main dashboard with balance, actions
│   ├── Wallet.tsx              # Wallet with add money, QR code
│   ├── SendMoney.tsx           # MetaMask connect + send ETH
│   ├── Transactions.tsx        # Transaction history list
│   └── KYC.tsx                 # KYC verification form
├── App.tsx                     # Main app with routes
├── main.tsx                    # Entry point
├── index.css                   # Global styles + Tailwind
└── global.d.ts                 # TypeScript types for window.ethereum
```

### Component Details

#### PhoneFrame.tsx
- Wraps all pages in a mobile phone frame
- Simulates real phone dimensions
- Adds status bar and home button

#### Dashboard.tsx
- Reads balance from localStorage (default: 0.80)
- Displays gradient balance card
- Quick action grid with icons
- Recent transactions preview
- Wallet address display

#### Wallet.tsx
- State: balance, addAmount, showAddMoney, status
- useEffect: load balance from localStorage
- handleAddMoney: adds amount to balance, saves to localStorage
- Conditional UI: Add Money button vs input form
- QR code placeholder

#### SendMoney.tsx (Most Complex)
- State: receiverAddress, amount, balance, status, error, walletAddress, ethBalance, isConnected, loading
- MetaMask integration:
  - checkConnection(): checks if already connected
  - connectWallet(): requests account access with timeout
  - disconnectWallet(): clears connection state
  - getEthBalance(): fetches real ETH balance from blockchain
  - switchToSepolia(): changes network to Sepolia testnet
- handleSubmit():
  1. Validates connection
  2. Validates inputs
  3. Validates Ethereum address format (regex: ^0x[a-fA-F0-9]{40}$)
  4. Switches to Sepolia network
  5. Converts amount to Wei (BigInt)
  6. Sends transaction via MetaMask (eth_sendTransaction)
  7. Updates local balance
  8. Saves transaction to localStorage
  9. Refreshes ETH balance

#### Transactions.tsx
- Reads transactions from localStorage
- Maps through array to display list
- Shows sent/received indicators with colors
- Formats dates and amounts

### Data Flow (Frontend)

```
User Action
    │
    ▼
React Component (State Update)
    │
    ▼
localStorage (Persistent Storage)
    │
    ▼
UI Re-render (Updated Display)
```

### State Management
- **No Redux/Context** - Uses React useState/useEffect only
- **localStorage** as persistent store:
  - `neobank_balance`: Current balance (default: 0.80)
  - `neobank_transactions`: Array of transaction objects
  - `user`: User profile object

### Routing
```
/           → Dashboard
/wallet     → Wallet Page
/send       → Send Money
/transactions → Transaction History
/kyc        → KYC Verification
```

---

## Backend Process & Architecture

### Technology Stack
- **Node.js** - Runtime
- **Express.js 4.19.2** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **UUID** - Unique ID generation
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Server Setup (index.ts)
```typescript
app.use(cors())                    // Allow cross-origin requests
app.use(express.json())            // Parse JSON body
app.use('/api/auth', authRoutes)   // Authentication routes
app.use('/api/accounts', accountRoutes)  // Account routes
app.use('/api/transactions', transactionRoutes)  // Transaction routes
app.use(express.static(...))       // Serve static files
```

### Database (db.ts)
**In-memory storage** - no real database:
```typescript
export const users: User[] = []        // User accounts
export const accounts: Account[] = []  // Bank accounts
export const transactions: Transaction[] = []  // Transaction records
```

Data resets on server restart. Each entity has TypeScript interface:
- User: id, name, email, passwordHash
- Account: id, userId, name, type, currency, balance, status, createdAt
- Transaction: id, fromAccountId, toAccountId, amount, currency, description, status, createdAt

### Authentication Middleware (auth.ts)
```
Request → Check Authorization Header
              │
              ▼
        Extract Bearer Token
              │
              ▼
        Verify JWT with SECRET
              │
              ▼
        Attach userId to request
              │
              ▼
        next() → Route Handler
```

### API Routes

#### Auth Routes (/api/auth)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /register | Create new user + accounts | No |
| POST | /login | Authenticate user | No |
| GET | /me | Get current user profile | Yes |

**Register Process:**
1. Validate name, email, password
2. Check email uniqueness
3. Hash password with bcrypt (10 rounds)
4. Create user with UUID
5. Create default accounts (Checking $5000, Savings $12000)
6. Generate JWT token (7-day expiry)
7. Return token + user + accounts

**Login Process:**
1. Find user by email
2. Compare password with bcrypt
3. Generate JWT token
4. Return token + user

#### Account Routes (/api/accounts)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | / | List user's accounts | Yes |
| POST | / | Create new account | Yes |

#### Transaction Routes (/api/transactions)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | / | List user's transactions | Yes |
| POST | /transfer | Transfer between accounts | Yes |

**Transfer Process:**
1. Verify JWT token
2. Find fromAccount (must belong to user)
3. Find toAccount (any account)
4. Validate amount > 0
5. Check sufficient balance
6. Deduct from fromAccount
7. Add to toAccount
8. Create transaction record
9. Return transaction

### Backend Data Flow
```
HTTP Request
    │
    ▼
CORS Middleware
    │
    ▼
JSON Parsing
    │
    ▼
Auth Middleware (JWT verification)
    │
    ▼
Route Handler
    │
    ▼
In-Memory Array (db.ts)
    │
    ▼
JSON Response
```

---

## Full Workflow Architecture

### User Registration Workflow
```
User
  │
  ▼
Opens NeoBank App
  │
  ▼
Clicks Register (if implemented)
  │
  ▼
Frontend → POST /api/auth/register
  │
  ▼
Backend:
  - Validate fields
  - Check email unique
  - Hash password
  - Create user
  - Create 2 accounts
  - Generate JWT
  │
  ▼
Frontend stores token in localStorage
  │
  ▼
Redirect to Dashboard
```

### Send Money Workflow (MetaMask)
```
User
  │
  ▼
Opens Send Money Page
  │
  ▼
Clicks "Connect MetaMask"
  │
  ▼
Frontend calls window.ethereum.request()
  │
  ▼
MetaMask Popup opens
  │
  ▼
User selects account → clicks Connect
  │
  ▼
Frontend receives wallet address
  │
  ▼
Frontend fetches ETH balance from Sepolia
  │
  ▼
User enters receiver address + amount
  │
  ▼
User clicks "Send Money"
  │
  ▼
Frontend validates:
  - Connected?
  - Fields filled?
  - Amount > 0?
  - Balance sufficient?
  - Valid ETH address?
  │
  ▼
Frontend switches to Sepolia network
  │
  ▼
Frontend converts amount to Wei
  │
  ▼
Frontend calls eth_sendTransaction
  │
  ▼
MetaMask Popup opens for confirmation
  │
  ▼
User clicks Confirm in MetaMask
  │
  ▼
Transaction sent to Sepolia blockchain
  │
  ▼
Frontend receives transaction hash
  │
  ▼
Frontend updates local balance
  │
  ▼
Frontend saves transaction to localStorage
  │
  ▼
Shows success message with tx hash
```

### Add Money Workflow
```
User
  │
  ▼
Opens Wallet Page
  │
  ▼
Clicks "Add Money"
  │
  ▼
Enters amount (e.g., 5000)
  │
  ▼
Clicks "Confirm"
  │
  ▼
Frontend adds amount to current balance
  │
  ▼
Saves new balance to localStorage
  │
  ▼
Shows success message
  │
  ▼
Balance updates across all pages
```

---

## File Structure

### Frontend (`/home/parth/Neobank/neobank-ui/`)
```
neobank-ui/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   └── PhoneFrame.tsx          # Phone frame wrapper component
│   ├── pages/
│   │   ├── Dashboard.tsx           # Dashboard page
│   │   ├── Wallet.tsx              # Wallet page with add money
│   │   ├── SendMoney.tsx           # Send money with MetaMask
│   │   ├── Transactions.tsx        # Transaction history
│   │   └── KYC.tsx                 # KYC verification page
│   ├── App.tsx                     # Main app component with routes
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles + Tailwind
│   ├── global.d.ts                 # TypeScript declarations for window.ethereum
│   └── vite-env.d.ts             # Vite environment types
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration (port 3000)
├── tsconfig.json                   # TypeScript config
├── tsconfig.app.json               # App-specific TS config
├── package.json                    # Dependencies
└── package-lock.json               # Locked versions
```

### Backend (`/home/parth/neobank/`)
```
neobank/
├── src/
│   ├── index.ts                    # Server setup and route registration
│   ├── db.ts                       # In-memory database + interfaces
│   ├── middleware/
│   │   └── auth.ts                 # JWT authentication middleware
│   └── routes/
│       ├── auth.ts                 # Auth routes (register, login, me)
│       ├── accounts.ts             # Account routes (list, create)
│       └── transactions.ts         # Transaction routes (list, transfer)
├── public/
│   └── index.html                  # Static HTML (if serving built UI)
├── dist/                           # Compiled JavaScript output
├── .env                            # Environment variables (PORT, JWT_SECRET)
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
└── package-lock.json               # Locked versions
```

---

## Blockages Faced & Solutions

### 1. MetaMask Connection Stuck
**Problem:** "Request of type 'wallet_requestPermissions' already pending for origin http://localhost:3000"

**Cause:** Multiple rapid clicks on "Connect MetaMask" created overlapping permission requests

**Solution:**
- Added timeout handling with Promise.race()
- Added loading state to prevent double-clicks
- Added clear error messages instructing user to cancel pending requests
- Added delay in useEffect to let MetaMask fully inject

### 2. Currency Symbol Change
**Problem:** App used ₹ (Indian Rupee) but user wanted $ (Dollar)

**Solution:**
- Replaced all ₹ symbols with $ across 4 files
- Updated labels from "Amount (₹)" to "Amount ($)"
- Updated success messages to show $

### 3. Default Balance Too High
**Problem:** Default balance was 12500, user wanted 0.80

**Solution:**
- Changed default value in localStorage fallback from '12500' to '0.80'
- Updated in Dashboard.tsx, Wallet.tsx, SendMoney.tsx

### 4. Port Conflicts
**Problem:** Two NeoBank servers trying to use port 3000

**Solution:**
- Identified correct project (Neobank/neobank-ui vs neobank)
- Killed conflicting processes
- Started correct server on port 3000

### 5. TypeScript Errors with window.ethereum
**Problem:** TypeScript didn't recognize window.ethereum (MetaMask injection)

**Solution:**
- Created global.d.ts with Window interface extension
- Declared ethereum object with request, on, removeListener methods

### 6. Vite Build Hanging on NTFS (WSL)
**Problem:** `npx vite build` hangs on Windows NTFS filesystem

**Solution:**
- Use `node node_modules/vite/bin/vite.js build` instead
- Or run builds from native Linux filesystem

### 7. MetaMask Popup Not Appearing
**Problem:** Clicking "Connect MetaMask" didn't trigger popup

**Solution:**
- Added timeout to detect stuck requests
- Added error message with clear instructions
- Added status message "Opening MetaMask..." for feedback

### 8. Disconnect Not Fully Clearing
**Problem:** Disconnect button cleared UI but MetaMask still remembered site

**Solution:**
- Added disconnectWallet() function to clear all state
- Added visual feedback "Wallet disconnected"
- Noted that full permission removal requires MetaMask's Dapp connections menu

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.6 | UI framework |
| TypeScript | 6.0.2 | Type safety |
| Vite | 8.0.12 | Build tool & dev server |
| Tailwind CSS | 4.3.1 | Utility-first CSS |
| React Router DOM | 7.17.0 | Client-side routing |
| React Icons | 5.6.0 | Icon components |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 4.19.2 | Web framework |
| TypeScript | 6.0.2 | Type safety |
| JWT | 9.0.2 | Authentication tokens |
| bcryptjs | 2.4.3 | Password hashing |
| UUID | 10.0.0 | Unique identifiers |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.4.5 | Environment variables |

### Blockchain
| Technology | Purpose |
|------------|---------|
| MetaMask | Browser wallet extension |
| Sepolia Testnet | Ethereum test network |
| Ethers.js (via MetaMask) | Blockchain interaction |

---

## Setup & Installation

### Frontend Setup
```bash
cd /home/parth/Neobank/neobank-ui
npm install
npm run dev          # Starts on http://localhost:3000
```

### Backend Setup
```bash
cd /home/parth/neobank
npm install
npm run build        # Compiles TypeScript
npm start            # Starts on http://localhost:4000
```

### Environment Variables (Backend)
Create `.env` file:
```
PORT=4000
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
```

### MetaMask Setup
1. Install MetaMask extension
2. Create/import wallet
3. Switch to Sepolia testnet
4. Get free ETH from https://sepoliafaucet.com

---

## Future Enhancements

1. **Database Integration**: Replace in-memory arrays with PostgreSQL/MongoDB
2. **Real Backend Connection**: Connect frontend to backend API instead of localStorage
3. **User Authentication**: Implement login/register with JWT
4. **Multiple Accounts**: Support checking, savings, credit accounts
5. **Transaction Categories**: Add tags for transactions
6. **Charts/Analytics**: Spending insights with charts
7. **Notifications**: Push notifications for transactions
8. **Contact List**: Save frequent recipients
9. **Multi-Currency**: Support EUR, GBP, etc.
10. **Real Mainnet**: Option to switch to Ethereum mainnet for real transactions
11. **Mobile App**: Build native iOS/Android app with React Native
12. **Biometric Auth**: Fingerprint/Face ID login
13. **Dark Mode**: Theme switching

---

## Conclusion

NeoBank is a fully functional digital banking prototype that demonstrates:
- Modern React development with TypeScript
- Mobile-first responsive design
- Blockchain integration with MetaMask
- Full-stack architecture (frontend + backend)
- Real-world fintech workflows

The project serves as an excellent learning resource and foundation for building production-grade neobank applications.

**Project Status:** Functional prototype with core features implemented
**Last Updated:** June 2026
**Maintained by:** Parth Brid
