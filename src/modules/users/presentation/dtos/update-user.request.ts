import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator'

import { IsOptionalButNotNull } from '@/decorators/is-optional-but-not-null.decorator'
import { Trim } from '@/decorators/trim.decorator'

export class UpdateUserRequest {
  @ApiProperty({
    description: "The user's name.",
    example: 'John Doe',
    required: false,
    maxLength: 100,
  })
  @IsOptionalButNotNull()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiProperty({
    description: "The user's email.",
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptionalButNotNull()
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email?: string
}
