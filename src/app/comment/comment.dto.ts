import {IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested} from 'class-validator'

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
  @ValidateNested() publisher!: CommentCreateBodyPublisher
  @IsMongoId() @IsOptional() reply?: string
}
