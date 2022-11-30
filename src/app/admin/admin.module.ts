import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {AdminAuthService} from './admin-auth.service'
import {AdminController} from './admin.controller'
import {AdminGuard} from './admin.guard'
import {Admin} from './admin.model'
import {AdminService} from './admin.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Admin),
    ]),
  ],
  controllers: [
    AdminController,
  ],
  providers: [
    AdminGuard,
    AdminService,
    AdminAuthService,
  ],
  exports: [
    AdminGuard,
    AdminService,
  ],
})
export class AdminModule {}
