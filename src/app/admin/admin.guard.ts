import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {Request} from 'express'

@Injectable()
export class AdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    return !!req.session?.user
  }
}
