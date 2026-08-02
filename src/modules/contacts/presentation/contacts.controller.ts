import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { type TokenPayload } from '@/crypto/token.service'
import { CurrentUser } from '@/decorators/current-user.decorator'

import { CreateContactUseCase } from '../application/create-contact.usecase'
import { ContactResponse } from './dtos/contact.response'
import { CreateContactRequest } from './dtos/create-contact.request'

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly createContactUseCase: CreateContactUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new contact',
    description: 'Creates a new contact with the provided details.',
  })
  @ApiCreatedResponse({
    description: 'The contact has been successfully created.',
    type: ContactResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name should not be empty',
          'name must be a string',
          'phone should not be empty',
          'phone must be a string',
          'Observations must be at most 255 characters long',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User with the provided id was not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  async create(
    @CurrentUser() user: TokenPayload,
    @Body() body: CreateContactRequest,
  ): Promise<ContactResponse> {
    const result = await this.createContactUseCase.execute(user.sub, body)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }
}
