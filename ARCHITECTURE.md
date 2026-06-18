# NeoBank System Architecture

## Complete System Design

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   iOS App   │  │ Android App │  │   Web App   │     │
│  │  (Swift)    │  │  (Kotlin)   │  │   (React)   │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │              │
│         └────────────────┴────────────────┘              │
│                          │                               │
│                   ┌──────┴──────┐                        │
│                   │  CDN (AWS)  │                        │
│                   │ CloudFront  │                        │
│                   └──────┬──────┘                        │
└──────────────────────────┼───────────────────────────────┘
                           │
                           │ HTTPS/SSL
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              AWS API Gateway / Kong                  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │  Rate    │  │   Auth   │  │ Request  │          │ │
│  │  │ Limiting │  │  JWT     │  │ Routing  │          │ │
│  │  │ (1000/s) │  │ Validate │  │          │          │ │
│  │  └──────────┘  └──────────┘  └──────────┘          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │   SSL    │  │  CORS    │  │  DDoS    │          │ │
│  │  │ Terminate│  │ Headers  │  │ Protection│         │ │
│  │  └──────────┘  └──────────┘  └──────────┘          │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                          │
│              (Kubernetes Cluster)                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Load Balancer (Nginx)                   │ │
│  └─────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌──────────────┬────────┼────────┬──────────────┐      │
│  │              │        │        │              │      │
│  ▼              ▼        ▼        ▼              ▼      │
│ ┌─────────┐  ┌─────────┐ ┌─────────┐  ┌─────────┐     │
│ │  User   │  │ Payment │ │  KYC    │  │ Notification │  │
│ │ Service │  │ Service │ │ Service │  │   Service    │  │
│ │ (Node)  │  │ (Node)  │ │ (Node)  │  │   (Node)     │  │
│ └────┬────┘  └────┬────┘ └────┬────┘  └─────┬─────┘  │
│      │            │           │               │        │
│ ┌─────────┐  ┌─────────┐ ┌─────────┐  ┌─────────┐     │
│ │  Card   │  │ Wallet  │ │  Loan   │  │  Analytics   │  │
│ │ Service │  │ Service │ │ Service │  │   Service    │  │
│ │ (Node)  │  │ (Node)  │ │ (Node)  │  │   (Python)   │  │
│ └────┬────┘  └────┬────┘ └────┬────┘  └─────┬─────┘  │
│      │            │           │               │        │
│ ┌─────────┐  ┌─────────┐ ┌─────────┐  ┌─────────┐     │
│ │  Auth   │  │ Transaction│  Risk   │  │  Support     │  │
│ │ Service │  │ Service │ │ Service │  │   Service    │  │
│ │ (Node)  │  │ (Node)  │ │ (Node)  │  │   (Node)     │  │
│ └─────────┘  └─────────┘ └─────────┘  └─────────┘     │
└──────────────────────────┼───────────────────────────────┘
                           │
                           │ Internal API Communication
                           │ (gRPC / REST / GraphQL)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   MESSAGE QUEUE LAYER                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Apache Kafka / RabbitMQ                 │ │
│  │                                                      │ │
│  │  Topics:                                             │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │ │
│  │  │payments    │  │kyc_events  │  │notifications│     │ │
│  │  │transactions│  │fraud_alerts│  │sms_email    │     │ │
│  │  │account     │  │loan_apps   │  │push_notifs  │     │ │
│  │  └────────────┘  └────────────┘  └────────────┘     │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              PostgreSQL (Primary DB)                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │  Users   │  │  Accounts│  │Transactions│         │ │
│  │  │  Table   │  │  Table   │  │  Table     │         │ │
│  │  └──────────┘  └──────────┘  └──────────┘          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │  Cards   │  │  Loans   │  │  KYC       │        │ │
│  │  │  Table   │  │  Table   │  │  Records   │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘          │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              MongoDB (Analytics/Logs)                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │App Logs  │  │User Events│  │Audit Trail │         │ │
│  │  └──────────┘  └──────────┘  └──────────┘          │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Redis (Cache Layer)                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │Sessions  │  │Rate Limit│  │User Data   │         │ │
│  │  │JWT Tokens│  │Counters  │  │Cache       │         │ │
│  │  └──────────┘  └──────────┘  └──────────┘          │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Elasticsearch (Search)                    │ │
│  │  ┌──────────┐  ┌──────────┐                          │ │
│  │  │Transaction│  │User Search│                         │ │
│  │  │History   │  │Indexing   │                         │ │
│  │  └──────────┘  └──────────┘                          │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATION LAYER                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │  Partner │  │  UPI     │  │   Visa   │  │  Aadhaar ││
│  │  Bank    │  │  NPCI    │  │Mastercard│  │  UIDAI   ││
│  │  API     │  │  Gateway │  │  Network │  │  API     ││
│  │(Federal) │  │(Razorpay)│  │          │  │          ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │  NSDL    │  │  RBI     │  │Firebase  │  │  AWS     ││
│  │  PAN     │  │Reporting │  │Push Notif│  │  S3      ││
│  │  Verify  │  │  Returns │  │FCM/APNs  │  │ Storage  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│  ┌──────────┐  ┌──────────┐                              │
│  │  SMS     │  │  Email   │                              │
│  │  Twilio  │  │  SendGrid│                              │
│  │  Msg91   │  │  SES     │                              │
│  └──────────┘  └──────────┘                              │
└──────────────────────────────────────────────────────────┘
```

---

## Microservices Breakdown

### 1. User Service
```
Responsibilities:
├── User Registration & Profile Management
├── Authentication (JWT/OAuth)
├── Password Reset / OTP Verification
├── Session Management
└── User Preferences & Settings

APIs:
├── POST /api/v1/users/register
├── POST /api/v1/users/login
├── GET  /api/v1/users/profile
├── PUT  /api/v1/users/profile
├── POST /api/v1/users/verify-otp
└── POST /api/v1/users/reset-password

Database:
├── users table (id, email, phone, password_hash, status)
├── user_profiles (user_id, name, dob, address, kyc_status)
└── sessions (id, user_id, token, expires_at)
```

### 2. Payment Service
```
Responsibilities:
├── UPI Payments (Send/Receive)
├── NEFT/IMPS/RTGS Transfers
├── Bill Payments
├── Recharge & Utility Payments
└── Payment Gateway Integration

APIs:
├── POST /api/v1/payments/upi-send
├── POST /api/v1/payments/upi-request
├── POST /api/v1/payments/bank-transfer
├── POST /api/v1/payments/bill-pay
├── GET  /api/v1/payments/status/{id}
└── GET  /api/v1/payments/history

External APIs:
├── NPCI UPI API
├── Razorpay / BillDesk
└── Partner Bank Core Banking API
```

### 3. Wallet Service
```
Responsibilities:
├── Balance Management
├── Wallet Creation
├── Fund Addition / Withdrawal
├── Transaction History
└── Reward Points / Cashback

APIs:
├── POST /api/v1/wallet/create
├── GET  /api/v1/wallet/balance
├── POST /api/v1/wallet/add-funds
├── POST /api/v1/wallet/withdraw
├── GET  /api/v1/wallet/transactions
└── GET  /api/v1/wallet/details

Database:
├── wallets (id, user_id, balance, currency, status)
├── wallet_transactions (id, wallet_id, type, amount, status)
└── ledger_entries (debit/credit records)
```

### 4. KYC Service
```
Responsibilities:
├── Document Upload & Verification
├── PAN Validation (NSDL API)
├── Aadhaar Verification (UIDAI API)
├── Face Match / Liveness Detection
├── KYC Status Tracking
└── Compliance Reporting

APIs:
├── POST /api/v1/kyc/upload-documents
├── POST /api/v1/kyc/verify-pan
├── POST /api/v1/kyc/verify-aadhaar
├── POST /api/v1/kyc/face-match
├── GET  /api/v1/kyc/status
└── GET  /api/v1/kyc/documents

External APIs:
├── NSDL PAN Verification API
├── UIDAI Aadhaar eKYC API
├── Onfido / Jumio (Face Match)
└── Digilocker (Document Fetch)
```

### 5. Card Service
```
Responsibilities:
├── Virtual Card Generation
├── Physical Card Issuance
├── Card Management (Freeze/Unfreeze/Block)
├── PIN Generation / Reset
├── Card Transaction Processing
└── Reward Points Management

APIs:
├── POST /api/v1/cards/create-virtual
├── POST /api/v1/cards/order-physical
├── GET  /api/v1/cards/list
├── POST /api/v1/cards/{id}/freeze
├── POST /api/v1/cards/{id}/unfreeze
├── POST /api/v1/cards/{id}/reset-pin
└── GET  /api/v1/cards/{id}/transactions

External APIs:
├── Visa / Mastercard API
├── Card Network Processing
└── Partner Bank Card Management
```

### 6. Transaction Service
```
Responsibilities:
├── Transaction Recording & History
├── Real-time Balance Updates
├── Transaction Categorization
├── Reconciliation
├── Settlement Processing
└── Failed Transaction Handling

APIs:
├── GET  /api/v1/transactions/list
├── GET  /api/v1/transactions/{id}
├── POST /api/v1/transactions/query
├── GET  /api/v1/transactions/summary
├── GET  /api/v1/transactions/categories
└── GET  /api/v1/transactions/export

Database:
├── transactions (id, user_id, type, amount, status, timestamp)
├── transaction_categories (id, name, icon, color)
└── transaction_metadata (id, transaction_id, merchant, location)
```

### 7. Notification Service
```
Responsibilities:
├── Push Notifications (iOS/Android)
├── SMS Notifications
├── Email Notifications
├── In-App Notifications
├── Notification Templates
└── Delivery Tracking

APIs:
├── POST /api/v1/notifications/send
├── POST /api/v1/notifications/bulk
├── GET  /api/v1/notifications/list
├── PUT  /api/v1/notifications/{id}/read
├── GET  /api/v1/notifications/preferences
└── PUT  /api/v1/notifications/preferences

External APIs:
├── Firebase Cloud Messaging (FCM)
├── Apple Push Notification Service (APNs)
├── Twilio / Msg91 (SMS)
├── SendGrid / AWS SES (Email)
```

### 8. Analytics Service
```
Responsibilities:
├── User Behavior Analytics
├── Spending Pattern Analysis
├── Fraud Detection (ML Models)
├── Business Intelligence Reports
├── Real-time Dashboards
└── Predictive Analytics

APIs:
├── GET  /api/v1/analytics/spending-summary
├── GET  /api/v1/analytics/monthly-report
├── GET  /api/v1/analytics/category-breakdown
├── POST /api/v1/analytics/fraud-check
├── GET  /api/v1/analytics/user-insights
└── GET  /api/v1/analytics/retention-metrics

Tools:
├── Apache Kafka (Event Streaming)
├── Apache Spark (Data Processing)
├── Elasticsearch (Search/Analytics)
├── Grafana (Dashboards)
└── Python ML Models (Scikit-learn/TensorFlow)
```

---

## Data Flow: Send Money Transaction

```
User Action: Send ₹500 to Friend

Step 1: App → API Gateway
  POST /api/v1/payments/upi-send
  Headers: Authorization: Bearer <JWT>
  Body: { recipient: "friend@upi", amount: 500, note: "Lunch" }

Step 2: API Gateway → Auth Service
  Validate JWT Token
  Check Rate Limit (not exceeded)
  Route to Payment Service

Step 3: Payment Service → Wallet Service
  Check sender balance >= ₹500
  Lock ₹500 (prevents double-spending)

Step 4: Payment Service → Partner Bank API
  Initiate UPI transfer via NPCI
  Transaction ID: TXN123456789
  Status: PENDING

Step 5: Partner Bank → NPCI UPI Network
  Route to recipient's bank
  Debit sender account: -₹500
  Credit recipient account: +₹500

Step 6: NPCI → Partner Bank → Payment Service
  Callback: Transaction SUCCESS
  Transaction ID: TXN123456789
  UPI Reference: UPI987654321

Step 7: Payment Service → Wallet Service
  Deduct ₹500 from sender balance
  Update transaction status: SUCCESS

Step 8: Payment Service → Transaction Service
  Record transaction in database
  Categorize: "Food & Dining"

Step 9: Payment Service → Notification Service
  Push: "₹500 sent to friend@upi" (Sender)
  Push: "₹500 received from you@upi" (Recipient)
  SMS: Transaction confirmation

Step 10: Payment Service → Kafka
  Publish event: payment.completed
  Analytics: Update spending metrics

Step 11: App → User
  Show success screen
  Update balance: ₹500 less
  Add to transaction history
```

---

## Security Architecture

```
┌────────────────────────────────────────┐
│           Security Layers               │
├────────────────────────────────────────┤
│  1. Transport Layer                    │
│     ├── TLS 1.3 (HTTPS)                 │
│     ├── Certificate Pinning             │
│     └── HSTS Headers                    │
├────────────────────────────────────────┤
│  2. Application Layer                   │
│     ├── JWT Authentication              │
│     ├── OAuth 2.0 / OpenID Connect      │
│     ├── API Key Management              │
│     └── Request Signing                 │
├────────────────────────────────────────┤
│  3. Data Layer                          │
│     ├── AES-256 Encryption (at rest)   │
│     ├── Field-level Encryption (PII)    │
│     ├── Database Auditing               │
│     └── Tokenization (Card Numbers)     │
├────────────────────────────────────────┤
│  4. Infrastructure Layer               │
│     ├── VPC / Private Subnets           │
│     ├── WAF (Web Application Firewall)  │
│     ├── DDoS Protection (AWS Shield)    │
│     └── Network ACLs / Security Groups  │
├────────────────────────────────────────┤
│  5. Compliance Layer                    │
│     ├── PCI DSS (Card Data)             │
│     ├── RBI Guidelines (India)          │
│     ├── GDPR (EU Users)                 │
│     └── ISO 27001 Certification         │
└────────────────────────────────────────┘
```

---

## Deployment Architecture (AWS)

```
┌────────────────────────────────────────┐
│              AWS Cloud                  │
│  ┌─────────────────────────────────┐   │
│  │        Route 53 (DNS)            │   │
│  └─────────────────────────────────┘   │
│           │                             │
│  ┌────────┴────────┐                  │
│  │  CloudFront CDN  │                  │
│  │  (Static Assets) │                  │
│  └────────┬────────┘                  │
│           │                             │
│  ┌────────┴────────┐                  │
│  │  WAF + Shield    │                  │
│  │  (DDoS/WAF)      │                  │
│  └────────┬────────┘                  │
│           │                             │
│  ┌────────┴────────┐                  │
│  │  API Gateway     │                  │
│  │  (Rate Limit)    │                  │
│  └────────┬────────┘                  │
│           │                             │
│  ┌────────┴────────┐                  │
│  │  EKS Cluster     │                  │
│  │  (Kubernetes)     │                  │
│  │  ┌─────────────┐ │                  │
│  │  │  Pod 1-10   │ │                  │
│  │  │  (App)      │ │                  │
│  │  └─────────────┘ │                  │
│  └────────┬────────┘                  │
│           │                             │
│  ┌────────┴────────┐                  │
│  │  RDS PostgreSQL  │                  │
│  │  Multi-AZ        │                  │
│  └────────┬────────┘                  │
│  ┌────────┴────────┐                  │
│  │  ElastiCache     │                  │
│  │  Redis Cluster   │                  │
│  └────────┬────────┘                  │
│  ┌────────┴────────┐                  │
│  │  S3 Buckets      │                  │
│  │  (Documents)     │                  │
│  └────────┬────────┘                  │
│  ┌────────┴────────┐                  │
│  │  CloudWatch      │                  │
│  │  (Logs/Metrics)  │                  │
│  └─────────────────┘                  │
└────────────────────────────────────────┘
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native / Flutter | Mobile apps (iOS/Android) |
| **Web** | React.js / Next.js | Web dashboard |
| **API Gateway** | Kong / AWS API Gateway | Request routing, rate limiting |
| **Load Balancer** | Nginx / AWS ALB | Traffic distribution |
| **App Server** | Node.js / Express | Microservices |
| **Message Queue** | Apache Kafka | Event streaming |
| **Primary DB** | PostgreSQL | Structured data |
| **Cache** | Redis | Session, cache, rate limiting |
| **Search** | Elasticsearch | Transaction search |
| **Analytics** | MongoDB / ClickHouse | Logs, events |
| **Storage** | AWS S3 | Documents, KYC files |
| **Monitoring** | Datadog / Grafana | Metrics, dashboards |
| **Logging** | ELK Stack / CloudWatch | Centralized logging |
| **CI/CD** | GitHub Actions / Jenkins | Build and deployment |
| **Container** | Docker / Kubernetes | Container orchestration |
| **Cloud** | AWS / GCP / Azure | Infrastructure |

---

## Database Schema (Simplified)

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'INR',
    account_number VARCHAR(20) UNIQUE,
    ifsc_code VARCHAR(11),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    wallet_id UUID REFERENCES wallets(id),
    type VARCHAR(20) NOT NULL, -- 'debit', 'credit'
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed'
    payment_method VARCHAR(50), -- 'upi', 'card', 'netbanking'
    recipient VARCHAR(255),
    description VARCHAR(255),
    upi_ref VARCHAR(50),
    bank_ref VARCHAR(50),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

### KYC Records Table
```sql
CREATE TABLE kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    pan_number VARCHAR(10),
    aadhaar_number VARCHAR(12),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    address TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_at TIMESTAMP,
    documents JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

This is a complete NeoBank architecture. Want me to explain any specific part in more detail?
