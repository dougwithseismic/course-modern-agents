import { describe, it, expect } from 'vitest'
import { convertObjectToXmlPrompt } from '../convert-object-to-xml-prompt'

describe('convertObjectToXmlPrompt', () => {
  it('should convert simple object to XML format', () => {
    const input = {
      system: {
        role: 'Assistant',
      },
    }

    const expected = '<system>\n  <role>Assistant</role>\n</system>\n'
    expect(convertObjectToXmlPrompt({ obj: input })).toBe(expected)
  })

  it('should handle nested objects', () => {
    const input = {
      system: {
        role: 'Assistant',
        style: {
          tone: 'friendly',
        },
      },
    }

    const expected =
      '<system>\n  <role>Assistant</role>\n  <style>\n    <tone>friendly</tone>\n  </style>\n</system>\n'
    expect(convertObjectToXmlPrompt({ obj: input })).toBe(expected)
  })

  it('should handle arrays', () => {
    const input = {
      system: {
        characteristics: ['friendly', 'helpful'],
      },
    }

    const expected =
      '<system>\n  <characteristics>\n    <0>friendly</0>\n    <1>helpful</1>\n  </characteristics>\n</system>\n'
    expect(convertObjectToXmlPrompt({ obj: input })).toBe(expected)
  })

  it('should handle null and undefined values', () => {
    const input = {
      system: {
        role: 'Assistant',
        optional: null,
        another: undefined,
      },
    }

    const expected =
      '<system>\n  <role>Assistant</role>\n  <optional/>\n  <another/>\n</system>\n'
    expect(convertObjectToXmlPrompt({ obj: input })).toBe(expected)
  })
})
