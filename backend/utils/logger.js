/**
 * Centralized Logger
 * Handles all logging for the application
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const isDevelopment = process.env.NODE_ENV !== 'production';

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, data = null) => {
  const log = {
    timestamp: getTimestamp(),
    level,
    message,
  };

  if (data && Object.keys(data).length > 0) {
    log.data = data;
  }

  return log;
};

const print = (level, message, data) => {
  const log = formatLog(level, message, data);

  if (isDevelopment) {
    console.log(JSON.stringify(log, null, 2));
  } else {
    console.log(JSON.stringify(log));
  }
};

export const logger = {
  debug: (message, data) => {
    if (isDevelopment) {
      print(LOG_LEVELS.DEBUG, message, data);
    }
  },

  info: (message, data) => {
    print(LOG_LEVELS.INFO, message, data);
  },

  warn: (message, data) => {
    print(LOG_LEVELS.WARN, message, data);
  },

  error: (message, error, data) => {
    const errorData = {
      ...data,
      errorMessage: error?.message,
      errorStack: isDevelopment ? error?.stack : undefined,
    };
    print(LOG_LEVELS.ERROR, message, errorData);
  },
};
