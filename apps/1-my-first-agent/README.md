# My First Agent - README

## Overview

This project serves as a foundational introduction to building an AI agent using Node.js, TypeScript, and OpenAI's API. The application demonstrates how to set up a basic Express server, define an AI agent class, create sessions for chat interactions, and use a simple route for interaction with the agent.

### Directory Structure (Simplified)

```bash
apps/
  1-my-first-agent/
    src/
      app.ts              # Main application entry point (Express server setup and routes)
      config/
        app-config.ts     # Configuration settings (API keys, environment settings)
        logger.ts         # Logging setup for debugging and tracking
      module/
        agent/
          index.ts        # Core logic for the AI agent (Agent class)
          session.ts      # Handles chat sessions (conversation history)
          types.ts        # Type definitions used by the agent
      routes/
        health.ts         # Defines a simple health check endpoint
      middleware/
        request-logger.ts # Middleware for logging incoming HTTP requests
```

### Project Features

- **Express Server Setup**: Handles incoming HTTP requests with structured middleware such as Helmet for security, CORS for cross-origin access, and request logging.
- **AI Agent Class (`Agent`)**: Represents an agent with a specific personality and role. Capable of managing chat sessions while maintaining an identity via attributes like name, description, and system prompts.
- **Session Management (`Session`)**: Each session keeps track of the message history between the agent and the user, ensuring context is preserved across multiple interactions.
- **OpenAI Integration**: Uses the OpenAI API to generate responses from the agent based on user input.

## Installation and Setup (Step-by-Step)

1. **Clone the Repository**:
   First, clone the repository to your local machine to get access to the code.

   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```

2. **Install Dependencies**:
   Install the required Node.js dependencies by running the following command in your terminal:

   ```bash
   npm install
   ```

3. **Create a `.env` File**:
   Create a `.env` file in the root directory to configure necessary environment variables. Here are the key variables:
   - **`OPENAI_API_KEY`**: Your OpenAI API key for communicating with GPT.
   - **`PORT`**: The port for running the server (default is `666`).

   Example `.env` file:

   ```bash
   OPENAI_API_KEY=your-openai-api-key
   PORT=666
   ```

4. **Start the Server**:
   Start the Express server with the following command:

   ```bash
   npm run start
   ```

   Once started, the server will be running on the specified port (e.g., `http://localhost:666`).

## API Endpoints

- **`GET /health`**: Checks if the server is running and returns a status.
- **`POST /agent/send-message`**: Interacts with the agent by sending a message and receiving a response.
  - **Body Parameters**:
    - `message` (string, required): The message you want to send to the agent.
  - **Response**:
    - JSON object containing the agent's response.

### Example Request

To test the `/agent/send-message` endpoint, you can use a tool like `curl` or Postman. Here's an example using `curl`:

```bash
curl -X POST http://localhost:666/agent/send-message -H "Content-Type: application/json" -d '{"message": "Hello, Agent!"}'
```

## Example Usage

The `examples/basic-usage.ts` script demonstrates how to create and use an AI agent:

1. Instantiate an agent (`Math Tutor`).
2. Create a chat session.
3. Send messages and receive responses.
4. Continue the conversation based on previous exchanges.

## Key Concepts

1. **Agent Class**: Represents an AI with distinct characteristics like a name, a description, and behavior instructions (`systemPrompt`).
2. **Session Management**: Allows multiple ongoing conversations with the agent while maintaining independent histories.
3. **Error Handling**: The Express app has a global error handler that logs errors using Winston, ensuring all unhandled errors are caught and logged.
4. **Logging**: Winston is used for consistent application logging, both to the console and to log files for debugging purposes.

## Extending the Agent

The current `Agent` class is designed to be extended easily. You can create specialized agents by modifying or adding new system prompts and personality descriptions.

For example, creating a `WeatherBot` agent could look like this:

```typescript
const weatherBot = new Agent({
  name: 'WeatherBot',
  description: 'Provides weather information.',
  systemPrompt: 'You are a helpful assistant who knows all about the weather.',
});
```

## Running Tests

Tests are implemented with `Vitest` to ensure code reliability.

- Run all tests:

  ```bash
  npm run test
  ```

- Tests can be found in:
  - **`src/module/agent/__tests__/agent.test.ts`**: Tests the functionality of the `Agent` class.
  - **`src/module/agent/__tests__/session.test.ts`**: Tests the `Session` class, including OpenAI interactions.

## Contributions

Feel free to open issues or submit pull requests for improvements, additional features, or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

For questions or help, feel free to reach out.

---

Thank you for exploring your first AI agent! Enjoy building and extending it further.
