import { ApiProperty } from '@nestjs/swagger'

import { ContactResponse } from './contact.response'

export class FetchContactsResponse {
  @ApiProperty({
    description: "The authenticated user's contacts, ordered by name.",
    type: [ContactResponse],
  })
  contacts: ContactResponse[]
}
