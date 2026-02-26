import winston from 'winston';
import fs from 'fs';
import path from 'path';

import { config } from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Ensure logs directory exists
if (!fs.existsSync(config.logging.dir)) {
  fs.mkdirSync(config.logging.dir, { recursive: true });
}

const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} [${level}]: ${message}\n${stack}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'error.log'),
      level: 'error'
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'combined.log')
    })
  ]
});

// Add console transport in development
if (config.env === 'development') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    })
  );
}

export default logger;
