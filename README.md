# Budget Manager

A modern budget management application built with Next.js, MongoDB, and TypeScript.

## Features

- User authentication and authorization
- Company and department management
- Purchase request workflow
- Budget tracking and analytics
- AI-powered request decision making

## Tech Stack

- Next.js 15
- MongoDB with Mongoose
- TypeScript
- Tailwind CSS
- Radix UI Components
- Zustand for state management

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- pnpm package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd budget-manager
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/budget-manager
NODE_ENV=development
```

4. Start the development server:
```bash
pnpm dev
```

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