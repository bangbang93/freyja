import {IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString} from 'class-validator'

export class ArticleCreateBody {
  @IsString() @IsNotEmpty() title!: string

  @IsString() @IsNotEmpty() content!: string

  @IsString({each: true})
  @IsArray()
  @IsOptional()
  @IsNotEmpty({each: true})
    tags!: string[]

  @IsMongoId({each: true}) @IsArray() categories!: string[]

  @IsString() slug!: string
}
