import { expect, test } from 'vitest'
import { example } from './example.js'

test('works', async () => {
  const request = new Request('http://localhost/v1/example')
  const response = example(request, { env: {}, ctx: {} as ExecutionContext })
  expect(response.status).toBe(200)
  expect(response.headers.get('Content-Type')).toMatchInlineSnapshot(`"text/plain; charset=utf-8"`)
  expect(await response.text()).toBe('Hello, world!')
})
