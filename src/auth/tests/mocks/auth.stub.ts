import { AuthJwtResponse } from '../../models/auth-jwt-response.interface';
import { AuthLoginUserDto } from '../../dtos/auth-login-user.dto';
import { AuthRefreshTokenDto } from '../../dtos/auth-refresh-token.dto';
import { AuthRefreshTokenPayload } from '../../models/auth-refresh-token-payload.interface';

/**
 * Stubs
 * Stubs are objects that return predefined values.
 * Like mocks, they don’t have working implementations.
 * However, unlike mocks, they are not programmed to expect specific calls.
 * Instead, they return values when they are called.
 *
 * Example
 * A stub might be programmed to always return the same value when called with any arguments.
 * Stubs are generally used to provide data that our code needs to run. This data can be hard-coded or generated dynamically.
 */
export const TEST_USERNAME = 'test@email.com';
const TEST_ACCESS_TOKEN = 'test-access-token';
const TEST_REFRESH_TOKEN = 'test-refresh-token';
const TEST_PASSWORD = 'Password1';

export const authLoginUserDtoStub: AuthLoginUserDto = {
  username: TEST_USERNAME,
  password: TEST_PASSWORD,
};

export const authJwtResponseStub: AuthJwtResponse = {
  accessToken: TEST_ACCESS_TOKEN,
  refreshToken: TEST_REFRESH_TOKEN,
};

export const authRefreshTokenDtoStub: AuthRefreshTokenDto = {
  refreshToken: TEST_REFRESH_TOKEN,
};

export const authRefreshTokenPayloadStub: AuthRefreshTokenPayload = {
  username: TEST_USERNAME,
};
