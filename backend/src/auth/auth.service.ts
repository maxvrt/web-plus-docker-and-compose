import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entity/User';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  auth(user: User) {
    const payload = { sub: user.id };
    return { auth_token: this.jwtService.sign(payload) };
  }
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByName(username, true);
    console.log(`нашли пользователя ${JSON.stringify(user.username)}`);
    if (!user) {
      return null;
    }
    console.log(`нашли пароль: ${user.password}`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`пароли совпали: ${isPasswordValid}`);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}
