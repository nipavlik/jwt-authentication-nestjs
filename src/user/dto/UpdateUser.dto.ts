import { IsNotEmpty } from 'class-validator'

export class UpdateUserDto {

  @IsNotEmpty()
  password: string
  
}