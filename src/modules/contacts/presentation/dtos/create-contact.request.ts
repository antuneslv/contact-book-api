import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator'

import { Trim } from '@/decorators/trim.decorator'

import {
  CONTACT_CATEGORIES,
  type ContactCategory,
} from '../../domain/contacts.repository'

export class CreateContactRequest {
  @ApiProperty({
    description: "The contact's name.",
    example: 'John Doe',
    maxLength: 100,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({
    description:
      "The contact's phone number, stored exactly as provided. No format is enforced, so national or international notation are both accepted.",
    example: '+1 555 000 0000',
    maxLength: 30,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string

  @ApiPropertyOptional({
    description: "The contact's e-mail. Send null to leave it empty.",
    example: 'john.doe@example.com',
    nullable: true,
  })
  @IsOptional()
  @Trim()
  @IsEmail()
  email?: string | null

  @ApiPropertyOptional({
    description:
      "The contact's birthday, as a calendar date with no time zone. Send null to leave it empty.",
    example: '1990-01-20',
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthday must be a calendar date in YYYY-MM-DD format',
  })
  @IsDateString({ strict: true })
  birthday?: string | null

  @ApiPropertyOptional({
    description: "The contact's category. Send null to leave it empty.",
    example: 'FAMILY',
    enum: CONTACT_CATEGORIES,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(CONTACT_CATEGORIES)
  category?: ContactCategory | null

  @ApiPropertyOptional({
    description: "The contact's observations. Send null to leave it empty.",
    example: 'John is a great guy!',
    maxLength: 255,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  observations?: string | null
}
