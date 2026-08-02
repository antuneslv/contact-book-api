import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

import { Trim } from '@/decorators/trim.decorator'

export class CreateUserRequest {
  @ApiProperty({
    description: "The user's name.",
    example: 'John Doe',
    maxLength: 100,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({
    description: "The user's email.",
    example: 'john.doe@example.com',
  })
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: "The user's password, between 6 and 72 characters.",
    example: 'SecurePassword123',
    minLength: 6,
    maxLength: 72,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(72)
  password: string
}
