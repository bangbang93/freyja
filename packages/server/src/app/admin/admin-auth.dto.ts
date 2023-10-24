import {IsNotEmpty, IsString} from 'class-validator'

export class AdminAuthDto {
  @IsString()
  @IsNotEmpty()
    username!: string

  @IsString()
  @IsNotEmpty()
    password!: string
}
