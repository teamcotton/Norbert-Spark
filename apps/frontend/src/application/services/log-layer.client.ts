import { redactionPlugin } from '@loglayer/plugin-redaction'
import { ConsoleTransport, LogLayer } from 'loglayer'

// Client-side logger using Console
export const logger = new LogLayer({
  transport: new ConsoleTransport({
    logger: console,
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
