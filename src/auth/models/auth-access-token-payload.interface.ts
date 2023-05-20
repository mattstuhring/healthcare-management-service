import { RoleEntity } from '../../roles/entity/role.entity';

export interface AuthAccessTokenPayload {
  username: string;
  role: RoleEntity;
}
