import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { type Category } from '../../domain/contacts.repository'

export class CreateContactRequest {
  @ApiProperty({
    description: "The contact's name.",
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: "The contact's phone number.",
    example: '(123) 456-7890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({
    description: "The contact's email.",
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string

  @ApiProperty({
    description: "The contact's birthday (YYYY-MM-DD format).",
    example: '1990-01-20',
  })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  birthday?: string

  @ApiProperty({
    description: "The contact's category.",
    example: 'FAMILY',
    enum: ['FAMILY', 'FRIENDS', 'WORK', 'SCHOOL'],
  })
  @IsOptional()
  @IsEnum(['FAMILY', 'FRIENDS', 'WORK', 'SCHOOL'])
  @IsNotEmpty()
  category?: Category

  @ApiProperty({
    description: "The contact's observations.",
    example: 'John is a great guy!',
  })
  @IsOptional()
  @MaxLength(255, {
    message: 'Observations must be at most 255 characters long',
  })
  observations?: string
}
