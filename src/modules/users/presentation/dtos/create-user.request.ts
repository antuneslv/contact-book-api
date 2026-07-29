import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserRequest {
  @ApiProperty({
    description: "The user's name",
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: "The user's email",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: "The user's password, minimum 6 characters",
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
