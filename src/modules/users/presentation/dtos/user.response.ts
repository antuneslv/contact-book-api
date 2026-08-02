import { ApiProperty } from '@nestjs/swagger'

export class UserResponse {
  @ApiProperty({
    description: "The user's ID (UUID format).",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: "The user's name.",
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: "The user's email.",
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'The date and time the user was created.',
    example: '2026-07-28T00:00:00.000Z',
  })
  createdAt: Date
}
