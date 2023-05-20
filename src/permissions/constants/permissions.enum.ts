export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ALL = 'ALL',
  NONE = 'NONE',
}

export enum PermissionResource {
  AUTH = 'AUTH',
  RECORDS = 'RECORDS',
  ROLES = 'ROLES',
  USERS = 'USERS',
  ALL = 'ALL',
  NONE = 'NONE',
}
