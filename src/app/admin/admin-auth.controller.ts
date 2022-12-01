import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common'
import {Request} from 'express'
import {AdminAuthDto} from './admin-auth.dto'
import {AdminAuthService} from './admin-auth.service'
import {AdminGuard} from './admin.guard'
import {IAdminSchema} from './admin.model'

@Controller('api/admin/user')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: AdminAuthDto, @Req() req: Request): Promise<Partial<IAdminSchema>> {
    const admin = await this.adminAuthService.login(body.username, body.password)
    req.session.user = admin
    return admin
  }

  @Get('login')
  @UseGuards(AdminGuard)
  public async checkLogin(@Req() req: Request): Promise<Partial<IAdminSchema> | undefined> {
    return req.session.user
  }
}
