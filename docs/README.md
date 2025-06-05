# BudgetAI + Payman Integration Documentation

This documentation covers the implementation of the AI-powered budget management system with Payman payment infrastructure.

## 📁 Documentation Structure

### Phase 1: Enhanced Payman Integration
- [Phase 1 Overview](./phase1/README.md) - Complete implementation guide
- [Company Code + Wallet Integration](./phase1/01-company-code-wallet-integration.md)
- [Dashboard Enhancement](./phase1/02-dashboard-enhancement.md)
- [Employee Self-Service](./phase1/03-employee-self-service.md)
- [API Specifications](./phase1/04-api-specifications.md)
- [Database Schema Updates](./phase1/05-database-schema.md)
- [Frontend Components](./phase1/06-frontend-components.md)

### Implementation Guides
- [Environment Setup](./setup/environment.md)
- [Payman SDK Configuration](./setup/payman-config.md)
- [Database Migration Guide](./setup/database-migration.md)
- [Testing Strategy](./setup/testing.md)

### Architecture
- [System Architecture](./architecture/system-overview.md)
- [Payment Flow Diagrams](./architecture/payment-flows.md)
- [Security Considerations](./architecture/security.md)

## 🚀 Quick Start

1. **Phase 1 Implementation**: Start with [Phase 1 Overview](./phase1/README.md)
2. **Environment Setup**: Follow [Environment Setup](./setup/environment.md)
3. **Payman Configuration**: Configure using [Payman Config Guide](./setup/payman-config.md)

## 📋 Implementation Checklist

### Phase 1: Enhanced Payman Integration ✅
- [ ] Company wallet auto-creation
- [ ] Employee wallet auto-creation with company codes
- [ ] Enhanced company dashboard with real-time monitoring
- [ ] Employee self-service wallet management
- [ ] Policy engine integration
- [ ] API endpoints implementation
- [ ] Frontend components
- [ ] Testing and validation

### Future Phases
- [ ] Phase 2: AI Agent Architecture
- [ ] Phase 3: Streamlined Payment Flows
- [ ] Phase 4: Advanced Features

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Radix UI, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Payments**: Payman SDK (@paymanai/payman-ts)
- **State Management**: Zustand
- **Authentication**: NextAuth.js

## 📖 Key Concepts

### Company Code Flow
1. Admin creates company → Auto-generates code + wallet
2. Employee signs up with code → Auto-creates wallet + applies policies
3. Employee immediately ready for budget operations

### Wallet Types
- **Company Wallets**: USD wallets for business operations
- **Employee Wallets**: TSD wallets for testing, USD for production
- **Personal Wallets**: Optional OAuth-connected employee wallets

### Policy Engine
- Automatic policy application based on company codes
- Department-based spending limits
- Role-based transaction permissions
- Approval thresholds and escalation rules

## 🔗 External Resources

- [Payman Documentation](https://app.paymanai.com)
- [Payman SDK GitHub](https://github.com/paymanai/payman-ts)
- [Project Plan](../plan.md)

## 🆘 Support

For implementation questions:
1. Check the specific phase documentation
2. Review the architecture diagrams
3. Refer to the Payman SDK documentation
4. Check the testing guides for troubleshooting 