//import { readTextFileSync, writeTextFileSync } from "https://deno.land/std@0.200.0/fs/mod.ts";
import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from 'https://deno.land/std@0.200.0/yaml/mod.ts'
import { BuilderConfig, ParsedData } from './interfaces.ts'
import { logger } from './logger.ts'

/**
 * Filters the contrib-builder-config.yaml file based on the parsed YAML information.
 * Only the components that match the parsed data should remain.
 */
export function filterBuilderConfig(
  parsedData: ParsedData,
  inputPath: string,
  outputPath: string
) {
  logger.debug('Parsed Data:', parsedData)

  try {
    const fileContent = Deno.readTextFileSync(inputPath) // Read the YAML file content
    const builderConfig: BuilderConfig = parseYaml(fileContent) as BuilderConfig // Parse the YAML content
    logger.debug(`builder-config.yaml content:`, builderConfig)

    if (!builderConfig || typeof builderConfig !== 'object') {
      throw new Error('Invalid contrib-builder-config.yaml content')
    }

    Object.keys(builderConfig).forEach((category) => {
      // Skip filtering for 'dist' and 'providers' categories
      if (category === 'dist' || category === 'providers') {
        return
      }

      // Check if parsedData for the current category exists and is non-empty
      if (Array.isArray(parsedData[category])) {
        // Filter the builderConfig for the current category based on parsedData
        builderConfig[category] = builderConfig[category].filter((item) => {
          return parsedData[category]?.some((parsedItem) => {
            logger.debug(`Category: ${category}: Parsed Item: ${parsedItem}`)
            // // Special case: Allow 'health_check' in parsedData to match 'healthcheck' in builderConfig
            // if (
            //   parsedItem === 'health_check' &&
            //   item.gomod?.includes('healthcheck')
            // ) {
            //   return true
            // }
            // General case: Check if the parsed item is included in the gomod field
            return item.gomod?.includes(parsedItem)
          })
        })
      } else {
        // If no parsed data exists for the category, delete the category from builderConfig
        logger.debug(`No parsed data for ${category}, deleting category.`)
        delete builderConfig[category]
      }
    })

    logger.debug(`Filtered builder-config.yaml content:`, builderConfig)
    const yamlContent = stringifyYaml(builderConfig) // Convert the filtered config back to YAML
    Deno.writeTextFileSync(outputPath, yamlContent) // Write the filtered YAML content to the output file
    logger.info(`Filtered builder-config.yaml has been saved to ${outputPath}`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error copying YAML from URL: ${error.message}`)
    } else {
      logger.error('An unknown error occurred while copying YAML from URL.')
    }
  }

  return
}
