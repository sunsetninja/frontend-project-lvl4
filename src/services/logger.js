import Rollbar from 'rollbar';

const logger = new Rollbar({
  enabled: process.env.NODE_ENV === 'production',
  accessToken: process.env.LOGGER_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

function useLogger() {
  return logger;
}

export { logger, useLogger };
