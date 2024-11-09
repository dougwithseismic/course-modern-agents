import { Session } from './session'
import { Tool } from './tool'
/**
 * Represents an AI agent with a specific personality and purpose.
 * An agent can create multiple chat sessions while maintaining its core identity.
 *
 * @example
 * ```typescript
 * const mathTutor = new Agent({
 *   name: 'Math Tutor',
 *   description: 'A friendly math tutor that helps with algebra',
 *   systemPrompt: 'You are a patient math tutor. Explain concepts clearly and provide step-by-step solutions.',
 *   tools: [],
 * });
 *
 * const session = mathTutor.createSession();
 * ```
 */
export class Agent {
  private readonly name: string
  private readonly description: string
  private readonly systemPrompt: string
  private readonly tools: Tool[]

  /**
   * Creates a new Agent with a specific personality.
   * @param {Object} params - The agent's configuration
   * @param {string} params.name - The name of the agent (e.g., "Math Tutor")
   * @param {string} params.description - A brief description of what the agent does
   * @param {string} params.systemPrompt - Instructions that define the agent's behavior
   * @param {Tool[]} params.tools - An array of tools that the agent can use
   */
  constructor({
    name,
    description,
    systemPrompt,
    tools = [],
  }: {
    name: string
    description: string
    systemPrompt: string
    tools?: Tool[]
  }) {
    this.name = name
    this.description = description
    this.systemPrompt = systemPrompt
    this.tools = tools
  }

  /**
   * Creates a new chat session with this agent.
   * Each session maintains its own conversation history.
   */
  createSession = (): Session => {
    return new Session({
      agent: this,
    })
  }

  // Getter methods with clear names
  getName = () => this.name
  getDescription = () => this.description
  getSystemPrompt = () => this.systemPrompt
  getTools = () => this.tools
}
