import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Session } from '../session'
import { Agent } from '..'

vi.mock('@/config/app-config', () => ({
  config: {
    OPENAI_API_KEY: 'mock-api-key',
    API_BASE_URL: 'http://localhost:666',
  },
}))
// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'Mock response',
                },
              },
            ],
          }),
        },
      },
    })),
  }
})

describe('Session', () => {
  const mockAgent = new Agent({
    name: 'Test Agent',
    description: 'A test agent',
    systemPrompt: 'You are a test assistant',
  })

  let session: Session

  beforeEach(() => {
    session = new Session({ agent: mockAgent })
  })

  it('should initialize with system prompt in history', () => {
    const history = session.getHistory()

    expect(history).toHaveLength(1)
    expect(history[0]).toEqual({
      role: 'system',
      content: mockAgent.getSystemPrompt(),
    })
  })

  it('should add message to history', () => {
    const message = {
      role: 'user' as const,
      content: 'Hello',
    }

    session.addMessage(message)
    const history = session.getHistory()

    expect(history).toHaveLength(2)
    expect(history[1]).toEqual(message)
  })

  it('should send message and get response', async () => {
    const message = {
      role: 'user' as const,
      content: 'Hello',
    }

    const response = await session.sendMessage(message)

    expect(response).toEqual({
      role: 'assistant',
      content: 'Mock response',
    })
  })

  it('should maintain reference to agent', () => {
    expect(session.getAgent()).toBe(mockAgent)
  })
})
