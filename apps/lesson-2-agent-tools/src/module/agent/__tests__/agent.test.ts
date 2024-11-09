import { describe, it, expect, vi } from 'vitest'
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

describe('Agent', () => {
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

  const mockAgentParams = {
    name: 'Test Agent',
    description: 'A test agent',
    systemPrompt: mockSystemPrompt,
    tools: [mockTool],
  }

  it('should create an agent with the correct properties', () => {
    const agent = new Agent(mockAgentParams)
    expect(agent.getName()).toBe(mockAgentParams.name)
    expect(agent.getDescription()).toBe(mockAgentParams.description)
    expect(agent.getSystemPrompt()).toBe(mockAgentParams.systemPrompt)
    expect(agent.getTools()).toHaveLength(1)
    expect(agent.getTools()[0]?.function.name).toBe('testTool')
  })

  it('should create a session', () => {
    const agent = new Agent(mockAgentParams)
    const session = agent.createSession()
    expect(session).toBeDefined()
    expect(session.getAgent()).toBe(agent)
  })

  it('should initialize with empty tools array when no tools provided', () => {
    const agentWithoutTools = new Agent({
      ...mockAgentParams,
      tools: undefined,
    })
    expect(agentWithoutTools.getTools()).toEqual([])
  })
})
