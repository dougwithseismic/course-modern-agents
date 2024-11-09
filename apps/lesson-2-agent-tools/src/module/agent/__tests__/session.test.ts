import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Session } from '../session'
import { Agent } from '..'
import { createTool } from '../tool'
import { z } from 'zod'
import { convertObjectToXmlPrompt } from '@/utility/convert-object-to-xml-prompt'

vi.mock('@/config/app-config', () => ({
  config: {
    OPENAI_API_KEY: 'mock-api-key',
    API_BASE_URL: 'http://localhost:666',
  },
}))

const mockOpenAIResponse = vi.fn()
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockOpenAIResponse,
        },
      },
    })),
  }
})

describe('Session', () => {
  const mockSystemPrompt = convertObjectToXmlPrompt({
    obj: {
      system: {
        role: 'Test Assistant',
        capabilities: ['testing', 'mocking'],
      },
    },
  })

  const mockTool = createTool({
    name: 'testTool',
    description: 'A test tool',
    parameters: z.object({
      input: z.string(),
    }),
    execute: async ({ input }) => `Processed: ${input}`,
  })

  const mockAgent = new Agent({
    name: 'Test Agent',
    description: 'A test agent',
    systemPrompt: mockSystemPrompt,
    tools: [mockTool],
  })

  let session: Session

  beforeEach(() => {
    session = new Session({ agent: mockAgent })
    mockOpenAIResponse.mockReset()
  })

  it('should initialize with system prompt in history', () => {
    const history = session.getHistory()
    expect(history).toHaveLength(1)
    expect(history[0]).toEqual({
      role: 'system',
      content: mockSystemPrompt,
    })
  })

  it('should handle normal message exchange', async () => {
    mockOpenAIResponse.mockResolvedValueOnce({
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Normal response',
          },
        },
      ],
    })

    const response = await session.sendMessage({
      role: 'user',
      content: 'Hello',
    })

    expect(response.content).toBe('Normal response')
  })

  it('should handle tool calls', async () => {
    // First response with tool call
    mockOpenAIResponse.mockResolvedValueOnce({
      choices: [
        {
          message: {
            role: 'assistant',
            content: null,
            tool_calls: [
              {
                id: 'call_123',
                function: {
                  name: 'testTool',
                  arguments: JSON.stringify({ input: 'test input' }),
                },
              },
            ],
          },
        },
      ],
    })

    // Second response after tool execution
    mockOpenAIResponse.mockResolvedValueOnce({
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Tool execution complete',
          },
        },
      ],
    })

    const response = await session.sendMessage({
      role: 'user',
      content: 'Use the tool',
    })

    const history = session.getHistory()
    expect(history).toHaveLength(5) // system + user + tool call + tool response + final response
    expect(response.content).toBe('Tool execution complete')
  })

  it('should throw error when no response received', async () => {
    mockOpenAIResponse.mockResolvedValueOnce({
      choices: [],
    })

    await expect(
      session.sendMessage({
        role: 'user',
        content: 'Hello',
      }),
    ).rejects.toThrow('Failed to get response from AI. Please try again.')
  })
})
