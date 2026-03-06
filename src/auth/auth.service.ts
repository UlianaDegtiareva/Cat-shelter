import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    
    try {
      const user = await this.usersService.create({
        ...dto,
        password: hashedPassword,
      });
      return this.generateToken(user);
    } catch (e) {
      throw new ConflictException('User with this login already exists');
    }
  }

  async login(dto: any) {
    const user = await this.usersService.findByLogin(dto.login); 
    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return this.generateToken(user);
    }
    throw new UnauthorizedException('Invalid login or password');
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, username: user.login };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}