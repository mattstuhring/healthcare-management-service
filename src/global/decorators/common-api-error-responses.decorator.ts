import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function CommonApiErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiUnauthorizedResponse({ description: 'Unauthenticated request' }),
    ApiForbiddenResponse({ description: 'Unauthorized Request' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
}
