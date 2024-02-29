import { Router, type IRequestStrict } from 'itty-router/Router'
import { createCors } from 'itty-router/createCors'
import { error } from 'itty-router/error'

import type { RouteParameters } from '@/types.js'

import { v1 } from '@routes/v1.js'
import { stripBodyForHeadRequest } from './utils/stripBodyForHeadRequest.js'

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['GET', 'HEAD', 'OPTIONS'],
})

const router = Router<IRequestStrict, [RouteParameters]>()

// Preflight
router.all('*', preflight)

// V1 Routes
router.get('/v1/example', v1.example)
router.head('/v1/example', v1.example)
router.options('/v1/example', () => new Response(null, { status: 204 }))

// 404 Fallback
router.all('*', () => error(404, 'Not Found'))

export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext) =>
    router
      .handle(request, { env, ctx })
      .then(stripBodyForHeadRequest(request))
      .catch((e) => {
        console.error('Caught error')
        console.error(e)
        return error(500, 'Internal Server Error')
      })
      .then(corsify),
}
