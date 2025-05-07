export interface Versions {
  coreCollector: string | undefined | (() => string) | unknown
  contribCollector: string | undefined | (() => string) | unknown
  envProvider: string | undefined | null | (() => string) | unknown
  fileProvider: string | undefined | null | (() => string) | unknown
}

export interface BuilderConfig {
  [category: string]: Array<{
    gomod?: string
    [key: string]: any
  }>
}

export interface ParsedData {
  [key: string]: string[] | undefined
  receivers: string[] | undefined
  processors: string[] | undefined //| Record<string | number | symbol, never>
  exporters: string[] | undefined
  connectors: string[] | undefined
  providers: string[] | undefined
  extensions: string[] | undefined
}
