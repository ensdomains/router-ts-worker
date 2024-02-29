import { expect, test, vi } from 'vitest'

import index from './index.js'

import { v1 } from '@routes/v1.js'

vi.mock('@routes/v1.js', () => ({
  v1: {
    example: vi.fn(() => new Response('Hello, World!')),
  },
}))

test('adds cors headers', async () => {
  const response = await index.fetch(
    new Request('http://localhost/', {
      headers: {
        origin: 'http://localhost',
      },
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost')
  expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, HEAD, OPTIONS')
})

test('v1 example handler for v1 example request', async () => {
  const response = await index.fetch(
    new Request('http://localhost/v1/example', {
      method: 'GET',
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(v1.example).toHaveBeenCalled()
  expect(await response.text()).toBe('Hello, World!')
})

test('head handler for head request', async () => {
  vi.mocked(v1.example).mockImplementation(() => {
    const response = new Response('Hello, World!')
    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Custom-Header', 'HeaderValue')
    return response
  })

  const response = await index.fetch(
    new Request('http://localhost/v1/example', {
      method: 'HEAD',
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(v1.example).toHaveBeenCalled()
  expect(response.status).toBe(200)
  expect(response.body).toBe(null)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(response.headers.get('Custom-Header')).toBe('HeaderValue')
})

test('options returned on options request', async () => {
  const response = await index.fetch(
    new Request('http://localhost/v1/example', {
      method: 'OPTIONS',
      headers: {
        origin: 'http://localhost',
      },
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(response.status).toBe(200)
  expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost')
  expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, HEAD, OPTIONS')
})

test('not found for unsupported method', async () => {
  const response = await index.fetch(
    new Request('http://localhost/v1/example', {
      method: 'POST',
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(response.status).toBe(404)
  expect(await response.json()).toMatchInlineSnapshot(`
    {
      "error": "Not Found",
      "status": 404,
    }
  `)
})

test('not found for unsupported path', async () => {
  const response = await index.fetch(
    new Request('http://localhost/', {
      method: 'GET',
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(response.status).toBe(404)
  expect(await response.json()).toMatchInlineSnapshot(`
    {
      "error": "Not Found",
      "status": 404,
    }
  `)
})

test('500 error+cors for internal error', async () => {
  vi.mocked(v1.example).mockImplementation(() => {
    throw new Error('test')
  })
  const response = await index.fetch(
    new Request('http://localhost/v1/example', {
      method: 'GET',
      headers: {
        origin: 'http://localhost',
      },
    }),
    {} as Env,
    {} as ExecutionContext,
  )
  expect(response.status).toBe(500)
  expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost')
  expect(await response.json()).toMatchInlineSnapshot(`
    {
      "error": "Internal Server Error",
      "status": 500,
    }
  `)
})
