import { RoleEntity } from '../../common/roles/entity/role.entity';

export interface AuthAccessTokenPayload {
  username: string;
  role: RoleEntity;
}
