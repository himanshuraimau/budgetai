# Environment Setup Guide

This guide covers setting up the required environment variables for the BudgetAI + Payman integration.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/budget-manager
NODE_ENV=development

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Payman Integration (Your existing credentials)
PAYMAN_CLIENT_ID=pm-test-pnIQljqD50H3GkdezYbwWF2n
PAYMAN_CLIENT_SECRET=4cBW8wNd89UF3HkogC3wSzLhGSfBzRaf50F5q1wqXfLcptH6FxtXTGT8AEJbkDpi

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BudgetAI
```

## Environment Variable Details

### Database
- `MONGODB_URI`: MongoDB connection string for your database
- `NODE_ENV`: Environment (development, production, test)

### Authentication
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js (generate with `openssl rand -base64 32`)

### Payman Integration
- `PAYMAN_CLIENT_ID`: Your Payman app client ID
- `PAYMAN_CLIENT_SECRET`: Your Payman app client secret

> **Note**: You already have working Payman credentials. These will be used for ALL companies and users through your single app.

### App Configuration
- `NEXT_PUBLIC_APP_URL`: Public URL of your application
- `NEXT_PUBLIC_APP_NAME`: Display name for your application

## Production Setup

For production deployment, ensure:

1. **Secure Secrets**: Use proper secret management (Vercel/Railway environment variables)
2. **Production Database**: Use MongoDB Atlas or managed database
3. **HTTPS URLs**: All URLs should use HTTPS in production
4. **Strong Secrets**: Generate cryptographically secure secrets

## Validation

You can test your environment setup by running:

```bash
# Check if environment variables are loaded
npm run dev

# Test Payman connection
npm run payman
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGODB_URI` format
   - Ensure MongoDB is running locally or Atlas is accessible
   - Verify network connectivity

2. **Payman Authentication Failed**
   - Verify `PAYMAN_CLIENT_ID` and `PAYMAN_CLIENT_SECRET`
   - Check if credentials are still valid on Payman dashboard
   - Ensure no extra spaces or characters

3. **NextAuth Errors**
   - Verify `NEXTAUTH_URL` matches your actual domain
   - Ensure `NEXTAUTH_SECRET` is set and sufficiently long
   - Check if URL is accessible

### Testing Environment

```bash
# Test database connection
node -e "console.log('MongoDB URI:', process.env.MONGODB_URI)"

# Test Payman credentials
node -e "console.log('Payman ID:', process.env.PAYMAN_CLIENT_ID?.substring(0, 10) + '...')"
```

## Next Steps

After setting up environment variables:

1. [Configure Payman SDK](./payman-config.md)
2. [Run Database Migrations](./database-migration.md)
3. [Start Phase 1 Implementation](../phase1/README.md) 