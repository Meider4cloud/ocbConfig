import { logger } from './logger.ts'

/**
 * Fetches the YAML content from the given URL and saves it to a local file.
 * @param url - The URL of the YAML file to fetch.
 * @param outputPath - The local file path to save the YAML content.
 */
export async function getContribBuilderConfig(
  url: string,
  outputPath: string
): Promise<void> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch YAML from ${url}: ${response.statusText}`
      )
    }

    const yamlContent = await response.text()
    await Deno.writeTextFile(outputPath, yamlContent) // Use Deno's writeTextFile API

    logger.info(`YAML content successfully saved to ${outputPath}`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error copying YAML from URL: ${error.message}`)
    } else {
      logger.error('An unknown error occurred while copying YAML from URL.')
    }
  }
}
