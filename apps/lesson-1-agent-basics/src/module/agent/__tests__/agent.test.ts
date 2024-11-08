import { describe, it, expect, vi } from 'vitest'
import { Agent } from '..'

vi.mock('@/config/app-config', () => ({
  config: {
    OPENAI_API_KEY: 'mock-api-key',
    API_BASE_URL: 'http://localhost:666',
  },
}))

describe('Agent', () => {
  const mockAgentParams = {
    name: 'Test Agent',
    description: 'A test agent',
    systemPrompt: 'You are a test assistant',
  }

  it('should create an agent with the correct properties', () => {
    const agent = new Agent(mockAgentParams)

    expect(agent.getName()).toBe(mockAgentParams.name)
    expect(agent.getDescription()).toBe(mockAgentParams.description)
    expect(agent.getSystemPrompt()).toBe(mockAgentParams.systemPrompt)
  })

  it('should create a session', () => {
    const agent = new Agent(mockAgentParams)
    const session = agent.createSession()

    expect(session).toBeDefined()
    expect(session.getAgent()).toBe(agent)
  })
})
