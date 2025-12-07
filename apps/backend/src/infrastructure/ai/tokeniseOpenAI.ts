import { Tiktoken } from 'js-tiktoken/lite'
import o200k_base from 'js-tiktoken/ranks/o200k_base'
import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Singleton class for tokenizing content using OpenAI's o200k_base tokenizer.
 *
 * @example
 * ```typescript
 * const tokenizer = TokeniseOpenAI.getInstance()
 * const tokens = tokenizer.tokeniseFile('prompt.txt')
 * console.log(`Token count: ${tokens.length}`)
 * ```
 */
class TokeniseOpenAI {
  private static instance: TokeniseOpenAI
  private tokenizer: Tiktoken

  private constructor() {
    this.tokenizer = new Tiktoken(o200k_base)
  }

  /**
   * Gets the singleton instance of TokeniseOpenAI.
   *
   * @returns The singleton instance
   */
  public static getInstance(): TokeniseOpenAI {
    if (!TokeniseOpenAI.instance) {
      TokeniseOpenAI.instance = new TokeniseOpenAI()
    }
    return TokeniseOpenAI.instance
  }

  /**
   * Tokenizes the content of a file using OpenAI's o200k_base tokenizer.
   *
   * @param file - The filename (relative to the current module directory)
   * @returns An array of token IDs
   * @throws {Error} If the file cannot be read or tokenization fails
   */
  public tokeniseFile(file: string): number[] {
    if (file.includes('..') || file.includes('/') || file.includes('\\')) {
      throw new Error('Invalid file path')
    }

    try {
      const filePath = path.join(import.meta.dirname, file)
      const input = readFileSync(filePath, 'utf-8')
      return this.tokenizer.encode(input)
    } catch (error) {
      throw new Error(
        `Failed to tokenize file "${file}": ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

export { TokeniseOpenAI }
