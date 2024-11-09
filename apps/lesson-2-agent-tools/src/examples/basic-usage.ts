import { convertObjectToXmlPrompt } from '@/utility/convert-object-to-xml-prompt'
import { Agent } from '../module/agent'
import { createTool } from '@/module/agent/tool'
import { z } from 'zod'

/**
 * Tool that performs basic arithmetic calculations.
 * Supports addition, subtraction, multiplication and division operations.
 * Includes validation to prevent division by zero.
 */
const calculateMath = createTool({
  name: 'calculateMath',
  description: 'Performs basic mathematical calculations',
  parameters: z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    firstNumber: z.number(),
    secondNumber: z.number(),
  }),
  execute: async ({ operation, firstNumber, secondNumber }) => {
    switch (operation) {
      case 'add':
        return firstNumber + secondNumber
      case 'subtract':
        return firstNumber - secondNumber
      case 'multiply':
        return firstNumber * secondNumber
      case 'divide':
        if (secondNumber === 0) {
          throw new Error('Cannot divide by zero')
        }
        return firstNumber / secondNumber
      default:
        throw new Error('calculateMath: Invalid operation')
    }
  },
})

/**
 * Main function demonstrating the usage of an AI-powered math tutor.
 * Shows how to:
 * 1. Create a system prompt with specific personality traits
 * 2. Initialize an AI agent with the prompt and tools
 * 3. Start a conversation session
 * 4. Send messages and handle responses
 */
const main = async () => {
  // Define the tutor's personality and teaching approach using XML-structured prompt
  const systemPrompt = convertObjectToXmlPrompt({
    obj: {
      system: {
        role: 'Math Tutor',
        style: {
          characteristics: [
            'Break down problems into clear, logical steps',
            'Use relatable real-world examples',
            'Provide positive reinforcement',
            'Check understanding frequently',
          ],
          approach: [
            'Start with fundamentals before advanced concepts',
            'Use clear, simple language',
            'Avoid technical jargon',
            'Take alternate approaches if student is confused',
            'Include practice problems with solutions',
            'Maintain supportive, non-judgmental tone',
            'Connect math to practical applications',
          ],
        },
        availableTools: [{ ...calculateMath.function }], // Not neccessary to include in the system prompt but can be useful for the AI to know what tools are available
        philosophy:
          'Making mistakes is a natural part of learning. Focus on building understanding through encouragement and real-world relevance.',
      },
    },
  })

  // Initialize the AI agent with personality and tools
  const mathTutor = new Agent({
    name: 'Math Tutor',
    description:
      'A friendly math tutor that helps students understand mathematics',
    systemPrompt,
    tools: [calculateMath],
  })

  // Create a new chat session for interaction
  const session = mathTutor.createSession()

  // Demonstrate conversation flow with error handling
  try {
    const response = await session.sendMessage({
      role: 'user',
      content: 'What is 2,320 divided by 2?',
    })

    console.log('AI Response:', response.content)

    // Show how context is maintained across messages
    const followUpResponse = await session.sendMessage({
      role: 'user',
      content: 'And if we divided that by 3.4 what would we get?',
    })

    console.log('AI Response:', followUpResponse.content)
  } catch (error) {
    console.error('Something went wrong:', error)
  }
}

// Execute the example
main()
