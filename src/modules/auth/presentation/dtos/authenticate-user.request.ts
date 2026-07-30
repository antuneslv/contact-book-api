import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateUserRequest {
  @ApiProperty({
    description: "The user's email",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: "The user's password",
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
