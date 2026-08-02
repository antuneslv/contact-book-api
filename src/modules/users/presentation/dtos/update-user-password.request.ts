import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateUserPasswordRequest {
  @ApiProperty({
    description: "The user's current password.",
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string

  @ApiProperty({
    description: "The user's new password, between 6 and 72 characters.",
    example: 'SecurePassword1234',
    minLength: 6,
    maxLength: 72,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(72)
  newPassword: string
}
