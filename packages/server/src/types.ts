import {IAdminSchema} from './app/admin/admin.model'


declare module 'express-session' {
  interface SessionData {
    user?: Partial<IAdminSchema>
  }
}
