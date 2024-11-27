import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { config } from './config/app-config'
import { logger } from './config/logger'
import { initializeSentry } from './config/sentry'
import { requestLogger } from './middleware/request-logger'
import { healthRouter } from './routes/health'
import { scenarioRouter } from './routes/scenario'
import { puppeteerService } from './services/puppeteer-service'
import { getLinkedInMessages } from './examples/linkedin-messages'

// Initialize Sentry
initializeSentry()

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Routes
app.use('/health', healthRouter)
app.use('/api/scenario', scenarioRouter)

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error('Unhandled error', { error: err.stack })
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  },
)

const PORT = config.PORT

const server = app.listen(PORT, () => {
  logger.info(`🚀 :: Server is running on port ${PORT}`)
})

// Cleanup on shutdown
const cleanup = async () => {
  await puppeteerService.cleanup()
  server.close()
  process.exit(0)
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)
