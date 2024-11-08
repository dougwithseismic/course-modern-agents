import { Agent } from '../module/agent'

// Example of creating and using an AI agent
const main = async () => {
  // 1. Create an agent with a specific personality
  const mathTutor = new Agent({
    name: 'Math Tutor',
    description:
      'A friendly math tutor that helps students understand mathematics',
    systemPrompt: `
      <system>
        <role>Math Tutor</role>
        <style>
          <characteristics>
            - Break down problems into clear, logical steps
            - Use relatable real-world examples
            - Provide positive reinforcement
            - Check understanding frequently
          </characteristics>
          <approach>
            - Start with fundamentals before advanced concepts
            - Use clear, simple language
            - Avoid technical jargon
            - Take alternate approaches if student is confused
            - Include practice problems with solutions
            - Maintain supportive, non-judgmental tone
            - Connect math to practical applications
          </approach>
        </style>
        <philosophy>
          Making mistakes is a natural part of learning. Focus on building understanding through encouragement and real-world relevance.
        </philosophy>
      </system>
      `,
  })

  // 2. Create a chat session with the agent
  const session = mathTutor.createSession()

  // 3. Send a message and get response
  try {
    const response = await session.sendMessage({
      role: 'user',
      content: 'Can you help me understand quadratic equations?',
    })

    console.log('AI Response:', response.content)

    // 4. You can continue the conversation
    const followUpResponse = await session.sendMessage({
      role: 'user',
      content: 'Can you give me an example?',
    })

    console.log('AI Response:', followUpResponse.content)
  } catch (error) {
    console.error('Something went wrong:', error)
  }
}

// Run the example
main()
