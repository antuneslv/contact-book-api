import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Public } from '@/decorators/public.decorator'

import { AuthenticateUserRequest } from './dtos/authenticate-user.request'
import { AuthenticateUserResponse } from './dtos/authenticate-user.response'
import { AuthenticateUserUseCase } from '../application/authenticate-user.usecase'

@ApiTags('Authentication')
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate a user',
    description: 'Authenticates a user with the provided e-mail and password.',
  })
  @ApiOkResponse({
    description: 'The user has been successfully authenticated.',
    type: AuthenticateUserResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email should not be empty',
          'email must be an email',
          'password should not be empty',
          'password must be a string',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
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
  async login(
    @Body() body: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    const result = await this.authenticateUserUseCase.execute(body)

    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }
}
