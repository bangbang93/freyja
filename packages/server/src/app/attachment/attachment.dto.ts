import {ObjectId} from 'mongoose-typescript'

export class AttachmentCreateResDto {
  id!: ObjectId
  filename!: string
  path!: string
}
