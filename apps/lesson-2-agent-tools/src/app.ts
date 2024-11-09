import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/app-config'
import { logger } from './config/logger'
import { requestLogger } from './middleware/request-logger'
import { healthRouter } from './routes/health'
import { Agent } from './module/agent'

const app = express()
const PORT = config.PORT

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Routes
app.use('/health', healthRouter)

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error('Unhandled error', { error: err.stack })
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  },
)

app.post(
  '/agent/send-message',
  async (req: express.Request, res: express.Response) => {
    try {
      const { message } = req.body
      if (!message) {
        return res.status(400).json({ error: 'Message is required' })
      }

      const myFirstAgent = new Agent({
        name: 'My First Agent',
        description: 'A test agent',
        systemPrompt: 'You are a test assistant',
      })

      const session = myFirstAgent.createSession()
      const response = await session.sendMessage(message)

      res.status(200).json({ response })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  },
)

app.listen(PORT, () => {
  logger.info(
    `🚀 :: Lesson 1: Getting Started. Server is running on port ${PORT}`,
  )
})
