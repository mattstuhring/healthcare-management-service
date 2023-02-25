import { RoleEntity } from '../../roles/role.entity';

export interface AuthAccessTokenPayload {
  username: string;
  role: RoleEntity;
}
