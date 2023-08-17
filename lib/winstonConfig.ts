import winston, { format } from 'winston';

const filterSensitive = format((info) => {
  if (info.message) {
    info.message = info.message.replace(
      /Bearer [A-Za-z0-9-_]+/,
      'Bearer [FILTERED]'
    );
  }
  if (info.error && typeof info.error === 'string') {
    info.error = info.error.replace(
      /Bearer [A-Za-z0-9-_]+/,
      'Bearer [FILTERED]'
    );
  }
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(filterSensitive(), winston.format.json()),
  defaultMeta: { service: 'your-service-name' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        filterSensitive(),
        winston.format.simple()
      ),
    })
  );
}

function createServiceLogger(serviceName: string) {
  return {
    info: (message: string, meta?: object) => {
      logger.info(message, { ...meta, service: serviceName });
    },
    error: (message: string, meta?: object) => {
      logger.error(message, { ...meta, service: serviceName });
    },
  };
}

export { logger, createServiceLogger };
