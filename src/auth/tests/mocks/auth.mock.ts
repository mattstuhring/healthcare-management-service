import { userCustomerStub } from '../../../users/tests/mocks/users.stub';
import { TEST_USERNAME } from './auth.stub';

/**
 * Mocks
 * Mocks are objects that have predefined behavior.
 * These objects register calls they receive, allowing us to assert how we use them in the code.
 * Unlike fakes, mocks don’t have working implementations.
 * Instead, they have pre-programmed expectations about how they will be used in the code.
 *
 * Example
 * A mock object might be programmed to return a specific value when it is called with certain arguments.
 * Mocks are generally used to test the behavior of our code rather than its output.
 * We can use mocks to verify that our code is calling the dependencies in an expected way.
 */
export const usersServiceMock = jest.fn(() => ({
  createUser: jest.fn().mockResolvedValue(userCustomerStub),
  getUserByUsername: jest.fn().mockResolvedValue(userCustomerStub),
}));

export const jwtServiceMock = jest.fn(() => ({
  verify: jest.fn(),
  decode: jest.fn().mockReturnValue({
    username: TEST_USERNAME,
  }),
  sign: jest.fn(),
}));

export const configServiceMock = jest.fn(() => {
  get: jest.fn();
});
