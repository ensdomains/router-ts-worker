import { expect, test } from 'vitest'
import { stripBodyForHeadRequest } from './stripBodyForHeadRequest.js'

test('strips body for head request', async () => {
  const request = new Request('http://localhost/v1/example', {
    method: 'HEAD',
  })
  const response = new Response('Hello, World!', {
    headers: {
      'Content-Type': 'text/plain',
      'Header-Value': 'HeaderValue',
    },
  })

  const strippedResponse = stripBodyForHeadRequest(request)(response)

  expect(strippedResponse.body).toBeNull()
  expect(strippedResponse.headers.get('Content-Type')).toBe('text/plain')
  expect(strippedResponse.headers.get('Header-Value')).toBe('HeaderValue')
})

test('does not strip body for non-head request', async () => {
  const request = new Request('http://localhost/v1/example', {
    method: 'GET',
  })
  const response = new Response('Hello, World!', {
    headers: {
      'Content-Type': 'text/plain',
      'Header-Value': 'HeaderValue',
    },
  })

  const strippedResponse = stripBodyForHeadRequest(request)(response)

  expect(await strippedResponse.text()).toBe('Hello, World!')
  expect(strippedResponse.headers.get('Content-Type')).toBe('text/plain')
  expect(strippedResponse.headers.get('Header-Value')).toBe('HeaderValue')
})
