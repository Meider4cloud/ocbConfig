import * as log from 'https://deno.land/std@0.200.0/log/mod.ts'

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('DEBUG', {
      formatter: (record) => {
        return `[${record.levelName}] ${record.msg}`
      },
    }),
  },
  loggers: {
    default: {
      level: 'INFO',
      handlers: ['console'],
    },
  },
})

export const logger = log.getLogger()
