#!/usr/bin/env node

/**
 * JWT Token Generator for Testing
 * 
 * Usage: node generate-token.js <userId> <email> <role>
 * Example: node generate-token.js 1 user@example.com user
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = 'aT9$mK2@vP7#xL4&wQ6!jN5%bR3^sD1*eF8(hG0)iY9-uC4_oZ2+wE6';
const ACCESS_TOKEN_EXPIRY = '30m';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('JWT Token Generator');
  console.log('==================\n');
  console.log('Usage: node generate-token.js <userId> <email> <role>\n');
  console.log('Arguments:');
  console.log('  userId  - User ID (number)');
  console.log('  email   - User email');
  console.log('  role    - User role (user or admin)\n');
  console.log('Example:');
  console.log('  node generate-token.js 1 user@example.com user');
  console.log('  node generate-token.js 2 admin@example.com admin\n');
  process.exit(1);
}

const [userIdStr, email, role] = args;
const userId = parseInt(userIdStr, 10);

if (isNaN(userId)) {
  console.error('Error: userId must be a number');
  process.exit(1);
}

if (!['user', 'admin'].includes(role)) {
  console.error('Error: role must be "user" or "admin"');
  process.exit(1);
}

// Generate access token
const accessToken = jwt.sign(
  { userId, email, role },
  JWT_SECRET,
  { expiresIn: ACCESS_TOKEN_EXPIRY }
);

console.log('\n✅ JWT Token Generated\n');
console.log('Token Type: Access Token');
console.log(`Expires in: ${ACCESS_TOKEN_EXPIRY}\n`);
console.log('Token:');
console.log('------');
console.log(accessToken);
console.log('------\n');

console.log('📋 Payload:');
console.log(JSON.stringify({ userId, email, role }, null, 2));
console.log('\n');

console.log('🧪 How to use in cURL:\n');
console.log(`curl -X GET http://localhost:3001/api/v1/tasks \\`);
console.log(`  -H "Authorization: Bearer ${accessToken}"\n`);

console.log('💡 Or paste in Postman Authorization tab:');
console.log('  Type: Bearer Token');
console.log(`  Token: ${accessToken}\n`);
