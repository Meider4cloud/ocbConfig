import { parseConfigFile } from './parseConfigFile.ts'
import { filterBuilderConfig } from './filterBuilderConfig.ts'
import { getContribBuilderConfig } from './getContribBuilderConfig.ts'

import { logger } from './logger.ts'

// Replace with your YAML file path
const inputCollectorConfigFile = './config/config.yaml'
const inputCollectorBuilderConfigFile = './config/contrib-builder-config.yaml'
const outputCollectorBuilderConfigFile = './config/builder-config.yaml'
const ContribCollectorBuilderConfigUrl =
  'https://raw.githubusercontent.com/open-telemetry/opentelemetry-collector-contrib/refs/heads/main/cmd/otelcontribcol/builder-config.yaml'

const parsedYaml = parseConfigFile(inputCollectorConfigFile)

logger.info(`Parsed YAML: ${JSON.stringify(parsedYaml)}`)

await getContribBuilderConfig(
  ContribCollectorBuilderConfigUrl,
  inputCollectorBuilderConfigFile
)

filterBuilderConfig(
  parsedYaml,
  inputCollectorBuilderConfigFile,
  outputCollectorBuilderConfigFile
)
