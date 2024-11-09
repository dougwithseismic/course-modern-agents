import { convertObjectToXmlPrompt } from '@/utility/convert-object-to-xml-prompt'
import { Agent } from '../module/agent'
import { createTool } from '@/module/agent/tool'
import { z } from 'zod'

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

const main = async () => {
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

  // 1. Create an agent with a specific personality
  const mathTutor = new Agent({
    name: 'Math Tutor',
    description:
      'A friendly math tutor that helps students understand mathematics',
    systemPrompt,
    tools: [calculateMath],
  })

  // 2. Create a chat session with the agent
  const session = mathTutor.createSession()

  // 3. Send a message and get response
  try {
    const response = await session.sendMessage({
      role: 'user',
      content: 'What is 2,320 divided by 2?',
    })

    console.log('AI Response:', response.content)

    // 4. You can continue the conversation
    const followUpResponse = await session.sendMessage({
      role: 'user',
      content: 'And if we divided that by 3.4 what would we get?',
    })

    console.log('AI Response:', followUpResponse.content)
  } catch (error) {
    console.error('Something went wrong:', error)
  }
}

// Run the example
main()
