import { Body, Controller, Get, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
import { Public } from '@/decorators/public.decorator'

import { CreateUserRequest } from './dtos/create-user.request'
import { UserResponse } from './dtos/user.response'
import { CreateUserUseCase } from '../application/create-user.usecase'
import { GetUserUseCase } from '../application/get-user.usecase'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with the provided name, email, and password.',
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name should not be empty',
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'A user with the provided email already exists.',
    schema: {
      example: {
        statusCode: 409,
        message: 'User already exists',
        error: 'Conflict',
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
  async create(@Body() body: CreateUserRequest): Promise<UserResponse> {
    const result = await this.createUserUseCase.execute(body)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }

  @Get('/me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get user',
    description: 'Retrieves the user.',
  })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: UserResponse,
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
    description: 'The requested user was not found.',
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
  async get(@CurrentUser() user: TokenPayload): Promise<UserResponse> {
    const result = await this.getUserUseCase.execute(user.sub)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }
}
