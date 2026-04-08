// TODO: implement auth service
// - Register: validate, hash password (bcrypt), create user, generate tokens
// - Login: validate, compare password, generate tokens
// - Refresh: verify refresh token, issue new access token
// - Logout: invalidate token (blacklist in Redis)
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // TODO: implement all auth methods
}