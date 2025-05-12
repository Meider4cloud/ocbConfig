export interface Versions {
  coreCollector: string | undefined | (() => string) | unknown
  contribCollector: string | undefined | (() => string) | unknown
  envProvider: string | undefined | null | (() => string) | unknown
  fileProvider: string | undefined | null | (() => string) | unknown
}

export interface BuilderConfig {
  // [category: string]: Array<{
  //   gomod?: string
  // [key: string]: any
  dist?: Dist
  receivers?: Array<{ gomod?: string }>
  processors?: Array<{ gomod?: string }>
  exporters?: Array<{ gomod?: string }>
  connectors?: Array<{ gomod?: string }>
  providers?: Array<{ gomod?: string }>
  extensions?: Array<{ gomod?: string }>
  replaces?: Array<{ gomod?: string }>
}

export interface ParsedData {
  [key: string]: string[] | undefined
  receivers: string[] | undefined
  processors: string[] | undefined //| Record<string | number | symbol, never>
  exporters: string[] | undefined
  connectors: string[] | undefined
  providers?: string[] | undefined
  extensions: string[] | undefined
}

export interface Dist {
  module?: string
  name?: string
  description?: string
  version?: string
  output_path?: string
}

// export interface ParsedData {
//   receivers: Record<string, any>
//   processors: Record<string, any>
//   exporters: Record<string, any>
//   connectors: Record<string, any>
//   providers: Record<string, any>
//   extensions: Record<string, any>
// }
