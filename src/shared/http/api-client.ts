import { env } from '@/config/env'

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function isSerializableBody(body: ApiRequestOptions['body']): body is Record<string, unknown> {
  return Boolean(body) && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const body = isSerializableBody(options.body) ? JSON.stringify(options.body) : options.body

  if (isSerializableBody(options.body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${env.apiUrl}/${path.replace(/^\//, '')}`, {
    ...options,
    body,
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    throw new ApiError('Não foi possível concluir a solicitação.', response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
