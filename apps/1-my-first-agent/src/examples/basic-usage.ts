import { Agent } from '../module/agent'

// Example of creating and using an AI agent
const main = async () => {
  // 1. Create an agent with a specific personality
  const mathTutor = new Agent({
    name: 'Math Tutor',
    description:
      'A friendly math tutor that helps students understand mathematics',
    systemPrompt:
      'You are a patient and encouraging math tutor. Always break down problems into simple steps. Use examples when explaining concepts.',
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
