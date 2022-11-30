import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {AdminController} from './admin.controller'
import {AdminGuard} from './admin.guard'
import {Admin} from './admin.model'

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
  ],
  exports: [
    AdminGuard,
  ],
})
export class AdminModule {}
