import { ApiProperty } from '@nestjs/swagger'

export class ContactResponse {
  @ApiProperty({
    description: "The contact's ID (UUID format).",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: "The contact's name.",
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: "The contact's phone number.",
    example: '(123) 456-7890',
  })
  phone: string

  @ApiProperty({
    description: "The contact's email.",
    example: 'john.doe@example.com',
  })
  email?: string

  @ApiProperty({
    description: "The contact's birthday (YYYY-MM-DD format).",
    example: '1990-01-20',
  })
  birthday?: string

  @ApiProperty({
    description: "The contact's category.",
    example: 'FAMILY',
    enum: ['FAMILY', 'FRIENDS', 'WORK', 'SCHOOL'],
  })
  category?: string

  @ApiProperty({
    description: "The contact's observations.",
    example: 'John is a great guy!',
  })
  observations?: string

  @ApiProperty({
    description: 'The date and time the contact was created.',
    example: '2026-07-28T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The date and time the contact was updated.',
    example: '2026-07-28T00:00:00.000Z',
  })
  updatedAt: Date
}
