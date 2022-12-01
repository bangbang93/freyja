import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {TagAdminController} from './tag-admin.controller'
import {Tag} from './tag.model'
import {TagService} from './tag.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Tag),
    ]),
  ],
  controllers: [
    TagAdminController,
  ],
  providers: [
    TagService,
  ],
})
export class TagModule {}
