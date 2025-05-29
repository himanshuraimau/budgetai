#!/bin/bash

echo "🚀 Setting up Shopping Assistant Authentication..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    
    # Generate a random NextAuth secret
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    cat > .env.local << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shopping-assistant

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
EOF
    
    echo "✅ Created .env.local with auto-generated NextAuth secret"
    echo "📋 Please update the MONGODB_URI if you're using a different MongoDB setup"
else
    echo "⚠️  .env.local already exists. Skipping creation."
fi

echo ""
echo "🔧 Installation completed! Here's what you need to do next:"
echo ""
echo "1. Start MongoDB (if using local MongoDB):"
echo "   sudo systemctl start mongod"
echo "   # or"
echo "   mongod"
echo ""
echo "2. Update your .env.local file if needed:"
echo "   - For MongoDB Atlas, update MONGODB_URI"
echo "   - For different port, update NEXTAUTH_URL"
echo ""
echo "3. Start the development server:"
echo "   pnpm dev"
echo ""
echo "📚 API Endpoints:"
echo "   POST /api/auth/register - User registration"
echo "   POST /api/auth/signin   - User login (NextAuth)"
echo ""
echo "🔐 Authentication Features:"
echo "   ✅ MongoDB with Mongoose"
echo "   ✅ Password hashing with bcryptjs"
echo "   ✅ NextAuth integration"
echo "   ✅ Zustand state management"
echo "   ✅ Form validation"
echo "   ✅ Route protection"
echo "   ✅ User session management"
echo ""
