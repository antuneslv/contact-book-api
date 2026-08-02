import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  CONTACT_CATEGORIES,
  type ContactCategory,
} from '../../domain/contacts.repository'

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
    description: "The contact's phone number, exactly as it was provided.",
    example: '+1 555 000 0000',
  })
  phone: string

  @ApiPropertyOptional({
    description: "The contact's e-mail. Omitted when empty.",
    example: 'john.doe@example.com',
  })
  email?: string

  @ApiPropertyOptional({
    description:
      "The contact's birthday, as a calendar date with no time zone. Omitted when empty.",
    example: '1990-01-20',
    format: 'date',
  })
  birthday?: string

  @ApiPropertyOptional({
    description: "The contact's category. Omitted when empty.",
    example: 'FAMILY',
    enum: CONTACT_CATEGORIES,
  })
  category?: ContactCategory

  @ApiPropertyOptional({
    description: "The contact's observations. Omitted when empty.",
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
