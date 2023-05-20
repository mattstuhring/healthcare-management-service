import { CreateUserDto } from '../../../../src/users/dtos/create-user.dto';
import { DeleteResult } from 'typeorm';
import {
  roleAdminStub,
  roleCustomerStub,
  roleEmployeeStub,
} from '../../roles/mocks/roles.stub';
import { UserEntity } from '../../../../src/users/entity/user.entity';
import { GetUserDto } from '../../../../src/users/dtos/get-user.dto';
import { GetUserByUsernameDto } from '../../../../src/users/dtos/get-user-by-username.dto';
import { UpdateUserDto } from '../../../../src/users/dtos/update-user.dto';
import { RoleName } from '../../../../src/roles/constants/role.enum';
import { DeleteUserDto } from '../../../../src/users/dtos/delete-user.dto';

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
const hashedPassword =
  '$2a$12$P27vsZFe7ET6kYV36bNz2eQoXxQ25sCMjD2.c/Q9er.biDifz3kI6'; // password
const createDate = new Date();
const updateDate = new Date();

/*
  Validation:
    - Passwords will contain at least 1 upper case letter
    - Passwords will contain at least 1 lower case letter
    - Passwords will contain at least 1 number or special character
    - There is length validation (min = 8, max = 32)
    - Is not empty and must be a string
*/
const validPassword = 'Password1';
export const invalidPassword = 'password';

export const userAdminStub: UserEntity = {
  id: '3a3a5b16-0403-4145-8c2d-bda86c7d43af',
  name: 'Test Admin',
  dateOfBirth: '11/11/1111',
  username: 'admin@email.com',
  password: hashedPassword,
  createDate,
  updateDate,
  records: [],
  role: roleAdminStub,
};

export const userEmployeeStub: UserEntity = {
  id: '57ab052d-9363-40ba-9696-f00fab889f57',
  name: 'Test Employee',
  dateOfBirth: '22/22/2222',
  username: 'employee@email.com',
  password: hashedPassword,
  createDate,
  updateDate,
  records: [],
  role: roleEmployeeStub,
};

export const userCustomerStub: UserEntity = {
  id: 'e382bfec-732a-44ec-a9d7-323039f07eda',
  name: 'John Doe',
  dateOfBirth: '33/33/3333',
  username: 'johndoe@email.com',
  password: hashedPassword,
  createDate,
  updateDate,
  records: [],
  role: roleCustomerStub,
};

export const deleteResult: DeleteResult = { raw: [], affected: 1 };

export const createUserDtoStub: CreateUserDto = {
  name: 'John Doe',
  dateOfBirth: '33/33/3333',
  username: 'johndoe@email.com',
  password: validPassword,
};

export const getUserDtoStub: GetUserDto = {
  id: '6f200580-8c28-49d2-bf9f-e1ed6a06c051',
};

export const getUserByUsernameDtoStub: GetUserByUsernameDto = {
  username: 'johndoe@email.com',
};

export const updateUserDtoStub: UpdateUserDto = {
  name: 'Jane Doe',
  dateOfBirth: '22/22/2222',
  username: 'janedoe@email.com',
  roleName: RoleName.CUSTOMER,
};

export const deleteUserDtoStub: DeleteUserDto = {
  id: '38f41a43-7c7d-4b94-a21d-5be764975b67',
};
