#!/usr/bin/env node

/**
 * Test script to verify Payman integration flow
 * Run with: node test-payman-flow.js
 */

const BASE_URL = 'http://localhost:3000';

async function testPaymanFlow() {
  console.log('🧪 Testing Payman Integration Flow...\n');

  try {
    // Test 1: Check Payman chatbot endpoint
    console.log('1️⃣ Testing Payman Chatbot...');
    const chatResponse = await fetch(`${BASE_URL}/api/payman/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "what's my wallet balance?" })
    });

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('✅ Payman chatbot working!');
      console.log('   Response:', chatData.response.substring(0, 100) + '...');
    } else {
      console.log('❌ Payman chatbot failed');
    }

    // Test 2: Test payee creation
    console.log('\n2️⃣ Testing Payee Creation...');
    const payeeResponse = await fetch(`${BASE_URL}/api/payman/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: "create a test payee named TestEmployee with email test@company.com" 
      })
    });

    if (payeeResponse.ok) {
      const payeeData = await payeeResponse.json();
      console.log('✅ Payee creation working!');
      console.log('   Response:', payeeData.response.substring(0, 100) + '...');
    } else {
      console.log('❌ Payee creation failed');
    }

    // Test 3: List payees
    console.log('\n3️⃣ Testing Payee List...');
    const listResponse = await fetch(`${BASE_URL}/api/payman/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "list all payees" })
    });

    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('✅ Payee list working!');
      console.log('   Response:', listData.response.substring(0, 150) + '...');
    } else {
      console.log('❌ Payee list failed');
    }

    console.log('\n🎉 Payman flow test completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Register a company through the UI');
    console.log('   2. Register an employee with company code');
    console.log('   3. Submit a purchase request');
    console.log('   4. Check if AI processes and executes payment automatically');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPaymanFlow();
}

export { testPaymanFlow }; 