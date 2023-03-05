import { CreateUserDto } from '../../dtos/create-user.dto';
import { DeleteResult } from 'typeorm';
import {
  roleAdminStub,
  roleCustomerStub,
  roleEmployeeStub,
} from '../../../roles/tests/mocks/roles.stub';
import { UserEntity } from '../../user.entity';
import { GetUserDto } from '../../dtos/get-user.dto';
import { GetUserByUsernameDto } from '../../dtos/get-user-by-username.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { RoleName } from '../../../roles/constants/role-name.enum';
import { DeleteUserDto } from 'src/users/dtos/delete-user.dto';

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
const password = '$2a$12$P27vsZFe7ET6kYV36bNz2eQoXxQ25sCMjD2.c/Q9er.biDifz3kI6'; // password
const createDate = new Date();
const updateDate = new Date();

export const userAdminStub: UserEntity = {
  id: '3a3a5b16-0403-4145-8c2d-bda86c7d43af',
  name: 'Test Admin',
  dateOfBirth: '11/11/1111',
  username: 'admin@email.com',
  password,
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
  password,
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
  password,
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
  password: 'password',
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
