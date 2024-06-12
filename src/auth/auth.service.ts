import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserRepository } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await this.userRepository.addUser(username, hashedPassword);
    return user
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findUser(username)
    if (user && await bcryptjs.compare(password, user.password)) {
      return this.jwtService.sign({ username }, { secret: process.env.JWT_SECRET });
    }
    return null;
  }
}
