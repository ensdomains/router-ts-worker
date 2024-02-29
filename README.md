# router-ts-worker

A template for efficient routed Cloudflare Workers. Uses bun, itty-router, vitest, and TypeScript.

## Getting started

### Running the development worker

```bash
bun run dev
```

### Running the tests

```bash
bun run test
```

### Deploying the worker

```bash
bun run deploy
```

## Creating routes

The default structure allows routes to have API versioning (e.g. `/v1/{route}`). This can of course be changed, but to future-proof your worker, you should leave it as-is.

Here's a brief tutorial on adding a route. The tutorial assumes you're using API version 1, and a route called `info`.

### 1. Create the route file

Create a route file in `src/routes/v1`. For the example we'll use `info` as our route name, so `src/routes/v1/info.ts`.

In the route file, your route function should be laid out like so:

```ts
import type { RouteParameters } from '@/types.js'

export const info = (request: Request, { env, ctx }: RouteParameters) => {
  // Route code goes here...
}
```

### 2. Create the route test file

Create a route test file alongside your route file, and add all testing that is appropriate for the route.

### 3. Add the route to the API version routes

Add the route to `v1` in `src/routes/v1.ts`.

Our new version routes file will look like this:

```ts
import { example } from './v1/example.js'
import { info } from './v1/info.js'

export const v1 = {
  example,
  info,
}
```

### 4. Add the route to the index

Add the route under your V1 version routes in `src/index.ts`.

For all request types, you'll want to add an `OPTIONS` handler, for better CORS compatibility. The `OPTIONS` handler can just return an empty response with status `204`. Itty-router's CORS handling will add the additional headers.

For `GET` requests, you'll also want to add a `HEAD` handler. The `HEAD` handler can just be the same as your main `GET` handler, as the response body will automatically be stripped.

The `// V1 Routes` section of the index file will now look like this:

```ts
// V1 Routes
router.get('/v1/example', v1.example)
router.head('/v1/example', v1.example)
router.options('/v1/example', () => new Response(null, { status: 204 }))
router.get('/v1/info', v1.info)
router.head('/v1/info', v1.info)
router.options('/v1/info', () => new Response(null, { status: 204 }))
```