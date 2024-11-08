import OpenAI from 'openai'
import type { Agent } from '.'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { config } from '@/config/app-config'

/**
 * Represents a chat session with an AI agent.
 * Handles message history and communication with the OpenAI API.
 *
 * @example
 * ```typescript
 * const session = agent.createSession();
 *
 * // Send a message and get response
 * const response = await session.sendMessage({
 *   role: 'user',
 *   content: 'Can you help me solve this equation: 2x + 5 = 13?'
 * });
 *
 * // Get conversation history
 * const history = session.getHistory();
 * ```
 */
export class Session {
  private readonly agent: Agent
  private readonly history: ChatCompletionMessageParam[]
  private readonly model: OpenAI

  constructor({ agent }: { agent: Agent }) {
    if (!config.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set - check your .env file')
    }
    this.agent = agent
    this.model = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    })
    this.history = [
      {
        role: 'system',
        content: this.agent.getSystemPrompt(),
      },
    ]
  }

  /**
   * Adds a message to the conversation history.
   * @param message - The message to add (can be from user or assistant)
   */
  addMessage = (message: ChatCompletionMessageParam) => {
    this.history.push(message)
  }

  /**
   * Sends a message to the AI and gets its response.
   * @param message - The message to send to the AI
   * @returns The AI's response message
   * @throws Error if the API call fails
   *
   * @example
   * ```typescript
   * const response = await session.sendMessage({
   *   role: 'user',
   *   content: 'What is 2 + 2?'
   * });
   * console.log(response.content); // "2 + 2 equals 4"
   * ```
   */
  sendMessage = async (message: ChatCompletionMessageParam) => {
    this.addMessage(message)
    try {
      const response = await this.model.chat.completions.create({
        messages: this.history,
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1000,
      })

      const reply = response.choices[0]?.message
      if (!reply) {
        console.error('No response received from AI', response)
        throw new Error('No response received from AI')
      }

      this.addMessage(reply)
      return reply
    } catch (error) {
      console.error('Error communicating with AI:', error)
      throw new Error('Failed to get response from AI. Please try again.')
    }
  }

  /**
   * Returns the entire conversation history.
   */
  getHistory = () => this.history

  /**
   * Returns the agent associated with this session.
   */
  getAgent = () => this.agent
}
