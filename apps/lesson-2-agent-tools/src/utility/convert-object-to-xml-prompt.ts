type ObjectToXmlParams = {
  obj: Record<string, any>
  indent?: number
}

/**
 * Converts a JavaScript object into an XML-formatted prompt string.
 * Using objects to generate prompts provides several benefits:
 * - Type safety and validation through TypeScript interfaces
 * - Consistent structure and formatting
 * - Easier refactoring and maintenance
 * - Reusable prompt templates
 * - Programmatic prompt generation and manipulation
 *
 * @example
 * ```typescript
 * const prompt = convertObjectToXmlPrompt({
 *   obj: {
 *     system: {
 *       role: 'Assistant',
 *       style: { tone: 'friendly' }
 *     }
 *   }
 * });
 *
 * // Output:
 * // <system>
 * //   <role>Assistant</role>
 * //   <style>
 * //     <tone>friendly</tone>
 * //   </style>
 * // </system>
 * ```
 */

export const convertObjectToXmlPrompt = ({
  obj,
  indent = 0,
}: ObjectToXmlParams): string => {
  const spaces = ' '.repeat(indent)
  let xml = ''

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      xml += `${spaces}<${key}/>\n`
      continue
    }
    if (typeof value === 'object') {
      xml += `${spaces}<${key}>\n`
      xml += convertObjectToXmlPrompt({ obj: value, indent: indent + 2 })
      xml += `${spaces}</${key}>\n`
      continue
    }
    xml += `${spaces}<${key}>${value}</${key}>\n`
  }

  return xml
}
