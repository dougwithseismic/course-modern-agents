import { zodFunction } from 'openai/helpers/zod'
import { z } from 'zod'

/**
 * Parameters required to create a tool that can be used by the OpenAI API.
 */
export interface CreateToolParams {
  /** The name of the tool */
  name: string
  /** A description of what the tool does */
  description: string
  /** A Zod schema defining the parameters the tool accepts */
  parameters: z.ZodObject<any>
  /** The function that executes the tool's logic
   * @param params - The parameters passed to the tool, typed according to the Zod schema
   * @returns A promise that resolves to the tool's result
   */
  execute: (params: z.infer<z.ZodObject<any>>) => Promise<unknown>
}

/** Type representing a tool created by zodFunction */
export type Tool = ReturnType<typeof zodFunction>

/**
 * Creates a tool that can be used by the OpenAI API.
 * Uses the zodFunction helper from the OpenAI SDK to automatically parse function arguments
 * and provide type safety.
 *
 * @see {@link https://github.com/openai/openai-node/blob/master/helpers.md#auto-parsing-function-tool-calls}
 *
 * @param params - The parameters to create the tool
 * @returns A Tool that can be used with the OpenAI API
 *
 * @example
 * ```typescript
 * const calculateMath = createTool({
 *   name: 'calculateMath',
 *   description: 'Performs basic math calculations',
 *   parameters: z.object({
 *     operation: z.enum(['add', 'subtract']),
 *     firstNumber: z.number(),
 *     secondNumber: z.number()
 *   }),
 *   execute: async ({ operation, firstNumber, secondNumber }) => {
 *     if (operation === 'add') return firstNumber + secondNumber
 *     return firstNumber - secondNumber
 *   }
 * })
 * ```
 */
export const createTool = ({
  name,
  description,
  parameters,
  execute,
}: CreateToolParams): Tool => {
  return zodFunction({
    name,
    description,
    parameters,
    function: async (params) => execute(params),
  }) as Tool
}
