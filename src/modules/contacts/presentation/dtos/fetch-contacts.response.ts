import { ApiProperty } from '@nestjs/swagger'

import { ContactResponse } from './contact.response'

export class FetchContactsResponse {
  @ApiProperty({
    description: "The contact's ID (UUID format).",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  contacts: ContactResponse[]
}
