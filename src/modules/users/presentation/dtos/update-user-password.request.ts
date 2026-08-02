import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdateUserPasswordRequest {
  @ApiProperty({
    description: "The user's current password.",
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string

  @ApiProperty({
    description: "The user's password, minimum 6 characters.",
    example: 'SecurePassword1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string
}
