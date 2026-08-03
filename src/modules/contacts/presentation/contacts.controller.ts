import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { type TokenPayload } from '@/crypto/token.service'
import { CurrentUser } from '@/decorators/current-user.decorator'

import { CreateContactUseCase } from '../application/create-contact.usecase'
import { DeleteContactUseCase } from '../application/delete-contact.usecase'
import { FetchContactsUseCase } from '../application/fetch-contacts.usecase'
import { GetContactUseCase } from '../application/get-contact.usecase'
import { UpdateContactUseCase } from '../application/update-contact.usecase'
import { ContactResponse } from './dtos/contact.response'
import { CreateContactRequest } from './dtos/create-contact.request'
import { FetchContactsResponse } from './dtos/fetch-contacts.response'
import { UpdateContactRequest } from './dtos/update-contact.request'

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly getContactUseCase: GetContactUseCase,
    private readonly fetchContactsUseCase: FetchContactsUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase,
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
      'Retrieves every contact owned by the authenticated user, ordered by name. Returns an empty list when there are none.',
  })
  @ApiOkResponse({
    description: 'The contacts have been successfully retrieved.',
    type: FetchContactsResponse,
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
    return this.fetchContactsUseCase.execute(user.sub)
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
  @ApiNotFoundResponse({
    description:
      'No contact with the provided ID belongs to the authenticated user.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact not found',
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

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Replace a contact',
    description:
      'Full replacement: every field must be sent. E-mail, birthday, category and observations may be sent as null to clear them.',
  })
  @ApiOkResponse({
    description: 'The contact has been successfully replaced.',
    type: ContactResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid or incomplete request payload.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name should not be empty',
          'phone should not be empty',
          'email should not be null or undefined',
          'birthday should not be null or undefined',
          'category should not be null or undefined',
          'observations should not be null or undefined',
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
    description:
      'No contact with the provided ID belongs to the authenticated user.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact not found',
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
  async update(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Body() body: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const result = await this.updateContactUseCase.execute(id, user.sub, body)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete a contact',
    description:
      'Deletes a contact owned by the authenticated user. This action cannot be undone.',
  })
  @ApiNoContentResponse({
    description: 'The contact has been successfully deleted.',
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
    description:
      'No contact with the provided ID belongs to the authenticated user.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact not found',
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
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    const result = await this.deleteContactUseCase.execute(id, user.sub)

    if (result.isLeft()) {
      throw result.value
    }
  }
}
