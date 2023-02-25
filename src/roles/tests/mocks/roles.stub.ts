import { RoleName } from '../../constants/role-name.enum';
import { RoleEntity } from '../../role.entity';

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
export const roleAdminStub: RoleEntity = {
  id: '1d1d0a4b-5f15-4dc4-afc7-f9dc4e9eeca3',
  name: RoleName.ADMIN,
  create: true,
  read: true,
  update: true,
  delete: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  users: [],
};

export const roleEmployeeStub: RoleEntity = {
  id: '0a7c7cac-5016-4c71-9631-479e17f0b222',
  name: RoleName.EMPLOYEE,
  create: true,
  read: true,
  update: true,
  delete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  users: [],
};

export const roleCustomerStub: RoleEntity = {
  id: 'b422a700-4647-4695-9e95-da2382b6d1b3',
  name: RoleName.CUSTOMER,
  create: false,
  read: true,
  update: false,
  delete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  users: [],
};
