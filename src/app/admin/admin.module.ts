import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {AdminController} from './admin.controller'
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
})
export class AdminModule {}
