import {IsEmail, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested} from 'class-validator'
import {ObjectId} from 'mongoose-typescript'

class CommentCreateBodyPublisher {
  @IsString()
  @IsNotEmpty()
    name!: string

  @IsEmail()
  @IsNotEmpty()
    email!: string
}
export class CommentCreateBodyDto {
  @IsString() @IsNotEmpty() content!: string
  @IsObject() @ValidateNested() publisher!: CommentCreateBodyPublisher
  @IsMongoId() @IsOptional() reply?: string
}

export class CommentTreePublisher {
  name?: string
  website?: string
  hash?: string
}
export class CommentTreeDto {
  _id!: ObjectId
  content!: string
  html!: string
  article!: ObjectId
  reply!: ObjectId
  replies!: CommentTreeDto[]
  publisher!: CommentTreePublisher
}
