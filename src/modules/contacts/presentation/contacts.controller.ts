import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { type TokenPayload } from '@/crypto/token.service'
import { CurrentUser } from '@/decorators/current-user.decorator'

import { CreateContactUseCase } from '../application/create-contact.usecase'
import { ContactResponse } from './dtos/contact.response'
import { CreateContactRequest } from './dtos/create-contact.request'
import { FetchContactsUseCase } from '../application/fetch-contacts.usecase'
import { GetContactUseCase } from '../application/get-contact.usecase'
import { FetchContactsResponse } from './dtos/fetch-contacts.response'

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly getContactUseCase: GetContactUseCase,
    private readonly fetchContactsUseCase: FetchContactsUseCase,
  ) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new contact',
    description:
      'Creates a contact owned by the authenticated user. Optional fields may be omitted or sent as null.',
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
          'birthday must be a calendar date in YYYY-MM-DD format',
          'observations must be shorter than or equal to 255 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication token is missing or invalid.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The authenticated user no longer exists.',
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

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Fetch contacts',
    description:
      'Retrieves a contact list owned by the authenticated user based on its ID.',
  })
  @ApiOkResponse({
    description: 'The contacts have been successfully retrieved.',
    type: ContactResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication token is missing or invalid.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized',
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
  async fetchContacts(
    @CurrentUser() user: TokenPayload,
  ): Promise<FetchContactsResponse> {
    const result = await this.fetchContactsUseCase.execute(user.sub)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a contact by ID',
    description:
      'Retrieves a contact owned by the authenticated user based on its ID.',
  })
  @ApiOkResponse({
    description: 'The contact has been successfully retrieved.',
    type: ContactResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication token is missing or invalid.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid token',
        error: 'Unauthorized',
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
  async get(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<ContactResponse> {
    const result = await this.getContactUseCase.execute(id, user.sub)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }
}
