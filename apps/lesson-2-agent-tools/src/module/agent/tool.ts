import { zodFunction } from 'openai/helpers/zod'
import { z } from 'zod'

export interface CreateToolParams {
  name: string
  description: string
  parameters: z.ZodObject<any>
  execute: (params: z.infer<z.ZodObject<any>>) => Promise<unknown>
}

export type Tool = ReturnType<typeof zodFunction>

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
