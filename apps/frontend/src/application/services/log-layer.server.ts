import 'server-only'

import { redactionPlugin } from '@loglayer/plugin-redaction'
import { PinoTransport } from '@loglayer/transport-pino'
import { LogLayer } from 'loglayer'
import { pino } from 'pino'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Server-side logger using Pino
export const logger = new LogLayer({
  transport: new PinoTransport({
    logger: pino({
      level: process.env.LOG_LEVEL ?? 'info',
      ...(isDevelopment && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
    }),
  }),
  plugins: [
    redactionPlugin({
      paths: ['password'],
      censor: '[REDACTED]',
    }),
  ],
  contextFieldName: 'context',
  metadataFieldName: 'metadata',
})
