import { EUserRoles } from '../../users/dtos/user.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: EUserRoles;
}
