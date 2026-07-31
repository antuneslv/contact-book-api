import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { IsOptionalButNotNull } from '@/decorators/is-optional-but-not-null.decorator'

export class UpdateUserRequest {
  @ApiProperty({
    description: "The user's name",
    example: 'John Doe',
    required: false,
  })
  @IsOptionalButNotNull()
  @IsString()
  @IsNotEmpty()
  name?: string

  @ApiProperty({
    description: "The user's email",
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptionalButNotNull()
  @IsEmail()
  @IsNotEmpty()
  email?: string
}
