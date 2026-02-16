import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(dto: any) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const role = await this.roleRepository.findOne({ where: { name: 'volunteer' } });
    if (!role) {
      throw new Error('Default role "volunteer" not found. Check database seeding.');
    }
    
    try {
      const user = await this.usersService.create({
        ...dto,
        password: hashedPassword,
        role: role,
      });
      return this.generateToken(user);
    } catch (e) {
      throw new ConflictException('User with this login already exists');
    }
  }

  async login(dto: any) {
    const user = await this.usersService.findByLogin(dto.login);
    
    // --- ЛОГИ ДЛЯ ТЕСТА ---
    console.log('--- ТЕСТ АВТОРИЗАЦИИ ---');
    console.log('Логин из Swagger:', dto.login);
    console.log('Пароль из Swagger:', dto.password);
    console.log('Хеш из базы данных:', user?.password);
    
    if (user) {
      const testHash = await bcrypt.hash(dto.password, 10);
      console.log('Пример нового хеша для этого пароля:', testHash);
      
      const isMatch = await bcrypt.compare(dto.password, user.password);
      console.log('Результат сравнения bcrypt.compare:', isMatch);
    }
    console.log('------------------------');
    // ----------------------

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return this.generateToken(user);
    }
    throw new UnauthorizedException('Invalid login or password');
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, username: user.login, role: user.role?.name || 'volunteer' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async onModuleInit() {
    await this.seedRoles();
    
    // Генерируем "родной" хеш для базы
    const testHash = await bcrypt.hash('123456', 10);
    console.log('--- СКОПИРУЙ ЭТОТ ХЕШ ДЛЯ БД ---');
    console.log(testHash);
    console.log('-------------------------------');
  }
  
  private async seedRoles() {
    const rolesCount = await this.roleRepository.count();
    if (rolesCount === 0) {
      await this.roleRepository.save([
        { name: 'volunteer' },
        { name: 'admin' }
      ]);
      console.log('Roles have been initialized');
    }
  }
}