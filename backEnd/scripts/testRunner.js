const axios = require('axios');
const path = require('path');
const fs = require('fs');

const API_BASE = 'http://localhost:5000/api/v1';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

async function runTests() {
  console.log(`${colors.cyan}====================================================`);
  console.log(`🧪 ClauseIQ v1.0.0 Automated Test Suite Running...`);
  console.log(`====================================================${colors.reset}`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ${colors.green}✓ PASS:${colors.reset} ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${name} -> ${err.message}`);
      if (err.response?.data) {
        console.error(`    ${colors.yellow}Response:${colors.reset}`, JSON.stringify(err.response.data));
      }
      failed++;
    }
  }

  let authToken = '';
  let testUserId = '';
  let createdContractId = '';

  // 1. Health Endpoint
  await test('GET /health endpoint returns online status', async () => {
    const res = await axios.get(`${API_BASE}/health`);
    if (res.data.status !== 'online') throw new Error('Health check status is not online');
  });

  // 2. Auth: Register
  const randomEmail = `test_${Date.now()}@clauseiq.ai`;
  await test('POST /auth/register creates user and returns JWT token', async () => {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Integration Tester',
      email: randomEmail,
      password: 'testPassword123',
      company: 'Test Org'
    });
    if (!res.data.data.token) throw new Error('No token returned in register response');
    authToken = res.data.data.token;
    testUserId = res.data.data.user.id;
  });

  // 3. Auth: Login
  await test('POST /auth/login verifies credentials and returns token', async () => {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: randomEmail,
      password: 'testPassword123'
    });
    if (!res.data.data.token) throw new Error('No token returned in login response');
  });

  // 4. Auth: Profile
  await test('GET /auth/profile retrieves protected user payload with Bearer JWT', async () => {
    const res = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (res.data.data.user.email !== randomEmail) throw new Error('User email does not match profile');
  });

  // 5. AI Direct Chat Context
  await test('POST /ai/chat/general returns grounded answer and citations', async () => {
    const res = await axios.post(
      `${API_BASE}/ai/chat/general`,
      {
        question: 'Is a post-employment non-compete clause enforceable?'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    if (!res.data.data.chatResponse.answer) throw new Error('Chat response did not contain answer');
    if (!res.data.data.chatResponse.citations?.length) throw new Error('No legal citations returned');
  });

  // 6. Contracts list
  await test('GET /contracts retrieves contract library', async () => {
    const res = await axios.get(`${API_BASE}/contracts`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Contracts payload is not an array');
  });

  // 7. Notifications
  await test('GET /notifications retrieves user alerts', async () => {
    const res = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data.notifications)) throw new Error('Notifications is not an array');
  });

  console.log(`\n${colors.cyan}====================================================`);
  console.log(`📊 Test Summary: ${colors.green}${passed} Passed${colors.cyan}, ${failed > 0 ? colors.red : colors.green}${failed} Failed`);
  console.log(`====================================================${colors.reset}`);

  if (failed > 0) process.exit(1);
}

runTests();
