import pkg from 'pg';
const { Pool } = pkg;

import { config } from './env.js';

const pool = new Pool(config.database);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text, params) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export const closePool = async () => {
  await pool.end();
};

// Health check function
export const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW()');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default pool;
