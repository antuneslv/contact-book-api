import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateUserResponse {
  @ApiProperty({
    description: 'The access token for the authenticated user.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJpYXQiOjE1MTI5NDQwMDAsImV4cCI6MTUxMjk0NzYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string
}
