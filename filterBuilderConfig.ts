//import { readTextFileSync, writeTextFileSync } from "https://deno.land/std@0.200.0/fs/mod.ts";
import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from 'https://deno.land/std@0.200.0/yaml/mod.ts'
import { BuilderConfig, Dist, ParsedData } from './interfaces.ts'
import { logger } from './logger.ts'

const modifyDist = (dist: Dist) => {
  dist = {
    module: Deno.env.get('DIST_MODULE') || dist.module,
    name: Deno.env.get('DIST_NAME') || dist.name,
    description: Deno.env.get('DIST_DESCRIPTION') || dist.description,
    version: Deno.env.get('DIST_VERSION') || dist.version,
    output_path: Deno.env.get('DIST_OUTPUT_PATH') || dist.output_path,
  }
  logger.debug(dist)
  return dist
}

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

    Object.keys(builderConfig).forEach((type) => {
      const category = type as keyof BuilderConfig
      // Skip filtering for 'dist' and 'providers' categories
      if (category === 'dist' || category === 'providers') {
        return
      }

      // Check if parsedData for the current category exists and is non-empty
      if (Array.isArray(parsedData[category])) {
        // Filter the builderConfig for the current category based on parsedData
        builderConfig[category] = builderConfig[category]?.filter((item) => {
          return parsedData[category]?.some((parsedItem) => {
            logger.debug(`Category: ${category}: Parsed Item: ${parsedItem}`)
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

    const dist = modifyDist(builderConfig.dist as Dist) // Modify the 'dist' section if needed
    builderConfig.dist = dist // Update the 'dist' section in the builderConfig

    const yamlContent = stringifyYaml(builderConfig as Record<string, unknown>) // Convert the filtered config back to YAML
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
