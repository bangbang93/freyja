export interface AdminJwtPayload {
  sub: string
  username: string
}

declare module 'express' {
  interface Request {
    user?: AdminJwtPayload
  }
}
