import { parse } from 'https://deno.land/std@0.200.0/yaml/mod.ts'
import { ParsedData } from './interfaces.ts'
import { logger } from './logger.ts'

/**
 * Parses a YAML file and returns the parsed data.
 * @param {string} filePath - The path to the YAML file.
 * @returns {ParsedData} - The parsed data from the YAML file.
 */

const allowedKeys: (keyof ParsedData)[] = [
  'receivers',
  'processors',
  'exporters',
  'connectors',
  'extensions',
]

const readFile = (filePath: string) => {
  try {
    const fileContent = Deno.readTextFileSync(filePath)
    const parsedData = parse(fileContent) //as ParsedData

    logger.debug(`Parsed YAML data: ${JSON.stringify(parsedData)}`)

    return parsedData as object
  } catch (error) {
    logger.error(`Error parsing YAML file: ${error}`)
    throw error
  }
}

const filterGroups = (parsedData: object) => {
  // const allowedKeys: (keyof ParsedData)[] = [
  //   'receivers',
  //   'processors',
  //   'exporters',
  //   'connectors',
  //   'extensions',
  // ]

  return Object.keys(parsedData)
    .filter((key) => allowedKeys.includes(key as keyof ParsedData))
    .reduce((acc, key) => {
      acc[key] = (parsedData as ParsedData)[key as keyof ParsedData]
      return acc
    }, {} as Partial<ParsedData>)
}

const keepKeys = (filteredData: Partial<ParsedData>) => {
  const extractOwnKeys = <T extends object>(obj: T): (keyof T)[] => {
    const keys: (keyof T)[] = []
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.includes('/')) {
          key = key.split('/')[0] as Extract<keyof T, string>
        }
        if (key === 'health_check')
          key = 'healthcheckextension' as Extract<keyof T, string>
        keys.push(key)
      }
    }
    return keys
  }

  for (const group of allowedKeys) {
    const keys = filteredData[group] ? extractOwnKeys(filteredData[group]) : []
    logger.debug(`Keys for ${group}: ${keys}`)
    filteredData[group] = keys as any // if needed, cast depending on filteredData type
  }

  return filteredData
}

export const parseConfigFile = (filePath: string): ParsedData => {
  const parsedData: object = readFile(filePath)

  let filteredData: Partial<ParsedData> = filterGroups(parsedData)

  filteredData = keepKeys(filteredData)

  return filteredData as ParsedData
}
