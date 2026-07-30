import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { CreateUserRequest } from './dtos/create-user.request'
import { UserResponse } from './dtos/user.response'
import { CreateUserUseCase } from '../application/create-user.usecase'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
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
}
