import {IsNotEmpty, IsString} from 'class-validator'

export class PageCreateBodyDto {
  @IsString() @IsNotEmpty() title!: string
  @IsString() @IsNotEmpty() content!: string
  @IsString() @IsNotEmpty() name!: string
}
