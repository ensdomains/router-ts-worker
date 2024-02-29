import { text } from 'itty-router/text'

import type { RouteParameters } from '@/types.js'

export const example = (_request: Request, { env: _env, ctx: _ctx }: RouteParameters) => {
  return text('Hello, world!')
}
