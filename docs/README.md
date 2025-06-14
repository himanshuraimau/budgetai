# BudgetAI Documentation

## Table of Contents
- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [AI Agents](#ai-agents)
- [Payman Integration](#payman-integration)
- [API Reference](#api-reference)

## Introduction

BudgetAI is an intelligent budget management platform that leverages AI agents and programmable payments to automate financial decision-making for companies. Built with Next.js 15 and integrated with Payman's payment infrastructure, it provides autonomous budget management with real-time payment processing.

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- pnpm package manager
- Payman account (for payment features)

### Installation
```bash
git clone <repository-url>
cd budgetai
pnpm install
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/budgetai
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Run Development Server
```bash
pnpm dev
```

## Features

### 🏢 **Company Management**
- Multi-tenant architecture with company codes
- Automated employee onboarding
- Department-based budget allocation
- Real-time spending analytics

### 💼 **Purchase Request Workflow**
- AI-powered request validation
- Intelligent approval automation
- Budget compliance checking
- Fraud detection and risk assessment

### 🤖 **AI Agent System**
- **Request Validation Agent**: Validates business legitimacy
- **Budget Guardian Agent**: Monitors spending patterns
- **Universal Approval Agent**: Makes autonomous decisions
- **Payment Execution Agent**: Processes approved payments

### 💳 **Payman Integration**
- Direct wallet-to-wallet payments
- Automated payee management
- Real-time balance tracking
- Interactive payment chatbot

### 📊 **Analytics & Reporting**
- Department spending visualization
- Budget utilization tracking
- Request approval metrics
- Predictive spending analysis

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with credentials provider
- **State Management**: TanStack Query for server state
- **Payments**: Payman SDK integration
- **AI**: Custom agent orchestration system

### Project Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── employee/          # Employee portal pages
│   ├── auth/              # Authentication pages
│   └── api/               # API endpoints
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── dashboard/         # Dashboard widgets
├── lib/                   # Utility libraries
│   ├── agents/            # AI agent implementations
│   ├── payman/            # Payman SDK integration
│   └── services/          # Business logic services
├── hooks/                 # Custom React hooks
├── db/                    # Database models and config
└── types/                 # TypeScript definitions
```

## User Roles

### 👨‍💼 **Company Admin**
**Capabilities:**
- Create and manage departments
- Set monthly budget allocations
- Review and approve/deny requests
- Monitor company-wide spending
- Access comprehensive analytics
- Manage employee permissions

**Dashboard Features:**
- Real-time budget utilization
- Department spending breakdown
- Recent request activity
- Company performance metrics

### 👩‍💻 **Employee**
**Capabilities:**
- Submit purchase requests
- Track request status
- View department budget status
- Access personal spending history
- Use Payman chatbot for payments

**Dashboard Features:**
- Personal request history
- Department budget overview
- Quick request submission
- Approval status tracking

## AI Agents

### 🔍 **Request Validation Agent**
**Purpose**: First-line defense against invalid requests

**Validation Checks:**
- Personal vs. business expense detection
- Category-description matching
- Business purpose verification
- Required documentation validation

**Example Decisions:**
```
❌ "i need money for food as i am hungry"
→ DENIED: Personal expense detected

✅ "Purchase Cursor license for team productivity"
→ APPROVED: Valid business purpose
```

### 🛡️ **Budget Guardian Agent**
**Purpose**: Comprehensive budget and risk analysis

**Analysis Areas:**
- Budget impact assessment
- Spending pattern analysis
- Risk factor identification
- Predictive modeling

**Key Metrics:**
- Percentage of budget utilization
- Impact on monthly projections
- Historical spending patterns
- Risk severity scoring

### ⚡ **Universal Approval Agent**
**Purpose**: Final approval decision making

**Decision Factors:**
- Validation agent results
- Budget guardian analysis
- Company policy compliance
- Fraud risk assessment
- Historical approval patterns

**Approval Thresholds:**
- Low risk + valid business purpose
- Within budget constraints
- Meets company policy requirements

## Payman Integration

### 💰 **Wallet Management**
- Automatic wallet creation for new users
- Real-time balance synchronization
- Multi-wallet support per company
- Secure payment processing

### 🤖 **Payment Chatbot**
**Available Commands:**
```
"what's my wallet balance?"
"list all payees"
"create payee [name] with email [email]"
"send $[amount] to payee [id]"
"list all wallets"
```

**Features:**
- Natural language processing
- Context-aware responses
- Real-time payment execution
- Transaction history access

### 🔄 **Payment Workflows**
1. **Request Approval** → AI agent processing
2. **Budget Validation** → Automatic budget checking
3. **Payment Execution** → Direct wallet transfer
4. **Confirmation** → Real-time status updates

## API Reference

### Authentication
All API endpoints require authentication via NextAuth session.

### Admin Endpoints
```
GET    /api/admin/departments     # List departments
POST   /api/admin/departments     # Create department
PUT    /api/admin/departments/:id # Update department
DELETE /api/admin/departments/:id # Delete department

GET    /api/admin/requests        # List all requests
PUT    /api/admin/requests/:id    # Update request status
```

### Employee Endpoints
```
GET    /api/employee/requests     # List user requests
POST   /api/employee/requests     # Create new request
GET    /api/employee/departments  # List user departments
```

### AI Agent Endpoints
```
POST   /api/agents/process-request # Process purchase request
POST   /api/payman/chat          # Payman chatbot interaction
```

### Request/Response Examples

#### Create Purchase Request
```javascript
POST /api/employee/requests
{
  "amount": 299,
  "description": "Figma Pro subscription for design team",
  "category": "Software",
  "justification": "Required for collaborative design work"
}
```

#### AI Agent Processing
```javascript
POST /api/agents/process-request
{
  "requestData": {
    "amount": 299,
    "description": "Figma Pro subscription",
    "category": "Software"
  },
  "requestType": "approval",
  "priority": "medium"
}
```

---

*For more detailed information, see the [Project Plan](./plan.md) and [Agent Improvements](./AGENT_IMPROVEMENTS.md) documentation.*
