import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {AttachmentAdminController} from './attachment-admin.controller'
import {Attachment} from './attachment.model'
import {AttachmentService} from './attachment.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Attachment),
    ]),
  ],
  controllers: [
    AttachmentAdminController,
  ],
  providers: [
    AttachmentService,
  ],
})
export class AttachmentModule {}
