import path from 'path'
import winston from 'winston'
import mkdirp from 'mkdirp'
import DailyRotateFile from 'winston-daily-rotate-file'

const { LOG_DIR = path.join(process.cwd(), 'log') } = process.env

mkdirp.sync(LOG_DIR)

const defaultFileOpts = {
  handleExceptions: true,
  json: true,
  colorize: false,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  exitOnError: false,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'error.%DATE%.log'),
      level: 'error',
      ...defaultFileOpts,
    }),
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'combined.%DATE%.log'),
      ...defaultFileOpts,
    }),
  ],
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  )
}

export const stream = {
  write(message) {
    logger.info(message)
  },
}

export { logger }
