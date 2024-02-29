export const stripBodyForHeadRequest = (request: Request) => (response: Response) =>
  request.method === 'HEAD' ? new Response(null, response) : response
