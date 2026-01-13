const winston = require('winston');
const path = require('path');

/**
 * Custom logger configuration using Winston
 */

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`;
    }
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join('logs', 'all-logs.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport for errors only
    new winston.transports.File({
      filename: path.join('logs', 'error-logs.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log')
    })
  ]
});

// Add test execution logging methods
logger.testStart = (testName) => {
  logger.info(`========== TEST STARTED: ${testName} ==========`);
};

logger.testEnd = (testName, status) => {
  logger.info(`========== TEST ENDED: ${testName} - ${status} ==========`);
};

logger.step = (stepDescription) => {
  logger.info(`STEP: ${stepDescription}`);
};

logger.assertion = (description, result) => {
  if (result) {
    logger.info(`✓ ASSERTION PASSED: ${description}`);
  } else {
    logger.error(`✗ ASSERTION FAILED: ${description}`);
  }
};

module.exports = logger;
