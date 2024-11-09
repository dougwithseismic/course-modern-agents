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
      const tools = this.agent.getTools()
      const response = await this.model.chat.completions.create({
        messages: this.history,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
        tools,
        tool_choice: tools.length > 0 ? 'auto' : undefined,
      })

      const reply = response.choices[0]?.message
      if (!reply) {
        console.error('No response received from AI', response)
        throw new Error('No response received from AI')
      }

      // Handle tool calls if present
      if (reply.tool_calls) {
        const toolResults = await Promise.all(
          reply.tool_calls.map(async (toolCall) => {
            const tool = tools.find(
              (t) => t.function.name === toolCall.function.name,
            )
            if (!tool) {
              throw new Error(`Tool ${toolCall.function.name} not found`)
            }
            const params = JSON.parse(toolCall.function.arguments)
            return {
              tool_call_id: toolCall.id,
              output: await tool.$callback?.(params),
            }
          }),
        )

        // Add tool results to conversation
        this.addMessage({
          role: 'assistant',
          content: null,
          tool_calls: reply.tool_calls,
        })

        toolResults.forEach((result) => {
          this.addMessage({
            role: 'tool',
            content: JSON.stringify(result.output),
            tool_call_id: result.tool_call_id,
          })
        })

        // Get final response after tool execution
        const finalResponse = await this.model.chat.completions.create({
          messages: this.history,
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 1000,
        })

        const finalReply = finalResponse.choices[0]?.message
        if (!finalReply) {
          throw new Error('No response received from AI after tool execution')
        }

        this.addMessage(finalReply)
        return finalReply
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
