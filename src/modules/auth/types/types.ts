import { EUserRoles } from '../../users/constants/constants';

export interface JwtPayload {
  sub: number;
  email: string;
  role: EUserRoles;
}

export interface AuthenticatedRequest extends Request {
  headers: {
    authorization: string;
  } & Request['headers'];
  user: JwtPayload;
}
