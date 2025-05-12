import { ParsedData } from '../interfaces.ts'
import { parseConfigFile } from '../parseConfigFile.ts'
import { assertEquals } from '@std/assert'

Deno.test('parseConfigFile should parse a valid YAML file', () => {
  const filePath = './tests/test-data/valid-config.yaml' // Replace with a test YAML file path
  const expected: ParsedData = {
    extensions: ['healthcheckextension'],
    receivers: ['otlp'],
    processors: ['transform', 'batch', 'tail_sampling', 'filter'],
    connectors: ['routing', 'spanmetrics'],
    exporters: ['debug'],
    //providers: [],
  }
  const result = parseConfigFile(filePath)
  assertEquals(result, expected)
})
