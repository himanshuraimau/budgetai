# BudgetAI - Intelligent Budget Management Platform

> **AI-powered budget management with autonomous financial decision-making and programmable payments**

BudgetAI transforms traditional budget management into an intelligent, autonomous financial platform where AI agents make smart decisions and execute payments directly through integrated wallet infrastructure.

## ✨ Key Features

### 🏢 **Smart Company Management**
- **Multi-tenant Architecture**: Isolated company environments with unique access codes
- **Automated Onboarding**: Self-service employee registration via company codes
- **Department Budgeting**: Granular budget allocation and real-time tracking
- **Unified Analytics**: Company-wide spending insights and predictions

### 🤖 **AI Agent Ecosystem**
- **Request Validation Agent**: Validates business legitimacy and prevents fraud
- **Budget Guardian Agent**: Monitors spending patterns and budget compliance
- **Universal Approval Agent**: Makes autonomous approval decisions
- **Payment Execution Agent**: Processes approved payments automatically

### 💼 **Intelligent Purchase Workflow**
- **Natural Language Processing**: Submit requests in plain English
- **Real-time AI Analysis**: Instant validation and decision-making
- **Smart Categorization**: Automatic expense category detection
- **Risk Assessment**: Fraud detection and compliance checking

### 💳 **Integrated Payment System**
- **Direct Wallet Payments**: Instant transfers to employee wallets
- **Interactive Chatbot**: Natural language payment commands
- **Real-time Balance Tracking**: Live wallet and budget monitoring
- **Automated Payee Management**: Smart vendor and employee setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- pnpm package manager

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd budgetai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
pnpm dev
```

### Environment Configuration
```env
MONGODB_URI=mongodb://localhost:27017/budgetai
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development

# Payman Integration (Optional)
PAYMAN_API_KEY=your-payman-api-key
PAYMAN_ORG_ID=your-organization-id
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with credential-based auth
- **State Management**: TanStack Query for server state management
- **Payments**: Payman SDK for programmable payments
- **AI System**: Custom multi-agent orchestration framework

### Project Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── admin/             # Admin dashboard & management
│   ├── employee/          # Employee portal & requests
│   ├── auth/              # Authentication pages
│   └── api/               # RESTful API endpoints
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   ├── layout/            # Navigation & layouts
│   └── dashboard/         # Analytics widgets
├── lib/                   # Core libraries
│   ├── agents/            # AI agent implementations
│   ├── payman/            # Payment system integration
│   └── services/          # Business logic services
├── hooks/                 # Custom React hooks
├── db/                    # Database models & config
└── types/                 # TypeScript definitions
```

## 👥 User Roles & Capabilities

### 🔑 **Company Admin**
- Create and manage department budgets
- Review and approve purchase requests
- Monitor company-wide spending analytics
- Configure approval workflows and policies
- Manage employee access and permissions

### 👨‍💼 **Employee**
- Submit purchase requests via intelligent forms
- Track request status and approval history
- Monitor personal and department budgets
- Access payment chatbot for wallet operations
- View spending analytics and insights

## 🤖 AI Agent Deep Dive

### 🛡️ **Request Validation Agent**
**Purpose**: First-line defense against invalid requests

**Validation Logic**:
- Detects personal vs. business expenses
- Validates category-description alignment
- Ensures proper business justification
- Flags suspicious patterns

**Example Results**:
```
❌ "i need money for food as i am hungry"
→ DENIED: Personal expense detected

✅ "Purchase Figma license for design team productivity"
→ APPROVED: Valid business purpose with clear justification
```

### 📊 **Budget Guardian Agent**
**Purpose**: Comprehensive financial analysis and risk assessment

**Analysis Capabilities**:
- Real-time budget impact calculation
- Spending pattern recognition
- Risk factor identification
- Predictive budget modeling

### ⚡ **Universal Approval Agent**
**Purpose**: Final autonomous decision-making

**Decision Matrix**:
- ✅ Request validation passed
- ✅ Budget constraints satisfied
- ✅ Company policy compliance
- ✅ Low fraud risk score
- ✅ Appropriate amount threshold

## 💳 Payment System Integration

### Payman Chatbot Commands
```bash
# Check wallet balance
"what's my wallet balance?"

# List all payees
"list all payees"

# Create new payee
"create payee John Doe with email john@company.com"

# Send payment
"send $500 to payee [payee-id] for project expenses"

# View transaction history
"show my recent transactions"
```

### Payment Workflow
1. **Request Submission** → Employee submits via form or chat
2. **AI Processing** → Multi-agent analysis and validation
3. **Auto-Approval** → Autonomous decision based on AI analysis
4. **Payment Execution** → Direct wallet-to-wallet transfer
5. **Confirmation** → Real-time notifications and updates

## 📈 Analytics & Insights

### Real-time Dashboards
- **Department Budget Utilization**: Visual progress tracking
- **Spending Trends**: Historical patterns and predictions
- **Request Approval Rates**: AI decision accuracy metrics
- **Risk Assessment**: Fraud detection and prevention stats

### Intelligent Reporting
- Automated monthly budget reports
- Predictive spending forecasts
- Department performance comparisons
- Cost optimization recommendations

## 🛠️ Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript validation
```

### Testing
```bash
pnpm test         # Run test suite
pnpm test:watch   # Watch mode testing
pnpm test:coverage # Coverage reports
```

## 📚 Documentation

- [Detailed Documentation](./docs/README.md) - Comprehensive feature guide
- [API Reference](./docs/api.md) - Complete API documentation
- [Agent System](./AGENT_IMPROVEMENTS.md) - AI agent implementation details
- [Project Roadmap](./plan.md) - Future development plans

---

**Built with ❤️ for intelligent financial management**

## Project Structure

```
budget-manager/
├── app/                 # Next.js app directory
├── components/          # React components
├── db/                  # Database models and configuration
│   ├── models/         # Mongoose models
│   └── config.ts       # MongoDB connection config
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Database Models

- User: Company employees and administrators
- Company: Organization information
- Department: Company departments with budgets
- PurchaseRequest: Employee purchase requests

## Development

- Run development server: `pnpm dev`
- Build for production: `pnpm build`
- Start production server: `pnpm start`
- Run linter: `pnpm lint`

## License

MIT 
