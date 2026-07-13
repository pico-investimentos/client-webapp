export type B3ConnectionStatus =
  | 'NOT_CONNECTED'
  | 'AUTHORIZATION_REQUESTED'
  | 'AUTHORIZED'
  | 'REVOKED'
  | 'ERROR'

export type StartB3AuthorizationResponse = {
  data: {
    attemptId: string
    connectionStatus: 'AUTHORIZATION_REQUESTED'
    authorizationUrl: string
  }
}

export class B3AuthorizationStartError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
  ) {
    super(message)
    this.name = 'B3AuthorizationStartError'
  }
}
