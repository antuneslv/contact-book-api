import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

import { type TokenPayload } from '@/crypto/token.service'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { Public } from '@/decorators/public.decorator'

import { CreateUserRequest } from './dtos/create-user.request'
import { UserResponse } from './dtos/user.response'
import { CreateUserUseCase } from '../application/create-user.usecase'
import { DeleteUserUseCase } from '../application/delete-user.usecase'
import { GetUserUseCase } from '../application/get-user.usecase'
import { UpdateUserRequest } from './dtos/update-user.request'
import { UpdateUserPasswordUseCase } from '../application/update-user-password.usecase'
import { UpdateUserUseCase } from '../application/update-user.usecase'
import { UpdateUserPasswordRequest } from './dtos/update-user-password.request'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
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
          'name must be shorter than or equal to 100 characters',
          'name should not be empty',
          'name must be a string',
          'email should not be empty',
          'email must be an email',
          'password must be shorter than or equal to 72 characters',
          'password must be longer than or equal to 6 characters',
          'password should not be empty',
          'password must be a string',
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

  @Get('me')
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

  @Patch('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Update user's name or e-mail",
    description:
      'Partial update. Omitted fields keep their current value. The e-mail must not be in use by another account.',
  })
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
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
  @ApiConflictResponse({
    description: 'E-mail already taken by another user.',
    schema: {
      example: {
        statusCode: 409,
        message: 'E-mail already taken',
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
  async update(
    @CurrentUser() user: TokenPayload,
    @Body() body: UpdateUserRequest,
  ): Promise<UserResponse> {
    const result = await this.updateUserUseCase.execute(user.sub, body)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Update user's password",
    description:
      "Update user's password. Minimum 6 characters. Cannot be the same as the current password.",
  })
  @ApiNoContentResponse({
    description: "The user's password has been successfully updated.",
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'currentPassword should not be empty',
          'currentPassword must be a string',
          'newPassword must be shorter than or equal to 72 characters',
          'newPassword must be longer than or equal to 6 characters',
          'newPassword should not be empty',
          'newPassword must be a string',
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
    description: 'The requested user was not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    description:
      'The current password is incorrect, or the new password is the same as the current one.',
    schema: {
      example: {
        statusCode: 422,
        message: 'Invalid current password',
        error: 'Unprocessable Entity',
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
  async updatePassword(
    @CurrentUser() user: TokenPayload,
    @Body() body: UpdateUserPasswordRequest,
  ): Promise<void> {
    const result = await this.updateUserPasswordUseCase.execute(user.sub, body)

    if (result.isLeft()) {
      throw result.value
    }
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Delete user's account",
    description:
      "Delete the user's account. This action cannot be undone. All of the user's data, including associated contacts, will be permanently deleted.",
  })
  @ApiNoContentResponse({
    description: "The user's account has been successfully deleted.",
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
  async delete(@CurrentUser() user: TokenPayload): Promise<void> {
    const result = await this.deleteUserUseCase.execute(user.sub)

    if (result.isLeft()) {
      throw result.value
    }
  }
}
